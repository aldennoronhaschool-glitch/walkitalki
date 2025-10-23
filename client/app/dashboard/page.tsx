'use client'

import { useEffect, useState } from 'react'
import { useAuthStore, useFriendsStore } from '@/lib/store'
import { socketManager } from '@/lib/socket'
import { userAPI, friendsAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import FriendsList from '@/components/FriendsList'
import WalkieTalkie from '@/components/WalkieTalkie'
import FriendRequests from '@/components/FriendRequests'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore()
  const { setFriends, setFriendRequests } = useFriendsStore()
  const [activeTab, setActiveTab] = useState<'friends' | 'walkie' | 'requests'>('friends')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/'
      return
    }

    const initializeDashboard = async () => {
      try {
        // Connect to socket
        socketManager.connect()

        // Load user data
        const [profileResponse, friendsResponse, requestsResponse] = await Promise.all([
          userAPI.getProfile(),
          friendsAPI.getFriends(),
          friendsAPI.getRequests()
        ])

        setFriends(friendsResponse.data)
        setFriendRequests(requestsResponse.data)

        toast.success('Welcome back!')
      } catch (error: any) {
        console.error('Dashboard initialization error:', error)
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()

    return () => {
      socketManager.disconnect()
    }
  }, [isAuthenticated, setFriends, setFriendRequests])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {activeTab === 'friends' && <FriendsList />}
        {activeTab === 'walkie' && <WalkieTalkie />}
        {activeTab === 'requests' && <FriendRequests />}
      </motion.div>
    </DashboardLayout>
  )
}
