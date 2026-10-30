@echo off
setlocal
cd /d "%~dp0"
set "PATH=%~dp0node-v20.12.0-win-x64;%PATH%"

echo ==============================================
echo  Starting F.A.C.E.S. Forensic AI System
echo ==============================================

echo Starting FastAPI Backend on port 8000...
start "F.A.C.E.S. Backend" cmd /k ".\.venv\Scripts\python.exe backend\main.py"

echo Starting Vite Frontend on port 8080...
start "F.A.C.E.S. Frontend" cmd /k "npm run dev"

echo.
echo Both servers are launching:
echo  - Backend:  http://localhost:8000
echo  - Frontend: http://localhost:8080
echo ==============================================
pause
