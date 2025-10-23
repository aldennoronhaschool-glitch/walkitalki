'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function AuthError() {
  useEffect(() => {
    toast.error('Authentication failed. Please try again.')
    setTimeout(() => {
      window.location.href = '/'
    }, 3000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Authentication Failed</h2>
        <p className="text-white/70">Redirecting to login page...</p>
      </div>
    </div>
  )
}
