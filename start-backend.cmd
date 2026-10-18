@echo off
title Taha Shop — Backend API (port 5000)

REM ── This .cmd file bypasses Windows PowerShell script-execution-policy ────────
REM    Run by double-clicking or: right-click → "Run as administrator" (not needed)

cd /d "%~dp0backend"

echo.
echo  ========================================================
echo   Taha Shop BACKEND — Starting on http://0.0.0.0:5000
echo  ========================================================
echo.
echo  MongoDB URI is read from backend\.env
echo  Press Ctrl+C to stop the server.
echo.

node src/server.js

echo.
echo  Backend exited.
pause
