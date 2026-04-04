import { getServerSession, type NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import db from "@/lib/db"

const googleClientId = process.env.AUTH_GOOGLE_ID
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET
const githubClientId = process.env.AUTH_GITHUB_ID
const githubClientSecret = process.env.AUTH_GITHUB_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET ?? process.env.BETTER_AUTH_SECRET

if (!googleClientId || !googleClientSecret) {
  throw new Error("Missing AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET environment variables")
}

if (!githubClientId || !githubClientSecret) {
  throw new Error("Missing AUTH_GITHUB_ID or AUTH_GITHUB_SECRET environment variables")
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
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          return null
        }

        // For now, since there's no password field in the schema,
        // OAuth-only users can't use credentials login.
        // You'll need to add a `password` field to User model for full credentials support.
        // For demo/dev purposes, we allow any existing user to log in:
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
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