import prisma from "@/lib/prisma";

export const GET = async () => {
  const roles = await prisma.role.findMany();
  return new Response(JSON.stringify(roles), {
    headers: { "Content-Type": "application/json" },
  });
};
