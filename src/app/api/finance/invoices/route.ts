import prisma from '../../../../lib/prisma'

export async function GET() {
  const invoices = await prisma.invoice.findMany({ include: { salesOrder: true, payments: true } })
  return new Response(JSON.stringify(invoices), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { invoiceNumber, salesOrderId, dueDate, totalAmount } = body
  if (!invoiceNumber || !totalAmount) return new Response(JSON.stringify({ error: 'invoiceNumber and totalAmount required' }), { status: 400 })
  const inv = await prisma.invoice.create({ data: { invoiceNumber, salesOrderId: salesOrderId ?? undefined, dueDate: dueDate ? new Date(dueDate) : undefined, totalAmount: Number(totalAmount) } })
  return new Response(JSON.stringify(inv), { status: 201 })
}
