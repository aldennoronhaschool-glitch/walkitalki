'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function AuthCallback() {
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      // Verify the token and get user data
      const verifyToken = async () => {
        try {
          const response = await authAPI.verify()
          setAuth(response.data.user, token)
          toast.success('Login successful!')
          window.location.href = '/dashboard'
        } catch (error) {
          console.error('Token verification error:', error)
          toast.error('Login failed')
          window.location.href = '/'
        }
      }
      
      verifyToken()
    } else {
      toast.error('No authentication token received')
      window.location.href = '/'
    }
  }, [searchParams, setAuth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/70">Completing authentication...</p>
      </div>
    </div>
  )
}
