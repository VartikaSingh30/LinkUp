# LinkUp - Professional Social Media Platform

A modern, production-ready LinkedIn-style social media application built with **React 18**, **TypeScript**, **Vite**, **Supabase**, and **TailwindCSS**.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green.svg)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-teal.svg)](https://tailwindcss.com/)

---

## 🚀 Features

### 👤 User Management
- **Authentication**: Secure signup/login with Supabase Auth
- **Login Options**: Email OR Username support
- **Profile Management**: Customizable profiles with headline, bio, location, website
- **Auto-generated Usernames**: Format `0302CS######` (customizable)
- **Real-time Username Validation**: Check availability during signup
- **Profile Viewing**: Visit and explore other users' profiles
- **Avatar Colors**: Personalized profile color schemes

### 📱 Social Features
- **News Feed**: Posts from followed users + your own posts
- **Post Creation**: Text posts with optional images
- **Post Interactions**: Like, comment, reply to posts
- **Comment Likes**: Like comments on posts
- **User Network**: Follow/unfollow users to build connections
- **Profile Discovery**: Explore and connect with professionals
- **Group Creation UI**: Interface for creating groups (extensible)

### 💬 Communication
- **Real-time Messaging**: Direct messages with live updates
- **AI Assistant**: Built-in LinkUp AI chat helper
- **Message History**: Conversation tracking
- **Online Status**: See active users
- **Profile Pictures**: User avatars in chats

### 💼 Professional Tools
- **Job Board**: Post job opportunities
- **Job Applications**: Apply to positions with resume links
- **Work Experience**: Add employment history
- **Education**: Track academic background
- **Skills**: Showcase professional skills with endorsements
- **Certificates**: Add licenses & certifications with credential URLs

### 🔔 Engagement
- **Notifications**: Real-time activity updates
- **Search**: Find users and content across the platform
- **Mobile Responsive**: Optimized for all devices
- **Dark Mode Ready**: Modern, professional design

---

## 🏗️ Architecture

### Tech Stack
```
Frontend:
├── React 18.3.1 - UI library
├── TypeScript - Type safety
├── Vite 5.4.8 - Build tool & dev server
├── TailwindCSS 3.4.1 - Styling
├── React Router v6 - Navigation
└── Lucide React - Icons

Backend:
├── Supabase - PostgreSQL database
├── Supabase Auth - Authentication
├── Supabase Realtime - Live updates
└── Supabase Storage - File uploads
```

### Project Structure
```
src/
├── components/
│   ├── Header.tsx              # Top navigation with search
│   ├── Sidebar.tsx             # Left sidebar navigation
│   ├── MobileBottomNav.tsx     # Mobile navigation bar
│   └── PostCard.tsx            # Reusable post component
├── context/
│   └── AuthContext.tsx         # Global auth state
├── lib/
│   ├── auth.ts                 # Auth helper functions
│   └── supabase.ts             # Supabase client
├── pages/
│   ├── Auth/
│   │   ├── Login.tsx           # Login with email/username
│   │   └── Signup.tsx          # Signup with username validation
│   ├── Home.tsx                # Feed and post creation
│   ├── Profile.tsx             # Own profile (edit mode)
│   ├── ProfileView.tsx         # View other users' profiles
│   ├── Network.tsx             # Connections & discovery
│   ├── Messages.tsx            # Real-time chat
│   ├── Notifications.tsx       # Activity feed
│   ├── Jobs.tsx                # Job board
│   └── Search.tsx              # Search results
├── App.tsx                     # Main app & routing
└── main.tsx                    # Entry point

supabase/
└── migrations/
    ├── 00_COMPLETE_DATABASE_SCHEMA.sql     # Master migration (969 lines)
    └── MIGRATION_COMPLETE_SUMMARY.md       # Database documentation
```

---

## 🗄️ Database Schema

### Core Tables
| Table | Description | Key Features |
|-------|-------------|--------------|
| **profiles** | User profiles | Username, bio, avatar_color, location |
| **posts** | Social posts | Content, images, videos |
| **post_likes** | Post likes | Unique constraint per user/post |
| **post_comments** | Comments | Nested replies supported |
| **comment_likes** | Comment likes | Like comments too |
| **connections** | Follow system | Follower/following relationships |
| **messages** | Direct messages | Real-time chat |
| **jobs** | Job postings | Full job board |
| **job_applications** | Applications | Resume links, status tracking |
| **notifications** | Activity feed | Likes, comments, follows |
| **experiences** | Work history | Company, position, dates |
| **education** | Academic background | School, degree, field |
| **skills** | Professional skills | Endorsements counter |
| **certificates** | Licenses & certs | Credential URLs |

### Key Functions
- `get_email_by_username(TEXT)` - Username/email login
- `is_username_available(TEXT, UUID)` - Real-time validation
- `get_followers_count(UUID)` - Count followers
- `get_following_count(UUID)` - Count following
- `is_following(UUID, UUID)` - Check relationship
- `get_feed_posts(UUID)` - Personalized feed

### Security
- **Row Level Security (RLS)** enabled on ALL tables
- Users can only edit their own data
- Public read for profiles, posts, connections
- Private messages, applications, notifications

---

## 📦 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Supabase Account** (free tier works)
- **Git** (optional)

### Step 1: Clone & Install
```bash
# Clone the repository
git clone <your-repo-url>
cd Link-main

# Install dependencies
npm install
```

### Step 2: Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to initialize (~2 minutes)

#### Run Database Migration
1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy entire content from `supabase/migrations/00_COMPLETE_DATABASE_SCHEMA.sql`
3. Paste into SQL editor
4. Click **"Run"** (executes 969 lines creating all tables, functions, policies)

This creates:
- ✅ 14 tables (profiles, posts, connections, messages, jobs, etc.)
- ✅ 9 functions (username login, feed retrieval, follower counts)
- ✅ 2 triggers (auto-profile creation, username generation)
- ✅ 2 views (user_feed, feed_posts)
- ✅ Storage buckets (avatars, posts) with policies
- ✅ 40+ RLS policies for security
- ✅ 26+ indexes for performance

#### Get API Keys
1. In Supabase Dashboard → **Settings** → **API**
2. Copy:
   - Project URL
   - Anon/Public Key

### Step 3: Environment Configuration

Create `.env` file in project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 🛠️ Available Scripts

```bash
# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🚀 Deployment

### Build Production Files
```bash
npm run build
```

Outputs to `dist/` folder.

### Deploy Options
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder
- **Cloudflare Pages**: Connect Git repo
- **Railway**: Deploy with environment variables

### Environment Variables
Set these in your hosting platform:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## Usage Guide

### Authentication
1. Visit the login page
2. Create a new account or sign in with existing credentials
3. Set up your profile with a headline, bio, and profile picture

### Creating Posts
1. Navigate to the Home page (default landing page)
2. Click in the "Start a post" text area
3. Add text content and optionally upload an image
4. Click "Post" to share

### Networking
1. Go to the Network page
2. Browse suggested users or search for specific profiles
3. Click "Follow" to connect with other professionals
4. Visit the "Following" tab to see your connections

### Messaging
1. Navigate to Messages
2. Select a conversation or start a new one
3. Type your message and click Send
4. Messages sync in real-time across devices

### Job Board
1. Go to the Jobs page
2. Browse available positions
3. Click "Apply Now" to submit an application
4. To post a job, click "Post Job" and fill in the details

### Notifications
1. Click the Notifications icon in the sidebar
2. View all activities or filter by unread
3. Mark notifications as read or delete them

### Search
1. Use the search bar in the header
2. Search for users by name or posts by content
3. Filter results by Posts or People tabs

---

## 🎨 Key Features Implementation

### Username Login System
Users can log in with **email OR username**:
```typescript
// Frontend
await signIn(emailOrUsername, password)

// Backend function checks if input contains '@'
// If no '@', calls get_email_by_username() to resolve email
```

### Real-time Feed
Posts from followed users appear instantly:
```sql
-- Feed query uses connections table
SELECT * FROM posts 
WHERE user_id IN (
  SELECT following_id FROM connections 
  WHERE follower_id = current_user
)
OR user_id = current_user
ORDER BY created_at DESC;
```

### Auto Profile Creation
Profiles auto-create on signup via trigger:
```sql
-- Trigger on auth.users INSERT
-- Creates profile with username, full_name
-- Auto-generates username if not provided (0302CS######)
```

### Certificate System
Add professional licenses with links:
- Certificate name & issuing organization
- Issue date & expiry date
- Credential ID & URL
- Viewable on profile pages

---

## 📱 Mobile Optimization

- ✅ Responsive layouts for all screen sizes
- ✅ Mobile bottom navigation bar
- ✅ Sticky headers in chat
- ✅ Touch-friendly buttons (48px+ tap targets)
- ✅ Optimized images
- ✅ Fast loading with Vite

---

## 🔐 Security Features

- ✅ **Row Level Security (RLS)** on all tables
- ✅ **Secure password hashing** via Supabase Auth
- ✅ **Email verification** support
- ✅ **JWT tokens** for authentication
- ✅ **Storage folder isolation** (user_id based)
- ✅ **SQL injection protection** (parameterized queries)
- ✅ **XSS protection** (React escaping)

---

## 🧪 Testing Queries

See `supabase/migrations/00_COMPLETE_DATABASE_SCHEMA.sql` for verification queries at the end.

Quick checks:
```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check your profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Check storage buckets
SELECT * FROM storage.buckets;
```

---

## 📚 Documentation

All database documentation is in:
- **`supabase/migrations/00_COMPLETE_DATABASE_SCHEMA.sql`** - Complete database setup (969 lines)
- **`supabase/migrations/MIGRATION_COMPLETE_SUMMARY.md`** - Feature breakdown

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🆘 Troubleshooting

### "relation does not exist" errors
→ Run the complete database migration in Supabase SQL Editor

### Icons not loading
→ Clear browser cache, lucide-react is in Vite optimizeDeps

### Real-time not working
→ Enable Realtime in Supabase Dashboard → Database → Replication

### Storage upload fails
→ Check storage buckets exist and policies are set

### Feed shows no posts
→ Follow some users first, create test posts

---

## 📞 Support

- **Issues**: Open a GitHub issue
- **Docs**: See `supabase/migrations/` folder
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star!

---

**Built with ❤️ using React, TypeScript, and Supabase**

*Last Updated: December 6, 2025*
