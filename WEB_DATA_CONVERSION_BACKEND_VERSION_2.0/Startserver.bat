@echo off
echo 📦 Installing dependencies...
npm install

echo 🚀 Starting server with PM2...
pm2 start server.js

pause
