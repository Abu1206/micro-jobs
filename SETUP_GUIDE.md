# CampusConnect - Setup Guide

## Project Overview

CampusConnect is a Next.js 16 application built with React 19, Tailwind CSS, and Supabase for connecting students with campus opportunities including jobs, events, and community connections.

## Installation & Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account

### Step 1: Environment Configuration

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

Get these values from your Supabase project settings:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to Settings > API
4. Copy the Project URL and Anon Key

### Step 2: Database Setup

Create the following tables in your Supabase database:

#### user_profiles table

```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  headline VARCHAR(255),
  university VARCHAR(255),
  major VARCHAR(255),
  skills TEXT[],
  github VARCHAR(255),
  behance VARCHAR(255),
  linkedin VARCHAR(255),
  profile_photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### job_listings table

```sql
CREATE TABLE job_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  salary VARCHAR(100),
  job_type VARCHAR(100),
  category VARCHAR(100),
  description TEXT,
  posted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### events table

```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP,
  location VARCHAR(255),
  organizer UUID REFERENCES auth.users(id),
  max_attendees INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### job_applications table

```sql
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
  status VARCHAR(100) DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);
```

### Step 3: Storage Setup

Enable Storage in Supabase:

1. Create a new bucket called `profile-photos`
2. Set the bucket to public
3. Add the following bucket policy:

```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
USING (true);
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your application.

## Project Structure

```
micro-jobs/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   └── profile/
│   │       ├── route.ts
│   │       └── upload-photo/route.ts
│   ├── auth/
│   │   ├── signup/page.tsx
│   │   ├── login/page.tsx
│   │   └── verify-email/page.tsx
│   ├── profile/
│   │   ├── setup/page.tsx
│   │   └── [userId]/page.tsx
│   ├── dashboard/page.tsx
│   ├── guest/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── package.json
└── .env.local
```

## Pages Overview

### Public Pages

- **Home** (`/`) - Landing page with auth options
- **Guest Browse** (`/guest`) - Browse jobs and events without account
- **Public Profile** (`/profile/[userId]`) - View user profiles

### Authentication Pages

- **Sign Up** (`/auth/signup`) - Create account with email/password
- **Log In** (`/auth/login`) - Login with credentials
- **Verify Email** (`/auth/verify-email`) - Email verification page

### Authenticated Pages

- **Profile Setup** (`/profile/setup`) - Complete profile after signup
- **Dashboard** (`/dashboard`) - User dashboard with quick actions

## API Routes

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Profile

- `GET /api/profile` - Get current user profile
- `POST /api/profile` - Update user profile
- `POST /api/profile/upload-photo` - Upload profile photo

## Features

### ✅ Implemented

- [x] User authentication with Supabase
- [x] Profile creation and editing
- [x] Profile photo uploads
- [x] Skills and interests management
- [x] Social media links (GitHub, LinkedIn, Behance)
- [x] Public profile viewing
- [x] Job browsing (guest and authenticated)
- [x] Event discovery
- [x] Responsive mobile and desktop views
- [x] Dark mode support

### 🚀 Ready to Implement

- [ ] Job applications
- [ ] Event registration
- [ ] Messaging system
- [ ] Job recommendations
- [ ] Search and filters
- [ ] User notifications
- [ ] Admin dashboard
- [ ] Analytics

## Technologies Used

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Language**: TypeScript
- **Icons**: Material Symbols

## Development Tips

### Running in Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

1. Build: `npm run build`
2. Export: `npm export`
3. Deploy the `out` directory to your hosting

## Troubleshooting

### Supabase Connection Issues

- Verify environment variables are correctly set
- Check Supabase URL and keys in the dashboard
- Ensure network access is allowed

### Database Issues

- Run migrations in Supabase SQL editor
- Check table names match the code
- Verify RLS (Row Level Security) policies

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (requires 18+)

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## License

MIT License - Feel free to use this project for your campus!
