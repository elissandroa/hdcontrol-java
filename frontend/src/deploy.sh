#!/bin/bash

# Script para deploy no GitHub Pages

echo "🚀 Iniciando deploy para GitHub Pages..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Fazer build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Verificar se a pasta dist foi criada
if [ ! -d "dist" ]; then
    echo "❌ Erro: Pasta dist não foi criada!"
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# Fazer deploy
echo "🚀 Fazendo deploy..."
npx gh-pages -d dist

echo "🎉 Deploy concluído!"