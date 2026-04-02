# 🚀 Deploy Instructions - WellShop

## 📋 Pré-requisitos

1. **Conta GitHub** - Para hospedar o repositório
2. **Conta Vercel** - Para deploy automático
3. **Vercel CLI** - Para deploy manual (opcional)

## 🔧 Deploy Automático (GitHub Actions)

### 1. Conectar GitHub à Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Importe seu repositório GitHub
4. Configure as variáveis de ambiente:
   ```
   VITE_SUPABASE_URL=seu_supabase_url
   VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
   ```

### 2. Configurar GitHub Actions

No seu repositório GitHub, configure os secrets:

1. Vá para **Settings** > **Secrets and variables** > **Actions**
2. Adicione os seguintes secrets:
   - `VERCEL_TOKEN` - Token de API da Vercel
   - `VERCEL_ORG_ID` - ID da organização Vercel
   - `VERCEL_PROJECT_ID` - ID do projeto Vercel

### 3. Obter Credenciais Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login na Vercel
vercel login

# Obter IDs
vercel link
```

Os IDs serão salvos em `.vercel/project.json`.

## 🛠️ Deploy Manual

### Via NPM Scripts

```bash
# Deploy para staging
npm run deploy:staging

# Deploy para produção
npm run deploy:prod

# Build + deploy (recomendado)
npm run deploy
```

### Via Vercel CLI

```bash
# Build
npm run build

# Deploy para produção
vercel --prod

# Deploy para staging
vercel
```

### Via Scripts (Windows/Mac)

```bash
# Windows
deploy.bat production

# Linux/Mac
./deploy.sh production
```

## 📁 Estrutura de Deploy

```
📦 Build Output
├── dist/
│   ├── index.html          # HTML principal
│   ├── assets/            # JS/CSS otimizados
│   ├── favicon.svg        # SVG favicon
│   ├── favicon.png        # PNG favicon
│   ├── favicon.ico        # ICO favicon
│   ├── apple-touch-icon.png # iOS icon
│   └── manifest.json      # PWA manifest
```

## 🔍 Verificação de Deploy

### 1. Build Local

```bash
npm run build
npm run preview
```

Acesse `http://localhost:4173` para testar.

### 2. Testar Favicon

- Abra em aba anônima
- Verifique o favicon na aba do navegador
- Teste em diferentes browsers

### 3. Testar Funcionalidades

- ✅ Catálogo carregando
- ✅ Filtros funcionando
- ✅ Login admin
- ✅ Upload de imagens
- ✅ Analytics tracking

## 🌐 URLs de Deploy

Após o deploy, sua aplicação estará disponível em:

- **Produção**: `https://catalago-wellshop.vercel.app`
- **Staging**: `https://catalago-wellshop-[hash].vercel.app`

## 🔄 CI/CD Pipeline

O GitHub Actions irá:

1. **Trigger**: Em cada push para `principal`/`main`
2. **Build**: `npm run build`
3. **Test**: Validação do build
4. **Deploy**: Automático para Vercel
5. **Notify**: Status do deploy

## 🚨 Troubleshooting

### Build Falha

```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Verificar TypeScript
npm run build
```

### Deploy Falha

```bash
# Verificar Vercel CLI
vercel --version

# Re-autenticar
vercel logout
vercel login

# Verificar variáveis
vercel env ls
```

### Favicon Não Aparece

1. Limpe cache do navegador (Ctrl+F5)
2. Teste em aba anônima
3. Verifique caminhos em `/dist/index.html`
4. Confirme arquivos em `/dist/`

### Environment Variables

```bash
# Verificar se estão configuradas
vercel env ls

# Adicionar variável
vercel env add VITE_SUPABASE_URL
```

## 📱 PWA Features

O projeto inclui:

- ✅ **Manifest.json** - Instalação PWA
- ✅ **Service Worker** - Cache offline
- ✅ **Apple Touch Icon** - iOS integration
- ✅ **Theme Color** - Browser UI

## 🎯 Next Steps

1. **Configurar Analytics** - Google Analytics
2. **Adicionar Tests** - Jest + Testing Library
3. **Performance** - Lighthouse audit
4. **SEO** - Sitemap e robots.txt
5. **Monitoramento** - Error tracking

---

## 📞 Suporte

Caso tenha problemas:

1. Verifique os logs de build
2. Confirme variáveis de ambiente
3. Teste localmente primeiro
4. Use aba anônima para testes

**Deploy pronto! 🎉**
