@echo off
echo Pushing WalkieTalkie App to GitHub...
echo.

cd /d "C:\Users\admin\Desktop\AUdio calling"

echo Initializing Git repository...
"C:\Program Files\Git\bin\git.exe" init

echo Adding all files...
"C:\Program Files\Git\bin\git.exe" add .

echo Creating commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: WalkieTalkie app with authentication, friend system, and real-time communication"

echo Adding remote...
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/aldennoronhaschool-glitch/walkieTalike.git

echo Setting main branch...
"C:\Program Files\Git\bin\git.exe" branch -M main

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
echo Successfully pushed to GitHub!
echo Repository: https://github.com/aldennoronhaschool-glitch/walkieTalike
echo.
pause
