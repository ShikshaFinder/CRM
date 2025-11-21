import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/auth'
import prisma from '../../../../lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const organizationId = session.user.currentOrganizationId

    // Get employees under this manager
    const teamMembers = await prisma.user.findMany({
      where: {
        managerId: userId,
        memberships: {
          some: {
            organizationId: organizationId,
          },
        },
      },
      include: {
        profile: true,
        department: true,
        activities: {
          where: {
            organizationId: organizationId,
            createdAt: {
              gte: Math.floor(new Date().setHours(0, 0, 0, 0) / 1000), // Today
            },
          },
        },
      },
    })

    // Get all activities for team members (for pending tasks)
    const teamMemberIds = teamMembers.map((m) => m.id)
    const todayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)
    const todayEnd = Math.floor(new Date().setHours(23, 59, 59, 999) / 1000)

    const teamActivities = teamMemberIds.length > 0
      ? await prisma.activity.findMany({
          where: {
            organizationId: organizationId,
            userId: {
              in: teamMemberIds,
            },
            type: 'TASK',
            createdAt: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        })
      : []

    // Get pending follow-ups (activities with type FOLLOW_UP)
    const pendingFollowUps = teamMemberIds.length > 0
      ? await prisma.activity.findMany({
          where: {
            organizationId: organizationId,
            userId: {
              in: teamMemberIds,
            },
            type: 'FOLLOW_UP',
            createdAt: {
              gte: todayStart - 7 * 24 * 60 * 60, // Last 7 days
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })
      : []

    // Get service tickets
    const tickets = await prisma.supportTicket.findMany({
      where: {
        organizationId: organizationId,
      },
      include: {
        connection: {
          include: {
            contacts: {
              where: {
                isPrimary: 1,
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    // Get sales inquiries (leads)
    const salesInquiries = await prisma.salesInquiry.findMany({
      where: {
        organizationId: organizationId,
      },
      include: {
        connection: true,
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate metrics
    const totalEmployees = teamMembers.length
    const pendingTasks = teamActivities.filter((a) => a.type === 'TASK').length
    const pendingFollowUpsCount = pendingFollowUps.length

    // Service ticket metrics
    const openTickets = tickets.filter((t) => t.status === 'OPEN').length
    const escalatedTickets = tickets.filter((t) => t.priority === 'HIGH' || t.priority === 'CRITICAL').length
    const assignedTickets = tickets.filter((t) => t.status !== 'CLOSED').length

    // Sales & Leads metrics
    const totalInquiries = salesInquiries.length
    const assignedInquiries = salesInquiries.filter((i) => i.status && i.status !== 'NEW').length
    const hotLeads = salesInquiries.filter((i) => i.status === 'HOT' || i.status === 'QUOTED').length
    const upcomingFollowUps = pendingFollowUps.filter((f) => {
      const followUpDate = f.createdAt
      const today = Math.floor(Date.now() / 1000)
      return followUpDate >= today && followUpDate <= today + 24 * 60 * 60
    }).length
    const delayedFollowUps = pendingFollowUps.filter((f) => {
      const followUpDate = f.createdAt
      const today = Math.floor(Date.now() / 1000)
      return followUpDate < today
    }).length

    // Calculate conversion rate (inquiries that became orders)
    const convertedInquiries = salesInquiries.filter((i) => i.status === 'CONVERTED' || i.status === 'ORDERED').length
    const conversionRate = totalInquiries > 0 ? Math.round((convertedInquiries / totalInquiries) * 100) : 0

    // Prepare team activity data
    const teamActivityData = teamMembers.map((member) => {
      const tasksCompletedToday = member.activities.filter((a) => a.type === 'TASK').length
      const totalTasks = teamActivities.filter((a) => a.userId === member.id).length
      const progress = totalTasks > 0 ? Math.min(100, (tasksCompletedToday / totalTasks) * 100) : 0

      // Determine current status (simplified - you can enhance this)
      let currentStatus = 'Idle'
      if (tasksCompletedToday > 5) {
        currentStatus = 'On Visit'
      } else if (tasksCompletedToday > 2) {
        currentStatus = 'At Office'
      }

      return {
        id: member.id,
        name: member.profile?.fullName || member.email.split('@')[0],
        email: member.email,
        profile: member.profile,
        department: member.department?.name || 'N/A',
        tasksCompletedToday,
        totalTasks,
        progress,
        currentStatus,
      }
    })

    return NextResponse.json({
      metrics: {
        totalEmployees,
        pendingTasks,
        pendingFollowUps: pendingFollowUpsCount,
      },
      teamActivity: teamActivityData,
      serviceTickets: {
        summary: {
          openTickets,
          escalatedTickets,
          assignedTickets,
        },
        tickets: tickets.slice(0, 4).map((ticket) => ({
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          category: ticket.issueType,
          issue: ticket.issueType,
          priority: ticket.priority,
          assignedTo: ticket.connection?.contacts[0]?.fullName || ticket.connection?.name || 'Unassigned',
          status: ticket.status,
        })),
      },
      salesPipeline: {
        totalInquiries,
        assignedInquiries,
        conversionRate,
        hotLeads,
        upcomingFollowUps,
        delayedFollowUps,
      },
    })
  } catch (error) {
    console.error('Failed to fetch manager dashboard data', error)
    return NextResponse.json(
      { error: 'Failed to fetch manager dashboard data' },
      { status: 500 }
    )
  }
}

