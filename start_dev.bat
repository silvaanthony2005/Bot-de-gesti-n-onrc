@echo off
title Bot CNE Launcher

echo ===================================================
echo    Iniciando Entorno de Desarrollo Bot CNE 🤖
echo ===================================================
echo.

:: Iniciar Backend
echo [1/2] Iniciando Backend (FastAPI)...
start "Bot CNE Backend" cmd /k "cd backend && (if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) else (if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat))) && uvicorn app.main:app --reload"

:: Iniciar Frontend
echo [2/3] Iniciando Frontend (React)...
start "Bot CNE Frontend" cmd /k "cd frontend && npm run dev"

:: Iniciar n8n
echo [3/3] Iniciando n8n (AI Automation)...
start "Bot CNE n8n" cmd /k "n8n start"

echo.
echo ===================================================
echo    Todo listo! 🚀
echo    Backend: http://localhost:8000/docs
echo    Frontend: http://localhost:5173
echo    n8n:      http://localhost:5678
echo ===================================================
echo    Frontend: http://localhost:5173
echo ===================================================
echo.
pause
