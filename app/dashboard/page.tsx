import { Metadata } from 'next'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { DashboardCards } from '@/components/dashboard/DashboardCards'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.',
}

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
            <DashboardCards />
          </div>
        </main>
      </div>
    </div>
  )
}
</boltArtifact>

Now, let's set up the authentication API routes:

<boltArtifact id="auth-api-routes" title="Create authentication API routes">
<boltAction type="file" filePath="app/api/auth/[...nextauth]/route.ts">
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.hashedPassword) {
          return null
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isCorrectPassword) {
          return null
        }

        return user
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login"
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }