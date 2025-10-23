# Quick Setup Guide

## 🚀 Installation Complete!

The dependencies have been successfully installed. Now you need to set up your environment variables.

## 📝 Environment Setup

1. **Create the environment file:**
   ```bash
   # Copy the example file
   copy server\env.example server\.env
   ```

2. **Edit the `.env` file** in the `server` directory with your actual values:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/walkie-talkie
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

## 🔧 Required Setup

### 1. MongoDB
- **Option A (Local):** Install MongoDB locally and run it
- **Option B (Cloud):** Use MongoDB Atlas (free tier available)
  - Create account at https://www.mongodb.com/atlas
  - Create a cluster
  - Get connection string and update `MONGODB_URI`

### 2. Google OAuth (Optional but Recommended)
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
- Copy Client ID and Secret to your `.env` file

### 3. JWT Secret
- Generate a secure random string for `JWT_SECRET`
- You can use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

## 🎯 Start the Application

Once your `.env` file is configured:

```bash
# From the root directory
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend app on http://localhost:3000

## 🎉 You're Ready!

1. Open http://localhost:3000 in your browser
2. Register a new account or use Google OAuth
3. Get your unique ID and start adding friends
4. Use the walkie-talkie feature or make video calls!

## 🔍 Troubleshooting

### If you get MongoDB connection errors:
- Make sure MongoDB is running locally, or
- Check your MongoDB Atlas connection string

### If Google OAuth doesn't work:
- Verify your Google OAuth credentials
- Make sure the redirect URI is correct
- You can still use email/password registration without Google OAuth

### If you get port conflicts:
- Change the PORT in your `.env` file
- Make sure no other services are using ports 3000 or 5000

## 📱 Features Available

- ✅ **Authentication** - Email/password + Google OAuth
- ✅ **Friend System** - Unique IDs for friend requests
- ✅ **Walkie-Talkie** - Push-to-talk audio communication
- ✅ **Video Calls** - High-quality video calling
- ✅ **Real-time** - Instant notifications and updates
- ✅ **Modern UI** - Beautiful, responsive design

Enjoy your new WalkieTalkie app! 🎤📹
