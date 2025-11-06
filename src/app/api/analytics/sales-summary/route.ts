import prisma from '../../../../lib/prisma'

export async function GET() {
  // Simple monthly sales totals by month (from invoices)
  const rows: any = await prisma.$queryRaw`
    SELECT strftime('%Y-%m', createdAt) as month, SUM(totalAmount) as total
    FROM Invoice
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12;
  `
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } })
}
