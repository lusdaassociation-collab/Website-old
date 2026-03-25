# Cloudflare Pages Deployment Guide

This project is configured to deploy to Cloudflare Pages. Follow these steps to get your site live:

## Prerequisites

- Cloudflare account (free tier works fine)
- GitHub account with this repository
- Wrangler CLI (already in `devDependencies`)

## Step 1: Create Cloudflare API Token

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Account Settings** → **API Tokens**
3. Create a new token with these permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Account** → **Account Settings** → **Read**
4. Copy the API token

## Step 2: Get Your Account ID

1. In Cloudflare Dashboard, go to **Account Settings**
2. Copy your **Account ID** (a 32-character hex string)

## Step 3: Set GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add two new secrets:
   - `CLOUDFLARE_API_TOKEN`: Paste your API token from Step 1
   - `CLOUDFLARE_ACCOUNT_ID`: Paste your Account ID from Step 2

## Step 4: Deploy

**Option A: Automatic Deployment (Recommended)**
- Push code to `main` or `master` branch
- GitHub Actions workflow will automatically build and deploy to Cloudflare Pages
- Check **Actions** tab to monitor deployment progress

**Option B: Manual Deployment with Wrangler**

```bash
# Install dependencies
pnpm install

# Build the site
pnpm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist/
```

## Step 5: Connect Custom Domain (Optional)

1. In Cloudflare Dashboard, go to **Pages** → Your project
2. Go to **Custom domains**
3. Add your domain and follow DNS configuration steps

## Configuration Files

- **`wrangler.toml`**: Main Cloudflare configuration (root level)
- **`.github/workflows/deploy.yml`**: GitHub Actions CI/CD workflow
- **`public/wrangler.toml`**: Optional additional configuration (can be safely ignored for Pages)

## Environment Variables

If you need to use environment variables, add them to:
1. Cloudflare Dashboard → Pages → Project → Settings → Environment variables
2. Or update `[vars]` section in `wrangler.toml` for non-sensitive values

## Troubleshooting

**Build failing?**
- Ensure `pnpm install` runs successfully locally first
- Check Node.js version compatibility (18+ recommended)

**Deploy failing?**
- Verify API token has correct permissions
- Confirm Account ID is correct
- Check GitHub Actions logs for detailed errors

**Site not updating?**
- Clear browser cache (Ctrl+Shift+Del)
- Check deployment status in Cloudflare Dashboard → Pages

## Local Testing

To test locally before deploying:

```bash
pnpm install
pnpm run build
pnpm run preview
```

Visit `http://localhost:4321` to see your site.

---

For more information, see:
- [Astro Deployment Docs](https://docs.astro.build/en/guides/deploy/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
