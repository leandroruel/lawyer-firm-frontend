import type { Metadata } from "next"
import "../globals.css"
import { siteConfig } from "../siteConfig"

import { Sidebar } from "@/components/ui/navigation/Sidebar"

export const metadata: Metadata = {
  metadataBase: new URL("https://yoururl.com"),
  title: "Dashboard",
  description: "Seu painel de controle",
  keywords: [],
  authors: [
    {
      name: "yourname",
      url: "",
    },
  ],
  creator: "yourname",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen sm:flex-col">
      <Sidebar />
      <div className="flex-1">
        <main className="relative lg:pl-72">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
