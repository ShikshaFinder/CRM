import prisma from '../../../../lib/prisma'

export async function GET() {
  const docs = await prisma.document.findMany({ orderBy: { uploadedAt: 'desc' } })
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, path, category, relatedType, relatedId, uploadedById } = body
  if (!name || !path) return new Response(JSON.stringify({ error: 'name and path required' }), { status: 400 })
  const d = await prisma.document.create({ data: { name, path, category: category ?? undefined, relatedType: relatedType ?? undefined, relatedId: relatedId ?? undefined, uploadedById: uploadedById ?? undefined } })
  return new Response(JSON.stringify(d), { status: 201 })
}
