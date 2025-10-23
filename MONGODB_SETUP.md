# MongoDB Setup Guide

## 🎉 Great News!
Your WalkieTalkie app is now running successfully! However, you need to set up MongoDB to store user data.

## 🚀 Quick Setup Options

### Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create a free account**
3. **Create a new cluster** (choose the free M0 tier)
4. **Get your connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `walkie-talkie`

5. **Update your `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/walkie-talkie?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB Installation

1. **Download MongoDB Community Server:**
   - Go to https://www.mongodb.com/try/download/community
   - Download for Windows
   - Install with default settings

2. **Start MongoDB:**
   ```bash
   # MongoDB should start automatically as a service
   # Or start manually:
   net start MongoDB
   ```

3. **Your current `.env` is already configured for local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/walkie-talkie
   ```

## 🔄 Restart the App

After setting up MongoDB, restart your app:

```bash
# Stop the current servers (Ctrl+C in the terminal)
# Then restart:
npm run dev
```

## ✅ Test Your Setup

1. **Open http://localhost:3000**
2. **Try to register a new account**
3. **If successful, you'll see the dashboard!**

## 🎯 What You'll See

Once MongoDB is connected, you'll have:
- ✅ **User registration and login**
- ✅ **Unique ID generation**
- ✅ **Friend request system**
- ✅ **Walkie-talkie functionality**
- ✅ **Video calling capabilities**

## 🆘 Need Help?

If you encounter any issues:
1. Check that MongoDB is running
2. Verify your connection string in `.env`
3. Make sure no firewall is blocking the connection
4. Try the MongoDB Atlas option if local setup is difficult

Your app is ready to go! 🚀
