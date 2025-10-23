@echo off
echo Uploading WalkieTalkie App to GitHub...
echo.

echo Initializing Git repository...
git init

echo.
echo Adding all files to Git...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: WalkieTalkie app with authentication, friend system, and real-time communication"

echo.
echo Adding remote repository...
git remote add origin https://github.com/aldennoronhaschool-glitch/walkieTalike.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo Upload completed successfully!
echo Your code is now available at: https://github.com/aldennoronhaschool-glitch/walkieTalike
echo.
pause
