# GitHub Repository Setup Instructions

## Creating the ScoreBook Repository on GitHub

Follow these steps to create and push your ScoreBook repository to GitHub.

---

## Option 1: Via GitHub Website (Recommended)

### Step 1: Create Repository

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `ScoreBook`
   - **Description**: `Cross-platform sports score application for test automation - React Native (iOS, Android, Web)`
   - **Visibility**: Choose **Public** or **Private**
   - ⚠️ **DO NOT** check "Initialize this repository with a README" (we already have one)
   - **DO NOT** add .gitignore or license (we have these)
3. Click **Create repository**

### Step 2: Push Local Repository

GitHub will show you commands. Copy and run them in your terminal:

```bash
cd "e:/Sriram Workspace/ScoreBook"

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/ScoreBook.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Option 2: Via GitHub CLI (If Installed)

If you have GitHub CLI installed:

```bash
cd "e:/Sriram Workspace/ScoreBook"

# Create repository and push in one command
gh repo create ScoreBook --public --source=. --remote=origin --push

# Or for private repository
gh repo create ScoreBook --private --source=. --remote=origin --push
```

---

## Verification

After pushing, verify your repository:

1. Go to `https://github.com/YOUR_USERNAME/ScoreBook`
2. Check that all files are visible:
   - ✅ README.md displays on homepage
   - ✅ docs/ folder with all documentation
   - ✅ .github/workflows/ci.yml for CI/CD
   - ✅ package.json, .gitignore present
3. Check that README renders properly with formatting
4. Navigate to docs/ and verify all documentation files render

---

## Setting Up Branch Protection (Optional but Recommended)

To enforce code review and CI passing before merging:

1. Go to repository **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Branch name pattern: `main`
4. Check:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1 approval)
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
5. Click **Create** or **Save changes**

---

## Enable GitHub Actions

If prompted to enable GitHub Actions:

1. Go to **Actions** tab in your repository
2. Click **I understand my workflows, go ahead and enable them**
3. GitHub Actions will automatically run on push/PR

---

## Clone on Mac (Future Step)

When you get your Mac, you'll clone the repository:

```bash
cd ~/Developer  # or your preferred directory
git clone https://github.com/YOUR_USERNAME/ScoreBook.git
cd ScoreBook
```

Then follow the instructions in `docs/mac-setup-guide.md` to set up your environment.

---

## Troubleshooting

### Authentication Error

If you get an authentication error when pushing:

**Option 1: Use Personal Access Token (PAT)**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token
4. When pushing, use token as password:
   ```bash
   Username: YOUR_USERNAME
   Password: ghp_YourPersonalAccessToken
   ```

**Option 2: Use GitHub CLI**

```bash
gh auth login
# Follow prompts to authenticate
```

**Option 3: Use SSH**

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add SSH key to GitHub
cat ~/.ssh/id_ed25519.pub
# Copy output and add to GitHub → Settings → SSH keys

# Change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/ScoreBook.git
git push -u origin main
```

### Remote Already Exists

If you get "remote origin already exists":

```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/ScoreBook.git
git push -u origin main
```

---

## Next Steps After Pushing

1. ✅ Verify repository on GitHub
2. ✅ Clone on Mac when available
3. ✅ Follow `docs/mac-setup-guide.md`
4. ✅ Continue development with AntiGravity

---

**Repository ready to push! 🚀**
