import { getServerSession, type NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import db from "@/lib/db"

const googleClientId = process.env.AUTH_GOOGLE_ID
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? process.env.BETTER_AUTH_SECRET

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET environment variables")
}

if (!nextAuthSecret) {
  throw new Error("Missing NEXTAUTH_SECRET (or BETTER_AUTH_SECRET) environment variable")
}

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],
  session: { 
    strategy: "jwt" 
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        (session.user as typeof session.user & { id?: string }).id = token.sub
      }
      return session
    },
  },
}

export const auth = () => getServerSession(authOptions)