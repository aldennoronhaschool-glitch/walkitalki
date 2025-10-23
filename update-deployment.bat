@echo off
echo Updating deployment configuration...
echo.

cd /d "C:\Users\admin\Desktop\AUdio calling"

echo Adding deployment files...
"C:\Program Files\Git\bin\git.exe" add .

echo Committing deployment fixes...
"C:\Program Files\Git\bin\git.exe" commit -m "Fix Vercel deployment configuration and add deployment guide"

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo Deployment configuration updated!
echo Your app is now ready for Vercel deployment.
echo.
pause
