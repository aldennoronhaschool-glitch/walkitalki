# PowerShell script to push WalkieTalkie app to GitHub
Write-Host "🚀 Pushing WalkieTalkie App to GitHub..." -ForegroundColor Green
Write-Host ""

# Set the Git executable path
$gitPath = "C:\Program Files\Git\bin\git.exe"

# Check if Git exists
if (Test-Path $gitPath) {
    Write-Host "✅ Git found at: $gitPath" -ForegroundColor Green
} else {
    Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Initialize Git repository
Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
& $gitPath init

# Add all files
Write-Host "📦 Adding all files to Git..." -ForegroundColor Yellow
& $gitPath add .

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
& $gitPath commit -m "Initial commit: WalkieTalkie app with authentication, friend system, and real-time communication"

# Add remote repository
Write-Host "🔗 Adding remote repository..." -ForegroundColor Yellow
& $gitPath remote add origin https://github.com/aldennoronhaschool-glitch/walkieTalike.git

# Set main branch
Write-Host "🌿 Setting main branch..." -ForegroundColor Yellow
& $gitPath branch -M main

# Push to GitHub
Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
& $gitPath push -u origin main

Write-Host ""
Write-Host "🎉 Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "🔗 Repository: https://github.com/aldennoronhaschool-glitch/walkieTalike" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"
