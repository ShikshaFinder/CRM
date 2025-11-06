import prisma from '../../../../lib/prisma'
import bcrypt from 'bcrypt'

export async function GET() {
  const users = await prisma.user.findMany({ include: { profile: true, department: true } })
  return new Response(JSON.stringify(users), { headers: { 'Content-Type': 'application/json' } })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, fullName, phone, departmentName, roleTitle, managerId } = body
  if (!email || !password) return new Response(JSON.stringify({ error: 'email and password required' }), { status: 400 })

  const hashed = await bcrypt.hash(password, 10)
  const department = departmentName ? await prisma.department.upsert({ where: { name: departmentName }, update: {}, create: { name: departmentName } }) : undefined

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      profile: { create: { fullName: fullName ?? undefined, phone: phone ?? undefined, roleTitle: roleTitle ?? undefined } },
      departmentId: department ? department.id : undefined,
      managerId: managerId ?? undefined
    },
    include: { profile: true }
  })

  return new Response(JSON.stringify(user), { status: 201 })
}
