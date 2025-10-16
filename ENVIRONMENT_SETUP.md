# Environment Setup Guide

## Quick Fix for Build Errors

The build error occurs because environment variables are not set. Here's how to fix it:

### Step 1: Create .env.local file

Create a file named `.env.local` in your project root directory (same level as `package.json`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://izjnryuoujzfxjyptnli.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 2: Get Your Supabase Keys

1. Go to: https://supabase.com/dashboard/project/izjnryuoujzfxjyptnli
2. Click **Settings** → **API**
3. Copy the **"anon public"** key
4. Replace `your_anon_key_here` with the actual key

### Step 3: Restart Development Server

```bash
npm run dev
```

### Step 4: Test the Setup

1. Go to: `http://localhost:3000/debug`
2. Click "Check Environment Variables"
3. All should show "Set: true"

## For Production Deployment

### Vercel

Add these environment variables in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Other Platforms

Set the same environment variables in your deployment platform.

## Troubleshooting

- **Build still fails**: Make sure `.env.local` is in the root directory
- **No data loading**: Check if your Supabase keys are correct
- **Authentication issues**: Verify the anon key has proper permissions

## File Structure

```
your-project/
├── .env.local          ← Create this file
├── package.json
├── app/
├── components/
└── lib/
```
