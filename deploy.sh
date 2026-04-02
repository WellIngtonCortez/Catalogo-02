#!/bin/bash

# Deploy Script para WellShop
# Uso: ./deploy.sh [staging|production]

ENVIRONMENT=${1:-production}

echo "🚀 Deployando WellShop para $ENVIRONMENT..."

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Build do projeto
echo "🔨 Buildando o projeto..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
    
    # Deploy para Vercel
    if [ "$ENVIRONMENT" = "staging" ]; then
        echo "🌐 Deploy para ambiente de staging..."
        vercel
    else
        echo "🌐 Deploy para ambiente de produção..."
        vercel --prod
    fi
    
    echo "🎉 Deploy concluído!"
    echo "📱 Acesse a aplicação em: https://catalago-wellshop.vercel.app"
else
    echo "❌ Erro no build. Verifique os logs acima."
    exit 1
fi
