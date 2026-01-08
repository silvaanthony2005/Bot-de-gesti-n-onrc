@echo off
title Bot CNE Launcher

echo ===================================================
echo    Iniciando Entorno de Desarrollo Bot CNE 🤖
echo ===================================================
echo.

:: Iniciar Backend
echo [1/2] Iniciando Backend (FastAPI)...
start "Bot CNE Backend" cmd /k "cd backend && (if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) else (if exist .venv\Scripts\activate.ps1 (powershell -ExecutionPolicy Bypass -File .venv\Scripts\activate.ps1) else (echo No se encontro entorno virtual, usando python global...))) && uvicorn app.main:app --reload"

:: Iniciar Frontend
echo [2/2] Iniciando Frontend (React)...
start "Bot CNE Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo    Todo listo! 🚀
echo    Backend: http://localhost:8000/docs
echo    Frontend: http://localhost:5173
echo ===================================================
echo.
pause
