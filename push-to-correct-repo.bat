@echo off
echo Pushing WalkieTalkie App to the correct GitHub repository...
echo.

cd /d "C:\Users\admin\Desktop\AUdio calling"

echo Updating remote URL to walkitalki repository...
"C:\Program Files\Git\bin\git.exe" remote set-url origin https://github.com/aldennoronhaschool-glitch/walkitalki.git

echo Verifying remote URL...
"C:\Program Files\Git\bin\git.exe" remote -v

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
echo Successfully pushed to the correct repository!
echo Repository: https://github.com/aldennoronhaschool-glitch/walkitalki
echo.
pause
