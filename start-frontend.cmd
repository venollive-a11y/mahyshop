@echo off
title Taha Shop — Frontend (port 3000)

REM ── This .cmd file bypasses Windows PowerShell script-execution-policy ────────
REM    Run by double-clicking.  Keep start-backend.cmd open in a separate window.

cd /d "%~dp0apps\web"

echo.
echo  ========================================================
echo   Taha Shop FRONTEND — Starting on http://0.0.0.0:3000
echo  ========================================================
echo.
echo  Access from this PC : http://localhost:3000
echo  Access from mobile  : http://192.168.100.92:3000
echo.
echo  Press Ctrl+C to stop the server.
echo.

node node_modules\.bin\next dev --port 3000 --hostname 0.0.0.0

echo.
echo  Frontend exited.
pause
