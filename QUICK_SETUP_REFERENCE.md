# ScoreBook - Quick Reference: Signups & Git Flow

## 📋 Service Signup Checklist

### Phase 1: Sports APIs (Do Now)

**1. RapidAPI (for API-Sports) - 15 minutes**
- [ ] Go to https://rapidapi.com/
- [ ] Sign up with GitHub (fastest)
- [ ] Subscribe to Cricket API (free): https://rapidapi.com/api-sports/api/cricket-live-scores
- [ ] Subscribe to Football API (free): https://rapidapi.com/api-sports/api/api-football
- [ ] Subscribe to Hockey API (free): https://rapidapi.com/api-sports/api/api-hockey
- [ ] Subscribe to American Football API (free): https://rapidapi.com/api-sports/api/api-american-football
- [ ] Subscribe to Tennis API (free): https://rapidapi.com/api-sports/api/api-tennis
- [ ] Copy your RapidAPI key (under Code Snippets → `X-RapidAPI-Key`)
- [ ] Save key in password manager or secure notes

**2. TheSportsDB (Backup) - 2 minutes**
- [ ] Go to https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=Arsenal
- [ ] If you see JSON data, you're good!
- [ ] No signup needed, use API key: `1`

**3. Entity Sports (Optional - Can Do Later) - 10 minutes**
- [ ] Go to https://entitysport.com/
- [ ] Sign up for free account
- [ ] Get Cricket API key
- [ ] Get Tennis API key
- [ ] Save keys securely

### Phase 2: Backend Hosting (Do Now)

**1. Render - 5 minutes**
- [ ] Go to https://render.com/
- [ ] Sign up with GitHub (recommended)
- [ ] Authorize Render to access jarvisRam/ScoreBook repository
- [ ] Don't deploy yet (no code ready)
- [ ] Just verify account is active

**Total Time: ~30 minutes**

---

## 🔑 Save Your API Keys

Create this file locally (DO NOT commit to Git):

```bash
# ScoreBook/backend/.env
RAPIDAPI_KEY=paste_your_key_here
ENTITY_CRICKET_KEY=paste_key_if_you_signed_up
ENTITY_TENNIS_KEY=paste_key_if_you_signed_up
THESPORTSDB_KEY=1
USE_MOCK_DATA=true
```

---

## 🌿 Git Flow - Quick Commands

### ✅ Already Done:
- [x] `develop` branch created
- [x] `develop` pushed to GitHub

### Current Branch Status:
```
* develop (current)
  main
  remotes/origin/develop
  remotes/origin/main
```

---

## 🚀 Common Git Flow Commands

### Starting New Work

```bash
# 1. Always start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/backend-setup

# Work on your feature...

# 3. Commit your work
git add .
git commit -m "feat: setup Express server"

# 4. Push feature branch
git push origin feature/backend-setup
```

### Creating Pull Request (on GitHub)

1. Go to https://github.com/jarvisRam/ScoreBook
2. Click "Pull requests"
3. Click "New pull request"
4. Base: `develop` ← Compare: `feature/your-feature`
5. Click "Create pull request"
6. Review changes, click "Merge pull request"

### After Merging PR

```bash
# Switch back to develop
git checkout develop

# Pull latest changes
git pull origin develop

# Delete local feature branch
git branch -d feature/backend-setup

# Delete remote feature branch
git push origin --delete feature/backend-setup
```

---

## 🎯 Next Steps After Signups

Once you have all API keys:

1. ✅ Mac arrives
2. ✅ Clone repository on Mac
3. ✅ Create `backend/.env` with your keys
4. ✅ Start implementing backend (on develop branch)
5. ✅ Create feature branches for each component
6. ✅ Merge features to develop
7. ✅ When ready, merge develop to main for production

---

## 📞 URLs to Bookmark

**APIs:**
- RapidAPI Dashboard: https://rapidapi.com/developer/dashboard
- API-Sports Docs: https://www.api-football.com/documentation-v3
- TheSportsDB API: https://www.thesportsdb.com/api.php
- Entity Sports: https://entitysport.com/

**Hosting:**
- Render Dashboard: https://dashboard.render.com/

**Git:**
- GitHub Repo: https://github.com/jarvisRam/ScoreBook
- Main Branch: https://github.com/jarvisRam/ScoreBook/tree/main
- Develop Branch: https://github.com/jarvisRam/ScoreBook/tree/develop

---

**You're all set to sign up! 🎉**

Total signup time: ~30 minutes
Then you'll be ready to code when the Mac arrives!
