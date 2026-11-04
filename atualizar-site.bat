@echo off
setlocal
set "PATH=%LOCALAPPDATA%\MinGit\cmd;%LOCALAPPDATA%\gh;%SystemRoot%\System32;%PATH%"
cd /d "%~dp0"

echo.
echo [1/3] Registrando alteracoes no codigo...
git add .
git diff-index --quiet HEAD || git commit -m "Atualizacao automatica do site"

echo [2/3] Enviando para o GitHub...
git push origin main

echo [3/3] Notificando o servidor Render para publicar no ar...
curl.exe -s -X POST "https://api.render.com/deploy/srv-dblo8nhsrm7s73f84n00?key=p2Oc0O-eDOw" >nul

echo.
echo ========================================================
echo  TUDO PRONTO! O site foi publicado no ar com sucesso!
echo  Em cerca de 30 segundos a versao atualizada estara ativa.
echo ========================================================
echo.
pause
