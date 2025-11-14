import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "./prisma";

export const authOptions: any = {
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            profile: true,
            roles: {
              include: {
                role: true,
              },
            },
            department: true,
            memberships: true,
          },
        });
        if (!user) return null;

        // Check if user is active
        if (!user.isActive) {
          throw new Error(
            "Your account is not active. Please verify your email first."
          );
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error(
            "Please verify your email address before signing in."
          );
        }

        // Passwords in seed are plaintext 'changeme' - in production store hashed passwords
        const isHashed = user.password && user.password.startsWith("$2");
        const valid = isHashed
          ? await bcrypt.compare(credentials.password, user.password)
          : credentials.password === user.password;
        if (!valid) return null;

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: Math.floor(Date.now() / 1000) },
        });

        return {
          id: user.id,
          email: user.email,
          profile: user.profile,
          roles: user.roles.map((ur) => ur.role.name),
          department: user.department?.name,
          defaultOrganizationId: user.defaultOrganizationId,
          memberships: user.memberships.map((membership) => ({
            organizationId: membership.organizationId,
            role: membership.role,
          })),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.profile = user.profile;
        token.roles = user.roles;
        token.department = user.department;
        token.defaultOrganizationId = user.defaultOrganizationId;
        token.memberships = user.memberships;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token?.sub) {
        session.user = {
          id: token.sub,
          email: token.email || session.user?.email,
          profile: token.profile,
          roles: token.roles || [],
          department: token.department,
          defaultOrganizationId: token.defaultOrganizationId,
          memberships: token.memberships || [],
        };
      }
      return session;
    },
  },
};

export default authOptions;
