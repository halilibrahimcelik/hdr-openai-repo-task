import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { QueryProvider } from "@/app/providers/query-provider"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "OpenAI GitHub Explorer",
  description: "Explore OpenAI's public GitHub repositories",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-mono">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
