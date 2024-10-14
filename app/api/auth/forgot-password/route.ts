import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { randomBytes } from "crypto"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return new NextResponse("Email is required", { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      // Don't reveal that the user does not exist
      return NextResponse.json({ message: "If an account exists for that email, we have sent password reset instructions." })
    }

    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires
      }
    })

    // TODO: Send email with reset link
    console.log(`Password reset link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`)

    return NextResponse.json({ message: "If an account exists for that email, we have sent password reset instructions." })
  } catch (error) {
    console.log("[FORGOT_PASSWORD_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
</boltArtifact>

Now, let's update the main layout to include the authentication provider:

<boltArtifact id="update-layout" title="Update main layout">
<boltAction type="file" filePath="app/layout.tsx">
import './globals.css'
import type { Metadata } from 'next'
import { Inter} from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Dashboard',
  description: 'A dashboard application built with Next.js and shadcn/ui',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}