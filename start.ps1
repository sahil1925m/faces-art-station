$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$env:Path = "$scriptDir\node-v20.12.0-win-x64;" + $env:Path

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host " Starting F.A.C.E.S. Forensic AI System" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

Write-Host "Starting FastAPI Backend on port 8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir'; .\.venv\Scripts\python.exe backend/main.py"

Write-Host "Starting Vite Frontend on port 8080..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir'; `$env:Path = '$scriptDir\node-v20.12.0-win-x64;' + `$env:Path; npm run dev"

Write-Host "`nBoth servers have been launched:" -ForegroundColor Yellow
Write-Host " - Frontend: http://localhost:8080" -ForegroundColor White
Write-Host " - Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "==============================================" -ForegroundColor Cyan
