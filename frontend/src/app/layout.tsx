import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zoom',
  description: 'Zoom Workplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '"Almaden Sans", Helvetica, Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}