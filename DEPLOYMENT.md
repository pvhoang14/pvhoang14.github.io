# Deployment Guide: GitHub Pages

This guide will walk you through deploying your personal website to GitHub Pages and setting up a custom domain.

## Prerequisites

- A GitHub account
- Your website files ready to deploy
- (Optional) A custom domain name if you want to use your own domain

---

## Part 0: Changing Your GitHub Username (Optional)

If you want to use a different username for your GitHub Pages site (e.g., `hoangpham14.github.io` instead of `HoangHoang14.github.io`), you can change your GitHub username:

### How to Change Your GitHub Username

1. **Check if your desired username is available**:
   - Visit: `https://github.com/YOUR_DESIRED_USERNAME` (replace with your desired username)
   - If you see a 404 page, the username is available
   - Or try signing up with that username at [GitHub Signup](https://github.com/signup) to check availability

2. **Change your username**:
   - Go to GitHub.com → Click your profile picture (top right) → **Settings**
   - Scroll down to **"Change username"** section
   - Enter your new desired username
   - Follow the prompts to confirm
   - ⚠️ **Note**: Changing your username will:
     - Update your profile URL
     - Update all repository URLs (GitHub will redirect old URLs)
     - You'll need to update remote URLs in your local git repositories

3. **After changing**, proceed with Part 1 below using your new username

**Alternative**: If you prefer to keep your current username, you can use a **custom domain** (see Part 2) to have `hoangpham14.com` instead of `HoangHoang14.github.io`.

---

## Part 1: Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner and select **"New repository"**
3. Fill in the repository details:
   - **Repository name**: `your-username.github.io` (replace `your-username` with your **exact** GitHub username)
     - Example: If your username is `hoangpham14`, name it `hoangpham14.github.io`
     - Example: If your username is `HoangHoang1408`, name it `HoangHoang1408.github.io`
     - ⚠️ **Important**: 
       - The repository name must match your GitHub username **exactly** (case-sensitive)
       - You can find your username in the top-right corner of GitHub or in your profile URL
       - The format must be: `YOUR_USERNAME.github.io` (no spaces, no special characters except hyphens)
   - **Description**: (Optional) "Personal website"
   - **Visibility**: Choose **Public** (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (you already have files)
4. Click **"Create repository"**

### Step 2: Push Your Website Files to GitHub

Open your terminal and navigate to your website directory:

```bash
cd /Users/hoangpham/Desktop/personal-website
```

Initialize git (if not already done) and push to GitHub:

```bash
# Initialize git repository (if not already initialized)
git init

# Add all files
git add .

# Commit your files
git commit -m "Initial commit: Personal website"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username in the remote URL.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **"Settings"** (top menu bar)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **"Save"**

### Step 4: Access Your Website

- Your website will be available at: `https://YOUR_USERNAME.github.io`
- Example: `https://HoangHoang1408.github.io`
- ⚠️ **Note**: It may take a few minutes (up to 10 minutes) for the site to be live after enabling Pages

---

## Part 2: Setting Up a Custom Domain

Yes, you can use a custom domain name! Here's how:

### Step 1: Purchase a Domain (if you don't have one)

Popular domain registrars:
- [Namecheap](https://www.namecheap.com/)
- [Google Domains](https://domains.google/)
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)
- [GoDaddy](https://www.godaddy.com/)

### Step 2: Configure DNS Records

You need to add DNS records at your domain registrar to point to GitHub Pages.

#### Option A: Using Apex Domain (e.g., `yourname.com`)

Add these **A records** in your domain's DNS settings:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |

**Note**: These IP addresses are GitHub Pages' servers. They may change, so check [GitHub's documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) for the latest IPs.

#### Option B: Using Subdomain (e.g., `www.yourname.com`)

Add a **CNAME record**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | YOUR_USERNAME.github.io | 3600 |

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Configure Custom Domain in GitHub

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **"Custom domain"**, enter your domain:
   - For apex domain: `yourname.com`
   - For subdomain: `www.yourname.com`
4. Check **"Enforce HTTPS"** (recommended)
5. Click **"Save"**

### Step 4: Create CNAME File (for subdomain only)

If using a subdomain (www), GitHub will automatically create a `CNAME` file. If it doesn't, create it manually:

1. In your repository, click **"Add file"** → **"Create new file"**
2. Name the file: `CNAME` (all caps, no extension)
3. Add your domain name as the content:
   ```
   www.yourname.com
   ```
   Or for apex domain:
   ```
   yourname.com
   ```
4. Commit the file

### Step 5: Wait for DNS Propagation

- DNS changes can take anywhere from a few minutes to 48 hours to propagate
- You can check DNS propagation using tools like:
  - [whatsmydns.net](https://www.whatsmydns.net/)
  - [dnschecker.org](https://dnschecker.org/)

### Step 6: Verify SSL Certificate

- GitHub automatically provisions SSL certificates via Let's Encrypt
- Once DNS propagates, HTTPS will be enabled automatically
- This usually takes a few minutes to a few hours

---

## Part 3: Updating Your Website

After making changes to your website:

```bash
# Navigate to your website directory
cd /Users/hoangpham/Desktop/personal-website

# Add changed files
git add .

# Commit changes
git commit -m "Update website content"

# Push to GitHub
git push origin main
```

Your changes will be live on GitHub Pages within a few minutes.

---

## Troubleshooting

### Website Not Loading

1. **Check repository name**: Must be `YOUR_USERNAME.github.io`
2. **Check Pages settings**: Ensure Pages is enabled and source is set to `main` branch
3. **Wait**: GitHub Pages can take up to 10 minutes to build
4. **Check for errors**: Go to Settings → Pages and check for any error messages

### Custom Domain Not Working

1. **Verify DNS records**: Use DNS checker tools to verify your DNS records are correct
2. **Wait for propagation**: DNS changes can take up to 48 hours
3. **Check CNAME file**: Ensure the `CNAME` file exists and contains your domain
4. **Clear browser cache**: Try accessing your site in an incognito/private window
5. **Check GitHub Pages settings**: Ensure your custom domain is correctly entered in Settings → Pages

### HTTPS Not Working

- GitHub automatically provisions SSL certificates, but this can take time
- Ensure "Enforce HTTPS" is checked in Pages settings
- Wait 24-48 hours after setting up the custom domain

### Images or Assets Not Loading

- Ensure all file paths are relative (e.g., `assets/avatar.jpg` not `/assets/avatar.jpg`)
- Check that all files are committed and pushed to GitHub
- Verify file names match exactly (case-sensitive)

---

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup Guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages IP Addresses](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain)

---

## Quick Reference

### Default GitHub Pages URL
```
https://YOUR_USERNAME.github.io
```

### Custom Domain Setup Checklist
- [ ] Domain purchased
- [ ] DNS records configured (A records or CNAME)
- [ ] Custom domain added in GitHub Pages settings
- [ ] CNAME file created (if needed)
- [ ] DNS propagated (checked via DNS checker)
- [ ] HTTPS enabled (automatic, may take time)

---

**Need Help?** If you encounter issues, check GitHub's documentation or open an issue in your repository.
