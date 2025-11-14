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

    // Simple monthly sales totals by month (from invoices) for user's organization
    // Note: Using Prisma.sql for parameterized queries
    const rows = await prisma.$queryRaw<Array<{ month: string; total: number }>>`
      SELECT strftime('%Y-%m', datetime(createdAt, 'unixepoch')) as month, SUM(totalAmount) as total
      FROM Invoice
      WHERE organizationId = ${session.user.currentOrganizationId}
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `

    return NextResponse.json(rows)
  } catch (error) {
    console.error('Failed to fetch sales summary', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales summary' },
      { status: 500 }
    )
  }
}
