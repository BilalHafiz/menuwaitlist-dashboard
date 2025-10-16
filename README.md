# Waitlist Email Dashboard

A Next.js dashboard for managing waitlist users and sending TestFlight invitations via email.

## Features

- 📊 View and manage waitlist users from Supabase
- ✉️ Send bulk TestFlight invitations via email
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🔍 Search and filter users
- 📱 Email preview functionality
- ✅ Bulk user selection
- 📈 Send results tracking

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for database
- **Nodemailer** for email sending
- **Lucide React** for icons

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Email Configuration (for sending TestFlight links)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM=your_email@gmail.com

# TestFlight Configuration
TESTFLIGHT_LINK=https://testflight.apple.com/join/your_testflight_code
```

### 3. Supabase Setup

1. Create a Supabase project
2. Create a `waitlist` table with the following structure:
   ```sql
   CREATE TABLE waitlist (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
3. Get your project URL and API keys from the Supabase dashboard
4. Update the environment variables

### 4. Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use this app password in the `EMAIL_PASS` variable

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Usage

1. **Select Users**: Choose users from the waitlist table by checking the boxes
2. **Configure Email**:
   - Enter your TestFlight invitation link
   - Optionally add a custom message
   - Preview the email before sending
3. **Send Emails**: Click "Send Emails" to send TestFlight invitations to selected users
4. **Track Results**: View sending results and any failed deliveries

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── send-email/route.ts    # Email sending API
│   │   └── waitlist/route.ts      # Waitlist data API
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main dashboard page
├── components/
│   ├── EmailComposer.tsx          # Email composition component
│   └── WaitlistTable.tsx          # User table component
├── lib/
│   ├── email.ts                   # Email utilities
│   └── supabase.ts                # Supabase client
└── ...
```

## API Endpoints

### GET /api/waitlist

Fetch waitlist users with pagination and search.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)
- `search`: Search term for email filtering

### POST /api/send-email

Send TestFlight invitation emails to selected users.

**Request Body:**

```json
{
  "emails": ["user1@example.com", "user2@example.com"],
  "subject": "TestFlight Invitation",
  "customMessage": "Welcome to our beta!",
  "testFlightLink": "https://testflight.apple.com/join/your_code"
}
```

## Customization

### Email Template

The email template can be customized in `lib/email.ts` in the `generateTestFlightEmailHTML` function.

### Styling

The dashboard uses Tailwind CSS. You can customize the design by modifying the Tailwind configuration in `tailwind.config.js`.

### Database Schema

If your waitlist table has a different structure, update the `WaitlistUser` interface in `lib/supabase.ts` and adjust the API queries accordingly.

## Troubleshooting

### Email Not Sending

1. Check your email credentials in `.env.local`
2. Ensure 2FA is enabled and you're using an App Password
3. Check the console for error messages

### Supabase Connection Issues

1. Verify your Supabase URL and API keys
2. Check that the `waitlist` table exists and has the correct structure
3. Ensure RLS policies allow access if enabled

### Build Issues

1. Make sure all dependencies are installed: `npm install`
2. Check TypeScript errors: `npm run lint`
3. Verify environment variables are set correctly

## License

MIT License - feel free to use this project for your own waitlist management needs!
