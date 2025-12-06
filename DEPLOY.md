# 🚀 Quick Deploy - GitHub Pages

## ✅ Setup Complete!

Everything is configured. Just follow these steps:

---

## 📝 Before You Deploy

### 1. Update Repository Name (REQUIRED!)

**In `vite.config.ts` line 7:**
```typescript
base: '/YOUR-REPO-NAME/',  // Change to your actual repo name!
```

**In `package.json` line 5:**
```json
"homepage": "https://YOUR-USERNAME.github.io/YOUR-REPO-NAME"
```

**Example:**
- Username: `john-doe`
- Repo: `linkup-social`
- Then: `base: '/linkup-social/'`
- And: `"homepage": "https://john-doe.github.io/linkup-social"`

---

## 🔑 Add GitHub Secrets (CRITICAL!)

Your Supabase keys must be added to GitHub:

### Steps:
1. Go to your GitHub repo
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add TWO secrets:

**Secret 1:**
```
Name: VITE_SUPABASE_URL
Value: (copy from your .env file)
```

**Secret 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: (copy from your .env file)
```

---

## 🚀 Deploy Now!

### Option A: Automatic (Recommended) ⭐

```bash
# Push your code
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

✅ GitHub Action will automatically build and deploy!  
⏱️ Wait ~2 minutes  
🌐 Visit: `https://yourusername.github.io/your-repo-name`

### Option B: Manual

```powershell
# Windows PowerShell - Replace with YOUR values!
$env:VITE_SUPABASE_URL="https://your-project.supabase.co"
$env:VITE_SUPABASE_ANON_KEY="your-anon-key-here"
npm run build
npm run deploy
```

---

## ✅ Enable GitHub Pages

After first push:

1. Go to repo **Settings** → **Pages**
2. Set **Source** to: `gh-pages` branch
3. Folder: `/ (root)`
4. Click **Save**
5. Wait 2 minutes for deployment

---

## 🔍 Check If It Works

Visit: `https://yourusername.github.io/your-repo-name`

Test:
- [ ] Site loads
- [ ] Can visit /login
- [ ] Can signup/login
- [ ] Supabase works
- [ ] Posts load

---

## 🐛 Not Working?

### Blank page?
→ Check `base: '/repo-name/'` in vite.config.ts matches your repo name

### Supabase not connecting?
→ Check GitHub Secrets are added correctly

### 404 on routes?
→ Already fixed with 404.html! Just wait a moment after deployment.

---

## 📊 Quick Checklist

- [ ] Updated `vite.config.ts` with repo name
- [ ] Updated `package.json` with username and repo name
- [ ] Added GitHub Secrets (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)
- [ ] Pushed code to GitHub
- [ ] Enabled GitHub Pages (gh-pages branch)
- [ ] Waited 2 minutes
- [ ] Tested the live site

---

## 🎯 Your Live URL

After deployment, your app will be at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME
```

**Example:**
```
https://john-doe.github.io/linkup-social
```

---

## 📞 Need Help?

See full guide: `DEPLOYMENT_GUIDE.md`

Common fixes:
1. **Check GitHub Actions tab** for build logs
2. **Verify secrets** are added correctly
3. **Match repo name** in all config files
4. **Wait 2-3 minutes** after first deploy

---

**You're ready to deploy! 🚀**
