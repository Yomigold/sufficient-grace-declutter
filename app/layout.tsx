import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SGD CRM',
  description: 'Sufficient Grace Declutter — CRM Automation System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen font-ui">
        {children}
      </body>
    </html>
  )
}
