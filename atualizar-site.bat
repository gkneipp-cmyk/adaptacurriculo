@echo off
setlocal
set "PATH=%LOCALAPPDATA%\MinGit\cmd;%LOCALAPPDATA%\gh;%PATH%"
cd /d "%~dp0"
git add .
git commit -m "Atualizacao automatica do site"
git push origin main
echo.
echo ========================================================
echo  Site atualizado no GitHub com sucesso!
echo  Em cerca de 30 segundos o site online sera atualizado.
echo ========================================================
echo.
pause
