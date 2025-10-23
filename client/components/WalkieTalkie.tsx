'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFriendsStore, useCallStore, useAuthStore } from '@/lib/store'
import { socketManager } from '@/lib/socket'
import toast from 'react-hot-toast'
import { 
  Mic, 
  MicOff, 
  Users, 
  Volume2, 
  VolumeX,
  Phone,
  Video,
  User
} from 'lucide-react'

export default function WalkieTalkie() {
  const { friends } = useFriendsStore()
  const { isInCall, callType, callPartner, isCallActive } = useCallStore()
  const [selectedFriend, setSelectedFriend] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(50)
  const [isConnected, setIsConnected] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioElementRef.current = new Audio()
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const handleFriendSelect = (friend: any) => {
    setSelectedFriend(friend)
    setIsConnected(true)
    toast.success(`Connected to ${friend.username}`)
  }

  const startRecording = async () => {
    if (!selectedFriend) {
      toast.error('Please select a friend first')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        sendAudioData(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      toast.success('Recording started')
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast.error('Failed to access microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      toast.success('Recording stopped')
    }
  }

  const sendAudioData = (audioBlob: Blob) => {
    if (selectedFriend && socketManager.isSocketConnected()) {
      // Convert blob to base64 for transmission
      const reader = new FileReader()
      reader.onload = () => {
        const base64Audio = reader.result as string
        socketManager.sendWalkieTalkieAudio(selectedFriend._id, base64Audio)
      }
      reader.readAsDataURL(audioBlob)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (audioElementRef.current) {
      audioElementRef.current.volume = newVolume / 100
    }
  }

  const handleAudioCall = () => {
    if (selectedFriend) {
      const user = useAuthStore.getState().user
      if (user) {
        socketManager.initiateAudioCall(selectedFriend._id, user)
        toast.success(`Calling ${selectedFriend.username}...`)
      }
    }
  }

  const handleVideoCall = () => {
    if (selectedFriend) {
      const user = useAuthStore.getState().user
      if (user) {
        socketManager.initiateVideoCall(selectedFriend._id, user)
        toast.success(`Video calling ${selectedFriend.username}...`)
      }
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Walkie-Talkie</h2>
        <p className="text-white/60">Hold to talk, release to send</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Friends List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-white mb-4">Select Friend</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {friends.filter(friend => friend.isOnline).map((friend) => (
              <motion.button
                key={friend._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFriendSelect(friend)}
                className={`w-full p-3 rounded-xl transition-all text-left ${
                  selectedFriend?._id === friend._id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      {friend.avatar ? (
                        <img 
                          src={friend.avatar} 
                          alt={friend.username} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white/20"></div>
                  </div>
                  <div>
                    <p className="font-medium">{friend.username}</p>
                    <p className="text-xs opacity-70">ID: {friend.uniqueId}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Walkie-Talkie Interface */}
        <div className="lg:col-span-2">
          {selectedFriend ? (
            <div className="text-center">
              {/* Connection Status */}
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-white/70">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <p className="text-white/60">Talking to: {selectedFriend.username}</p>
              </div>

              {/* Main Push-to-Talk Button */}
              <div className="relative mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-red-600 shadow-lg shadow-red-600/50'
                      : 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/30'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                  
                  {/* Pulse ring animation when recording */}
                  {isRecording && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 pulse-ring"></div>
                  )}
                </motion.button>
                
                <p className="text-white/60 text-sm mt-4">
                  {isRecording ? 'Recording... Release to send' : 'Hold to talk'}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-6 mb-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-colors ${
                    isMuted ? 'bg-red-600' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                  )}
                </motion.button>

                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-white/60" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white/60 text-sm w-8">{volume}</span>
                </div>
              </div>

              {/* Call Buttons */}
              <div className="flex items-center justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAudioCall}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>Audio Call</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVideoCall}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  <Video className="w-5 h-5" />
                  <span>Video Call</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white/70 mb-2">No Friend Selected</h3>
              <p className="text-white/50">Choose a friend from the list to start communicating</p>
            </div>
          )}
        </div>
      </div>

      {/* Call Status */}
      {isInCall && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
              {callPartner?.avatar ? (
                <img 
                  src={callPartner.avatar} 
                  alt={callPartner.username} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <p className="text-white font-medium">
                {callType === 'audio' ? 'Audio Call' : 'Video Call'} with {callPartner?.username}
              </p>
              <p className="text-white/60 text-sm">
                {isCallActive ? 'Connected' : 'Connecting...'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => useCallStore.getState().resetCall()}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
