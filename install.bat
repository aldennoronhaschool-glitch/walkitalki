@echo off
echo Installing WalkieTalkie App Dependencies...
echo.

echo Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error installing root dependencies
    pause
    exit /b 1
)

echo.
echo Installing server dependencies...
cd server
npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
cd ../client
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)

echo.
echo Installation completed successfully!
echo.
echo Next steps:
echo 1. Copy server/env.example to server/.env
echo 2. Update the .env file with your MongoDB URI and Google OAuth credentials
echo 3. Run: npm run dev
echo.
pause
