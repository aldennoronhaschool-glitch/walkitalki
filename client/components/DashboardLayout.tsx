'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store'
import { authAPI } from '@/lib/api'
import { 
  Users, 
  Mic, 
  UserPlus, 
  LogOut, 
  Settings,
  Bell,
  User as UserIcon
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab: 'friends' | 'walkie' | 'requests'
  setActiveTab: (tab: 'friends' | 'walkie' | 'requests') => void
}

export default function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
  const { user, clearAuth } = useAuthStore()
  const [showSettings, setShowSettings] = useState(false)

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      clearAuth()
      toast.success('Logged out successfully')
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      clearAuth()
      window.location.href = '/'
    }
  }

  const tabs = [
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'walkie', label: 'Walkie-Talkie', icon: Mic },
    { id: 'requests', label: 'Requests', icon: UserPlus },
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">WalkieTalkie</h1>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{user?.username}</p>
                  <p className="text-xs text-white/60">ID: {user?.uniqueId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  )
                })}
              </div>

              {/* User Stats */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-center">
                  <p className="text-sm text-white/60">Your Unique ID</p>
                  <p className="text-lg font-mono font-bold text-white">{user?.uniqueId}</p>
                  <p className="text-xs text-white/50 mt-1">Share this to receive friend requests</p>
                </div>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 min-h-[600px]">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-white/70 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Notifications</span>
                <button className="w-12 h-6 bg-primary-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Audio Quality</span>
                <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Video Quality</span>
                <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
