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
<<<<<<< HEAD
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
=======
    <div className="flex justify-center items-center h-screen">
>>>>>>> hospitalprofilelast
      <p>Logging out...</p>
    </div>
  )
}

