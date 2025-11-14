import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/auth'
import prisma from '../../../../lib/prisma'
import bcrypt from 'bcrypt'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin of the organization
    const membership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: session.user.currentOrganizationId,
        },
      },
    })

    if (!membership || membership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only organization admins can view employees' },
        { status: 403 }
      )
    }

    // Get all members of the organization
    const memberships = await prisma.organizationMembership.findMany({
      where: {
        organizationId: session.user.currentOrganizationId,
      },
      include: {
        user: {
          include: {
            profile: true,
            department: true,
          },
        },
      },
      orderBy: {
        role: 'asc',
      },
    })

    const users = memberships.map((m) => m.user)

    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch employees', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.user?.currentOrganizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin of the organization
    const membership = await prisma.organizationMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId: session.user.currentOrganizationId,
        },
      },
    })

    if (!membership || membership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only organization admins can create employees' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { email, password, fullName, phone, departmentName, roleTitle, managerId, role } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const hashed = await bcrypt.hash(password, 10)
    const department = departmentName
      ? await prisma.department.upsert({
          where: { name: departmentName },
          update: {},
          create: { name: departmentName },
        })
      : undefined

    const now = Math.floor(Date.now() / 1000)

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        profile: {
          create: {
            fullName: fullName ?? undefined,
            phone: phone ?? undefined,
            roleTitle: roleTitle ?? undefined,
          },
        },
        departmentId: department ? department.id : undefined,
        managerId: managerId ?? undefined,
        defaultOrganizationId: session.user.currentOrganizationId,
        createdAt: now,
        updatedAt: now,
      },
      include: { profile: true },
    })

    // Create organization membership
    await prisma.organizationMembership.create({
      data: {
        userId: user.id,
        organizationId: session.user.currentOrganizationId,
        role: role ?? 'MEMBER',
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Failed to create employee', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}
