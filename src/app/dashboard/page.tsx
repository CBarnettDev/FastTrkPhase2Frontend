'use client'
import Sidebar from "@/app/components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
  )
}
