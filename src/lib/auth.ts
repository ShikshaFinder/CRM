import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import prisma from './prisma'

export const authOptions: any = {
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null
        
        // Check if user is active
        if (!user.isActive) {
          throw new Error('Your account is not active. Please verify your email first.')
        }
        
        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email address before signing in.')
        }
        
        // Passwords in seed are plaintext 'changeme' - in production store hashed passwords
        const isHashed = user.password && user.password.startsWith('$2')
        const valid = isHashed
          ? await bcrypt.compare(credentials.password, user.password)
          : credentials.password === user.password
        if (!valid) return null
        return { id: user.id, email: user.email }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.sub = user.id
      return token
    },
    async session({ session, token }: any) {
      if (token?.sub) session.user = { id: token.sub, email: session.user?.email }
      return session
    }
  }
}

export default authOptions
