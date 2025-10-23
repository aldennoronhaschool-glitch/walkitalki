#!/bin/bash

echo "Installing WalkieTalkie App Dependencies..."
echo

echo "Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing root dependencies"
    exit 1
fi

echo
echo "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Error installing server dependencies"
    exit 1
fi

echo
echo "Installing client dependencies..."
cd ../client
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "Error installing client dependencies"
    exit 1
fi

echo
echo "Installation completed successfully!"
echo
echo "Next steps:"
echo "1. Copy server/env.example to server/.env"
echo "2. Update the .env file with your MongoDB URI and Google OAuth credentials"
echo "3. Run: npm run dev"
echo
