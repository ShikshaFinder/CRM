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
        magicLinkToken: { label: "Magic Link Token", type: "text" },
      },
      async authorize(credentials: any) {
        // Handle magic link authentication
        if (credentials?.magicLinkToken) {
          const magicLinkToken = await prisma.magicLinkToken.findUnique({
            where: { token: credentials.magicLinkToken },
            include: {
              user: {
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
              },
            },
          });

          if (
            !magicLinkToken ||
            new Date() > magicLinkToken.expiresAt ||
            !magicLinkToken.user.emailVerified ||
            !magicLinkToken.user.isActive
          ) {
            return null;
          }

          // Delete used token
          await prisma.magicLinkToken.delete({
            where: { token: credentials.magicLinkToken },
          });

          // Update last login
          await prisma.user.update({
            where: { id: magicLinkToken.user.id },
            data: { lastLoginAt: Math.floor(Date.now() / 1000) },
          });

          return {
            id: magicLinkToken.user.id,
            email: magicLinkToken.user.email,
            profile: magicLinkToken.user.profile,
            roles: magicLinkToken.user.roles.map((ur) => ur.role.name),
            department: magicLinkToken.user.department?.name,
            defaultOrganizationId: magicLinkToken.user.defaultOrganizationId,
            memberships: magicLinkToken.user.memberships.map((membership) => ({
              organizationId: membership.organizationId,
              role: membership.role,
            })),
          };
        }

        // Handle regular password authentication
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
        
        // Set current organization and role from default organization or first membership
        if (user.defaultOrganizationId) {
          const defaultMembership = user.memberships.find(
            (m: any) => m.organizationId === user.defaultOrganizationId
          );
          if (defaultMembership) {
            token.currentOrganizationId = user.defaultOrganizationId;
            token.currentOrganizationRole = defaultMembership.role;
          }
        } else if (user.memberships && user.memberships.length > 0) {
          token.currentOrganizationId = user.memberships[0].organizationId;
          token.currentOrganizationRole = user.memberships[0].role;
        }
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
          currentOrganizationId: token.currentOrganizationId,
          currentOrganizationRole: token.currentOrganizationRole,
        };
      }
      return session;
    },
  },
};

export default authOptions;
