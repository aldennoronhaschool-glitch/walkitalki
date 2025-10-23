'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFriendsStore, useAuthStore } from '@/lib/store'
import { friendsAPI } from '@/lib/api'
import { socketManager } from '@/lib/socket'
import toast from 'react-hot-toast'
import { 
  Search, 
  UserPlus, 
  Phone, 
  Video, 
  MoreVertical,
  Trash2,
  User
} from 'lucide-react'

export default function FriendsList() {
  const { friends } = useFriendsStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [friendId, setFriendId] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState<string | null>(null)

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!friendId.trim()) return

    setLoading(true)
    try {
      const response = await friendsAPI.sendRequest(friendId)
      toast.success('Friend request sent!')
      setFriendId('')
      setShowAddFriend(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send friend request')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await friendsAPI.removeFriend(friendId)
      toast.success('Friend removed')
      setShowMenu(null)
    } catch (error: any) {
      toast.error('Failed to remove friend')
    }
  }

  const handleAudioCall = (friend: any) => {
    const user = useAuthStore.getState().user
    if (user) {
      socketManager.initiateAudioCall(friend._id, user)
      toast.success(`Calling ${friend.username}...`)
    }
  }

  const handleVideoCall = (friend: any) => {
    const user = useAuthStore.getState().user
    if (user) {
      socketManager.initiateVideoCall(friend._id, user)
      toast.success(`Video calling ${friend.username}...`)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Friends</h2>
          <p className="text-white/60">{friends.length} friends online</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddFriend(true)}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Friend</span>
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
        <input
          type="text"
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Friends List */}
      <div className="space-y-3">
        {filteredFriends.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No friends found</p>
            <p className="text-white/40 text-sm">Add friends to start communicating</p>
          </div>
        ) : (
          filteredFriends.map((friend) => (
            <motion.div
              key={friend._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                      {friend.avatar ? (
                        <img 
                          src={friend.avatar} 
                          alt={friend.username} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    {friend.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white/20"></div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white">{friend.username}</h3>
                    <p className="text-sm text-white/60">ID: {friend.uniqueId}</p>
                    <p className="text-xs text-white/40">
                      {friend.isOnline ? 'Online' : `Last seen ${new Date(friend.lastSeen).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAudioCall(friend)}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    title="Audio Call"
                  >
                    <Phone className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleVideoCall(friend)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    title="Video Call"
                  >
                    <Video className="w-5 h-5" />
                  </motion.button>
                  
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowMenu(showMenu === friend._id ? null : friend._id)}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </motion.button>
                    
                    {showMenu === friend._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 top-10 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 py-2 min-w-[120px] z-10"
                      >
                        <button
                          onClick={() => handleRemoveFriend(friend._id)}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-white/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 max-w-md w-full"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Add Friend</h3>
            
            <form onSubmit={handleAddFriend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Friend's Unique ID
                </label>
                <input
                  type="text"
                  placeholder="Enter 8-character ID"
                  value={friendId}
                  onChange={(e) => setFriendId(e.target.value.toUpperCase())}
                  maxLength={8}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddFriend(false)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !friendId.trim()}
                  className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
