import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function HospitalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}

