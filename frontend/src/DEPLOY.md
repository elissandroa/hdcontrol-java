# 🚀 Guia de Deploy - GitHub Pages

## Pré-requisitos
- Node.js 18+ instalado
- Git configurado
- Repositório no GitHub
- Conta no GitHub

## Passos para Deploy

### 1. Preparar o Projeto
```bash
# Instalar dependências
npm install

# Testar build local
npm run build

# Verificar se a pasta dist foi criada
ls -la dist/
```

### 2. Configurar GitHub Pages
1. Vá para o repositório no GitHub
2. Clique em **Settings** → **Pages**
3. Em "Source", selecione **"Deploy from a branch"**
4. Escolha a branch **"gh-pages"**
5. Mantenha o diretório como **"/ (root)"**

### 3. Fazer Deploy
```bash
# Método 1: Usar script npm
npm run deploy

# Método 2: Usar script bash
chmod +x deploy.sh
./deploy.sh

# Método 3: Manual
npm run build
npx gh-pages -d dist
```

### 4. Configurar URL Base (se necessário)
Se o site não carregar corretamente, ajuste o `base` no `vite.config.ts`:

```typescript
// Para repositório com nome específico
base: '/nome-do-repositorio/'

// Para domínio personalizado ou base relativa
base: './'
```

## Troubleshooting

### ❌ Erro: "dist directory not found"
```bash
# Solução: Executar build antes do deploy
npm run build
npm run deploy
```

### ❌ Erro: "Permission denied"
```bash
# Solução: Dar permissão ao script
chmod +x deploy.sh
```

### ❌ Erro: "gh-pages not found"
```bash
# Solução: Instalar gh-pages globalmente
npm install -g gh-pages

# Ou usar npx
npx gh-pages -d dist
```

### ❌ Site não carrega recursos (CSS/JS)
- Verifique a configuração `base` no `vite.config.ts`
- Para GitHub Pages: use `base: '/nome-do-repositorio/'`
- Para domínio personalizado: use `base: './'`

### ❌ Rotas não funcionam
- GitHub Pages não suporta SPA routing nativamente
- O sistema usa hash routing como fallback
- URLs funcionam tanto como `/recover-password/token` quanto `/#/recover-password/token`

## URLs de Acesso

Após o deploy bem-sucedido:
- **GitHub Pages**: `https://seu-usuario.github.io/nome-do-repositorio`
- **Domínio personalizado**: Configure em Settings → Pages → Custom domain

## Automação (Opcional)

### GitHub Actions
Crie `.github/workflows/deploy.yml` para deploy automático:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Notas Importantes

1. **Primeira vez**: O deploy pode demorar alguns minutos para aparecer
2. **Cache**: Mudanças podem demorar para aparecer devido ao cache do GitHub
3. **API**: Lembre-se de configurar CORS no backend para permitir o domínio do GitHub Pages
4. **HTTPS**: GitHub Pages sempre usa HTTPS em produção

## Comandos Úteis

```bash
# Verificar status do deploy
git branch -r

# Limpar cache local
rm -rf node_modules dist
npm install
npm run build

# Forçar novo deploy
npm run deploy -- --force
```