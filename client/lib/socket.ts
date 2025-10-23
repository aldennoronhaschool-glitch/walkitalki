import { io, Socket } from 'socket.io-client'
import { useAuthStore } from './store'
import { useFriendsStore } from './store'
import { useCallStore } from './store'
import toast from 'react-hot-toast'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

class SocketManager {
  private socket: Socket | null = null
  private isConnected = false

  connect() {
    if (this.socket?.connected) return

    const token = useAuthStore.getState().token
    if (!token) return

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      }
    })

    this.socket.on('connect', () => {
      console.log('Connected to server')
      this.isConnected = true
      
      // Join with user ID
      const user = useAuthStore.getState().user
      if (user) {
        this.socket?.emit('join', user.id)
      }
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      toast.error('Connection failed')
    })

    // Friend request events
    this.socket.on('friend-request-received', (data) => {
      toast.success(`Friend request from ${data.from.username}`)
      // Refresh friend requests
      this.refreshFriendRequests()
    })

    this.socket.on('friend-request-response', (data) => {
      if (data.accepted) {
        toast.success(`${data.from.username} accepted your friend request`)
        // Refresh friends list
        this.refreshFriends()
      } else {
        toast.error(`${data.from.username} declined your friend request`)
      }
    })

    // Call events
    this.socket.on('incoming-audio-call', (data) => {
      const callStore = useCallStore.getState()
      callStore.setCallPartner(data.from)
      callStore.setCallType('audio')
      callStore.setIsInCall(true)
      
      toast.success(`Incoming audio call from ${data.from.username}`, {
        duration: 10000
      })
    })

    this.socket.on('incoming-video-call', (data) => {
      const callStore = useCallStore.getState()
      callStore.setCallPartner(data.from)
      callStore.setCallType('video')
      callStore.setIsInCall(true)
      
      toast.success(`Incoming video call from ${data.from.username}`, {
        duration: 10000
      })
    })

    this.socket.on('call-accepted', (data) => {
      const callStore = useCallStore.getState()
      callStore.setIsCallActive(true)
      toast.success('Call accepted')
    })

    this.socket.on('call-rejected', (data) => {
      const callStore = useCallStore.getState()
      callStore.resetCall()
      toast.error('Call rejected')
    })

    // WebRTC signaling
    this.socket.on('webrtc-signal', (data) => {
      // Handle WebRTC signaling
      this.handleWebRTCSignal(data.signal, data.fromSocketId)
    })

    // Walkie-talkie audio
    this.socket.on('walkie-talkie-audio', (data) => {
      this.handleWalkieTalkieAudio(data.audioData)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Friend request methods
  sendFriendRequest(toUserId: string, fromUser: any) {
    this.socket?.emit('send-friend-request', { toUserId, fromUser })
  }

  respondToFriendRequest(toUserId: string, accepted: boolean, fromUser: any) {
    this.socket?.emit('friend-request-response', { toUserId, accepted, fromUser })
  }

  // Call methods
  initiateAudioCall(toUserId: string, fromUser: any) {
    const callId = Math.random().toString(36).substr(2, 9)
    this.socket?.emit('initiate-audio-call', { toUserId, fromUser, callId })
    return callId
  }

  initiateVideoCall(toUserId: string, fromUser: any) {
    const callId = Math.random().toString(36).substr(2, 9)
    this.socket?.emit('initiate-video-call', { toUserId, fromUser, callId })
    return callId
  }

  answerCall(callId: string) {
    const callStore = useCallStore.getState()
    const partner = callStore.callPartner
    if (partner) {
      this.socket?.emit('accept-call', { toUserId: partner._id, callId })
    }
  }

  rejectCall(callId: string) {
    const callStore = useCallStore.getState()
    const partner = callStore.callPartner
    if (partner) {
      this.socket?.emit('reject-call', { toUserId: partner._id, callId })
    }
  }

  // WebRTC signaling
  sendWebRTCSignal(toUserId: string, signal: any) {
    this.socket?.emit('webrtc-signal', { toUserId, signal })
  }

  // Walkie-talkie methods
  sendWalkieTalkieAudio(toUserId: string, audioData: any) {
    this.socket?.emit('walkie-talkie-audio', { toUserId, audioData })
  }

  // Helper methods
  private async refreshFriendRequests() {
    try {
      const { friendsAPI } = await import('./api')
      const response = await friendsAPI.getRequests()
      useFriendsStore.getState().setFriendRequests(response.data)
    } catch (error) {
      console.error('Failed to refresh friend requests:', error)
    }
  }

  private async refreshFriends() {
    try {
      const { friendsAPI } = await import('./api')
      const response = await friendsAPI.getFriends()
      useFriendsStore.getState().setFriends(response.data)
    } catch (error) {
      console.error('Failed to refresh friends:', error)
    }
  }

  private handleWebRTCSignal(signal: any, fromSocketId: string) {
    // Implement WebRTC signal handling
    console.log('Received WebRTC signal:', signal, 'from:', fromSocketId)
  }

  private handleWalkieTalkieAudio(audioData: any) {
    // Implement walkie-talkie audio playback
    console.log('Received walkie-talkie audio:', audioData)
  }

  getSocket() {
    return this.socket
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected
  }
}

export const socketManager = new SocketManager()
