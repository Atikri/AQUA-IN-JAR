@echo off
echo Installing Python dependencies...
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install dependencies. Please ensure Python is installed and added to PATH.
    pause
    exit /b %errorlevel%
)
echo Dependencies installed successfully.
pause
