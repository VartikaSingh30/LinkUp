# GitHub Pages Deployment Guide

## 🚀 Deploy LinkUp to GitHub Pages

### Prerequisites
- ✅ GitHub account
- ✅ Git installed
- ✅ Project pushed to GitHub repository

---

## 📋 Setup Steps

### Step 1: Install GitHub Pages Package
```bash
npm install --save-dev gh-pages
```

### Step 2: Configure GitHub Repository Settings

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
5. Click **Save**

### Step 3: Add GitHub Secrets (REQUIRED!)

Your Supabase keys need to be added as secrets:

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these two secrets:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: (paste your Supabase project URL from .env file)

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: (paste your Supabase anon key from .env file)

### Step 4: Update Repository Name in Config Files

**IMPORTANT:** Replace `Link-main` with your actual GitHub repository name!

**In `vite.config.ts`:**
```typescript
base: '/your-repo-name/',  // e.g., '/linkup/' or '/Link-main/'
```

**In `package.json`:**
```json
"homepage": "https://yourusername.github.io/your-repo-name"
```

Replace:
- `yourusername` → Your GitHub username
- `your-repo-name` → Your repository name

---

## 🚀 Deployment Methods

### Method 1: Automatic Deployment (GitHub Actions) ⭐ RECOMMENDED

**This is already set up!** Just push your code:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

The GitHub Action will:
1. ✅ Build your project with Supabase keys
2. ✅ Deploy to GitHub Pages automatically
3. ✅ Your site will be live in ~2 minutes!

Check progress: **Actions** tab in your GitHub repo

### Method 2: Manual Deployment

If you prefer manual control:

```bash
# Build with environment variables (Windows PowerShell)
$env:VITE_SUPABASE_URL="your_url"; $env:VITE_SUPABASE_ANON_KEY="your_key"; npm run build

# Deploy
npm run deploy
```

For Linux/Mac:
```bash
VITE_SUPABASE_URL="your_url" VITE_SUPABASE_ANON_KEY="your_key" npm run build
npm run deploy
```

---

## 🔍 Verify Deployment

### Check Your Live Site
After deployment, your app will be available at:
```
https://yourusername.github.io/your-repo-name
```

### Test Checklist:
- [ ] Site loads without errors
- [ ] Can navigate to /login
- [ ] Can create an account
- [ ] Can log in
- [ ] Supabase connection works
- [ ] Posts load
- [ ] Real-time messaging works

---

## 🐛 Troubleshooting

### Issue 1: Blank Page or 404 Error
**Cause:** Wrong base path in `vite.config.ts`

**Fix:**
```typescript
// vite.config.ts
base: '/exact-repo-name/',  // Must match your GitHub repo name!
```

### Issue 2: "Supabase client not initialized"
**Cause:** Environment variables not set

**Fix:**
- Check GitHub Secrets are added correctly
- Re-run the GitHub Action
- Or use Method 2 with env vars in terminal

### Issue 3: Routes Don't Work (404 on refresh)
**Cause:** GitHub Pages doesn't support client-side routing by default

**Fix:** Already handled! The `404.html` redirect is included in the build.

### Issue 4: GitHub Action Fails
**Check:**
- Are secrets added? (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Is branch name correct? (main vs master)
- Check Action logs in GitHub Actions tab

---

## 🔐 Security Notes

### ✅ SAFE to commit:
- `vite.config.ts` (with base path)
- `package.json` (with homepage)
- `.github/workflows/deploy.yml`
- Built files in `dist/` (they're public anyway)

### ❌ NEVER commit:
- `.env` file (already in .gitignore)
- Supabase service role key (only use anon key)

### 📝 About Supabase Anon Key:
- ✅ **Safe to expose** in frontend code
- ✅ Protected by Row Level Security (RLS)
- ✅ Can only access data according to RLS policies
- ❌ **Never expose** the service role key

---

## 🔄 Update Your Deployed Site

### Using GitHub Actions (Automatic):
```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main

# GitHub Action automatically redeploys!
```

### Using Manual Method:
```bash
npm run deploy
```

---

## 📊 Deployment Comparison

| Method | Pros | Cons |
|--------|------|------|
| **GitHub Actions** | ✅ Automatic<br>✅ Secure secrets<br>✅ CI/CD pipeline | ❌ Requires setup |
| **Manual** | ✅ Full control<br>✅ Quick for testing | ❌ Must set env vars each time |

---

## 🎯 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Add GitHub secrets (in GitHub web UI)
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

# 3. Push to GitHub
git add .
git commit -m "Initial deployment"
git push origin main

# 4. Wait 2 minutes
# 5. Visit: https://yourusername.github.io/your-repo-name
```

---

## ⚡ Performance Tips

### After Deployment:
1. Enable **GitHub Pages** custom domain (optional)
2. Use **Cloudflare CDN** for faster loading (free)
3. Monitor with **Google Analytics** (optional)

### Supabase Optimization:
- ✅ Free tier is usually fast enough
- ✅ Upgrade if you exceed limits
- ✅ Monitor usage in Supabase Dashboard

---

## 📞 Need Help?

### Common Issues:
1. **Site not loading?** Check base path in vite.config.ts
2. **Login not working?** Verify GitHub Secrets
3. **404 errors?** Check GitHub Pages settings
4. **Action failing?** Check Actions tab for logs

### Resources:
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Supabase Docs](https://supabase.com/docs)

---

**Your LinkUp app is ready to deploy! 🚀**

*Generated: December 6, 2025*
