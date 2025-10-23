Write-Host "Uploading WalkieTalkie App to GitHub..." -ForegroundColor Green
Write-Host ""

Write-Host "Initializing Git repository..." -ForegroundColor Yellow
git init

Write-Host ""
Write-Host "Adding all files to Git..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: WalkieTalkie app with authentication, friend system, and real-time communication"

Write-Host ""
Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/aldennoronhaschool-glitch/walkieTalike.git

Write-Host ""
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "Upload completed successfully!" -ForegroundColor Green
Write-Host "Your code is now available at: https://github.com/aldennoronhaschool-glitch/walkieTalike" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"
