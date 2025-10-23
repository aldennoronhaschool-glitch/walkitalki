'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFriendsStore } from '@/lib/store'
import { friendsAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { 
  UserPlus, 
  Check, 
  X, 
  User,
  Clock
} from 'lucide-react'

export default function FriendRequests() {
  const { friendRequests } = useFriendsStore()
  const [loading, setLoading] = useState<string | null>(null)

  const handleRequestResponse = async (fromUserId: string, accepted: boolean) => {
    setLoading(fromUserId)
    try {
      await friendsAPI.respondToRequest(fromUserId, accepted)
      
      if (accepted) {
        toast.success('Friend request accepted!')
      } else {
        toast.success('Friend request declined')
      }
      
      // Remove the request from the list
      useFriendsStore.getState().removeFriendRequest(fromUserId)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to respond to request')
    } finally {
      setLoading(null)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Friend Requests</h2>
        <p className="text-white/60">{friendRequests.length} pending requests</p>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {friendRequests.length === 0 ? (
          <div className="text-center py-16">
            <UserPlus className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white/70 mb-2">No Friend Requests</h3>
            <p className="text-white/50">You don't have any pending friend requests</p>
          </div>
        ) : (
          friendRequests.map((request) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                    {request.from.avatar ? (
                      <img 
                        src={request.from.avatar} 
                        alt={request.from.username} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white">{request.from.username}</h3>
                    <p className="text-white/60">ID: {request.from.uniqueId}</p>
                    <div className="flex items-center space-x-1 text-white/40 text-sm mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(request.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRequestResponse(request.from._id, true)}
                    disabled={loading === request.from._id}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading === request.from._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Check className="w-5 h-5" />
                    )}
                    <span>Accept</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRequestResponse(request.from._id, false)}
                    disabled={loading === request.from._id}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                    <span>Decline</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-3">How Friend Requests Work</h3>
        <div className="space-y-2 text-white/70">
          <p>• Share your unique ID with friends to receive requests</p>
          <p>• Accept requests to add friends to your list</p>
          <p>• Friends can then call you via walkie-talkie or video</p>
          <p>• You can remove friends anytime from the Friends tab</p>
        </div>
      </motion.div>
    </div>
  )
}
