@echo off
REM Deploy Script para WellShop (Windows)
REM Uso: deploy.bat [staging|production]

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=production

echo 🚀 Deployando WellShop para %ENVIRONMENT%...

REM Verificar se o Vercel CLI está instalado
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Instalando Vercel CLI...
    npm install -g vercel
)

REM Build do projeto
echo 🔨 Buildando o projeto...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build concluído com sucesso!
    
    REM Deploy para Vercel
    if "%ENVIRONMENT%"=="staging" (
        echo 🌐 Deploy para ambiente de staging...
        vercel
    ) else (
        echo 🌐 Deploy para ambiente de produção...
        vercel --prod
    )
    
    echo 🎉 Deploy concluído!
    echo 📱 Acesse a aplicação em: https://catalago-wellshop.vercel.app
) else (
    echo ❌ Erro no build. Verifique os logs acima.
    exit /b 1
)
