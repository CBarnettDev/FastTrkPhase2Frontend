'use client'
import Sidebar from "@/app/components/Sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))
    if (!token) {
     // router.push('/login')
    }
  }, [router])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed sidebar */}
      <div className="fixed inset-y-0 left-0 w-64">
        <Sidebar />
      </div>
      
      {/* Scrollable main content */}
      <div className="flex-1 ml-64 overflow-y-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}