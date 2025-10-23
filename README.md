# 🎤 WalkieTalkie - Advanced Communication App

A modern, full-stack walkie-talkie application with video calling capabilities, built with Next.js, Node.js, and real-time communication features.

![WalkieTalkie App](https://img.shields.io/badge/Status-Live%20Demo-green)
![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-orange)

## ✨ Features

- 🔐 **Authentication**: Google OAuth and email/password registration
- 👥 **Friend System**: Unique ID-based friend requests and management
- 🎤 **Walkie-Talkie**: Push-to-talk audio communication
- 📹 **Video Calling**: High-quality video calls with friends
- 📱 **Responsive Design**: Modern UI that works on all devices
- ⚡ **Real-time**: Socket.io for instant communication
- 🔒 **Secure**: JWT authentication and secure data transmission
- 🎨 **Modern UI**: Glassmorphism design with smooth animations

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **Socket.io Client** - Real-time communication
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials (for Google login)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd walkie-talkie-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/walkie-talkie
   JWT_SECRET=your-super-secret-jwt-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Copy Client ID and Client Secret to your `.env` file

5. **MongoDB Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in your `.env` file

## Running the Application

1. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```
   
   This will start both the backend server (port 5000) and frontend development server (port 3000).

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Getting Started

1. **Register/Login**: Create an account using email/password or Google OAuth
2. **Get Your Unique ID**: Your unique 8-character ID is displayed in the dashboard
3. **Add Friends**: Share your unique ID or enter someone else's ID to send friend requests
4. **Start Communicating**: Use the walkie-talkie feature or make video calls

### Features Guide

#### Walkie-Talkie
- Select a friend from the online friends list
- Hold the microphone button to record audio
- Release to send the audio message
- Adjust volume and mute settings as needed

#### Video Calling
- Click the video call button next to any friend
- Accept incoming video calls from the notification
- End calls using the hang-up button

#### Friend Management
- Send friend requests using unique IDs
- Accept or decline incoming friend requests
- Remove friends from your friends list
- View online status of friends

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search/:uniqueId` - Search user by unique ID
- `GET /api/users/unique-id` - Get user's unique ID
- `PUT /api/users/settings` - Update user settings

### Friends
- `POST /api/friends/request` - Send friend request
- `GET /api/friends/requests` - Get friend requests
- `POST /api/friends/request/respond` - Respond to friend request
- `GET /api/friends/list` - Get friends list
- `DELETE /api/friends/remove/:friendId` - Remove friend

## Socket Events

### Client to Server
- `join` - Join with user ID
- `send-friend-request` - Send friend request
- `friend-request-response` - Respond to friend request
- `initiate-audio-call` - Start audio call
- `initiate-video-call` - Start video call
- `accept-call` - Accept incoming call
- `reject-call` - Reject incoming call
- `webrtc-signal` - WebRTC signaling
- `walkie-talkie-audio` - Send walkie-talkie audio

### Server to Client
- `friend-request-received` - Friend request notification
- `friend-request-response` - Friend request response
- `incoming-audio-call` - Incoming audio call
- `incoming-video-call` - Incoming video call
- `call-accepted` - Call accepted notification
- `call-rejected` - Call rejected notification
- `webrtc-signal` - WebRTC signaling data
- `walkie-talkie-audio` - Receive walkie-talkie audio

## Project Structure

```
walkie-talkie-app/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and stores
│   └── package.json
├── server/               # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Future Enhancements

- [ ] Group calling functionality
- [ ] Message history and chat
- [ ] File sharing capabilities
- [ ] Push notifications
- [ ] Mobile app development
- [ ] Advanced audio effects
- [ ] Screen sharing
- [ ] Call recording
