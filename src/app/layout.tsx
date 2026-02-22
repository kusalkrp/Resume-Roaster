import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Resume Roaster AI | Brutal Feedback for Job Seekers',
  description: 'Upload your resume and a job description. Get brutally roasted by an AI recruiter to find out exactly why you are getting rejected.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 min-h-screen selection:bg-rose-500/30`}>
        {children}
      </body>
    </html>
  )
}
