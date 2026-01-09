# CampusConnect - Setup & Database Configuration

## Environment Setup

Your `.env.local` file is already configured with Supabase credentials.

## Database Setup

### Option 1: Automatic Setup (Recommended)

Run the seed script to create tables and insert sample data:

```bash
npm run seed:db
```

### Option 2: Manual Setup

1. Go to [Supabase Dashboard](https://supabase.com)
2. Open the SQL Editor in your project
3. Copy and paste the contents of `setup-database.sql`
4. Execute the SQL

## Database Tables

### opportunities

- Stores all posted opportunities (jobs, events, collaborations)
- Fields: id, user_id, title, category, description, location, deadline, tags, media_urls, status, created_at, updated_at

### applications

- Tracks when users express interest in opportunities
- Fields: id, user_id, opportunity_id, status, created_at, updated_at

### saved_opportunities

- Stores bookmarked opportunities for users
- Fields: id, user_id, opportunity_id, created_at

### user_profiles

- User profile information and metadata
- Fields: id, user_id, full_name, headline, university, major, profile_photo_url, skills, github_url, behance_url, linkedin_url, verified, rating, endorsements, year, avatar_url, created_at, updated_at

## Testing the Application

### With Mock Data (Development)

The application automatically falls back to mock data if:

- The database isn't set up yet
- Network issues occur
- Supabase is unreachable

This ensures you can test the entire UI/UX without a database.

### With Real Database

1. Run the seed script: `npm run seed:db`
2. Create test users via Supabase Auth dashboard
3. Create opportunities through the app UI
4. Real data will display in all pages

## API Routes

### Opportunities

- `GET /api/opportunities` - List opportunities with filtering
- `GET /api/opportunities/[id]` - Get single opportunity details
- `POST /api/opportunities/create` - Create new opportunity
- `POST /api/opportunities/[id]/interest` - Express interest in opportunity

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## Troubleshooting

### "Error fetching opportunity: {}"

This error typically means the database isn't set up yet. The app will automatically use mock data, so you can still navigate and test the UI.

To fix permanently:

```bash
npm run seed:db
```

### Connection Issues

Make sure your Supabase URL and keys are correct in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Tables Not Created

Execute the SQL from `setup-database.sql` directly in Supabase SQL Editor.

## Development Notes

- Mock data is provided for IDs: "1", "2"
- The app gracefully falls back to mock data when database isn't available
- All RLS (Row Level Security) policies are configured for proper data isolation
- Users can only view, create, and modify their own data

## Next Steps

1. Test the full user flow: signup → profile setup → dashboard → browse → details
2. Create opportunities through the UI
3. Express interest in opportunities
4. Bookmark/save opportunities
5. View creator profiles
