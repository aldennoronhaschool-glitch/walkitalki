import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  username: string
  uniqueId: string
  avatar?: string
}

interface Friend {
  _id: string
  username: string
  uniqueId: string
  avatar?: string
  isOnline: boolean
  lastSeen: string
}

interface FriendRequest {
  _id: string
  from: {
    _id: string
    username: string
    uniqueId: string
    avatar?: string
  }
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (user: Partial<User>) => void
}

interface FriendsStore {
  friends: Friend[]
  friendRequests: FriendRequest[]
  setFriends: (friends: Friend[]) => void
  setFriendRequests: (requests: FriendRequest[]) => void
  addFriend: (friend: Friend) => void
  removeFriend: (friendId: string) => void
  addFriendRequest: (request: FriendRequest) => void
  removeFriendRequest: (requestId: string) => void
}

interface CallStore {
  isInCall: boolean
  callType: 'audio' | 'video' | null
  callPartner: Friend | null
  isCallActive: boolean
  setIsInCall: (inCall: boolean) => void
  setCallType: (type: 'audio' | 'video' | null) => void
  setCallPartner: (partner: Friend | null) => void
  setIsCallActive: (active: boolean) => void
  resetCall: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) => set((state) => ({ 
        user: state.user ? { ...state.user, ...userData } : null 
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

export const useFriendsStore = create<FriendsStore>((set) => ({
  friends: [],
  friendRequests: [],
  setFriends: (friends) => set({ friends }),
  setFriendRequests: (friendRequests) => set({ friendRequests }),
  addFriend: (friend) => set((state) => ({ 
    friends: [...state.friends, friend] 
  })),
  removeFriend: (friendId) => set((state) => ({ 
    friends: state.friends.filter(f => f._id !== friendId) 
  })),
  addFriendRequest: (request) => set((state) => ({ 
    friendRequests: [...state.friendRequests, request] 
  })),
  removeFriendRequest: (requestId) => set((state) => ({ 
    friendRequests: state.friendRequests.filter(r => r._id !== requestId) 
  })),
}))

export const useCallStore = create<CallStore>((set) => ({
  isInCall: false,
  callType: null,
  callPartner: null,
  isCallActive: false,
  setIsInCall: (isInCall) => set({ isInCall }),
  setCallType: (callType) => set({ callType }),
  setCallPartner: (callPartner) => set({ callPartner }),
  setIsCallActive: (isCallActive) => set({ isCallActive }),
  resetCall: () => set({ 
    isInCall: false, 
    callType: null, 
    callPartner: null, 
    isCallActive: false 
  }),
}))
