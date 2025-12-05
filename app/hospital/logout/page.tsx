'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate logout
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }, [router])

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging out...</p>
    </div>
  )
}

