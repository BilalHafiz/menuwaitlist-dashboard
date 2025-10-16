# 🚀 Quick Setup Guide

## Step 1: Create Environment File

Create a file named `.env.local` in your project root directory with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://izjnryuoujzfxjyptnli.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Email Configuration (Optional for now)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM=your_email@gmail.com

# TestFlight Configuration (Optional for now)
TESTFLIGHT_LINK=https://testflight.apple.com/join/your_testflight_code
```

## Step 2: Get Your Supabase Keys

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/izjnryuoujzfxjyptnli
2. Click on **Settings** → **API**
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Test the Connection

1. Save the `.env.local` file
2. Restart your development server: `npm run dev`
3. Go to `http://localhost:3000/test`
4. Click "Test Supabase Connection"

## Step 4: Check Your Waitlist Table

Your table structure should be:

- `id` (int4, primary key)
- `email` (varchar, unique)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Troubleshooting

If you still get errors:

1. Make sure `.env.local` is in the root directory (same level as `package.json`)
2. Restart the development server after creating the file
3. Check the browser console for detailed error messages
4. Verify your Supabase keys are correct

## Expected Result

After setup, you should see:

- ✅ 121 total users in the dashboard
- ✅ All users displayed in the table
- ✅ Search functionality working
- ✅ Bulk selection working
