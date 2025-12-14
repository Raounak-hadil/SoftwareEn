import React from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function HospitalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[250px] flex flex-col">
        <Header />
        <main className="flex-1 p-[30px] bg-[#f9fafb]">{children}</main>
      </div>
    </div>
  )
}
