@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo Starting Trader Simulator dev server...
echo.
echo URL: http://127.0.0.1:5174/
echo.
npm.cmd run dev -- --port 5174
pause
