const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const friendRoutes = require('./routes/friends');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/walkie-talkie')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/friends', authenticateToken, friendRoutes);

// Socket.io for real-time communication
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their user ID
  socket.on('join', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Handle friend requests
  socket.on('send-friend-request', (data) => {
    const { toUserId, fromUser } = data;
    const targetSocket = connectedUsers.get(toUserId);
    
    if (targetSocket) {
      io.to(targetSocket).emit('friend-request-received', {
        from: fromUser,
        timestamp: new Date()
      });
    }
  });

  // Handle friend request response
  socket.on('friend-request-response', (data) => {
    const { toUserId, accepted, fromUser } = data;
    const targetSocket = connectedUsers.get(toUserId);
    
    if (targetSocket) {
      io.to(targetSocket).emit('friend-request-response', {
        from: fromUser,
        accepted,
        timestamp: new Date()
      });
    }
  });

  // Handle audio call initiation
  socket.on('initiate-audio-call', (data) => {
    const { toUserId, fromUser } = data;
    const targetSocket = connectedUsers.get(toUserId);
    
    if (targetSocket) {
      io.to(targetSocket).emit('incoming-audio-call', {
        from: fromUser,
        callId: data.callId
      });
    }
  });

  // Handle video call initiation
  socket.on('initiate-video-call', (data) => {
    const { toUserId, fromUser } = data;
    const targetSocket = connectedUsers.get(toUserId);
    
    if (targetSocket) {
      io.to(targetSocket).emit('incoming-video-call', {
        from: fromUser,
        callId: data.callId
      });
    }
  });

  // Handle call acceptance
  socket.on('accept-call', (data) => {
    const { toUserId, callId } = data;
    const targetSocket = connectedUsers.get(toUserId);
    
    if (targetSocket) {
      io.to(targetSocket).emit('call-accepted', {
        callId,
        fromSocketId: socket.id
      });
    }
  });

  // Handle call rejection
  socket.on('reject-call', (data) => {
    const { toUserId, callId } = data;
    const targetSocket = connectedUsers.get(toUserId);
    
    if (targetSocket) {
      io.to(targetSocket).emit('call-rejected', {
        callId
      });
    }
  });

  // Handle WebRTC signaling
  socket.on('webrtc-signal', (data) => {
    const { toUserId, signal } = data;
    const targetSocket = connectedUsers.get(toUserId);
    
    if (targetSocket) {
      io.to(targetSocket).emit('webrtc-signal', {
        signal,
        fromSocketId: socket.id
      });
    }
  });

  // Handle walkie-talkie audio
  socket.on('walkie-talkie-audio', (data) => {
    const { toUserId, audioData } = data;
    const targetSocket = connectedUsers.get(toUserId);
    
    if (targetSocket) {
      io.to(targetSocket).emit('walkie-talkie-audio', {
        audioData,
        fromSocketId: socket.id
      });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
