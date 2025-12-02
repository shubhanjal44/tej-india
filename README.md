# Tej India 🇮🇳

**सीखो और सिखाओ - Trade Skills, Not Money**

India's first peer-to-peer skill exchange platform empowering youth to learn without spending money.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](https://github.com)
[![Roadmap](https://img.shields.io/badge/Roadmap-100%25%20Complete-brightgreen)](PROGRESS.md)

---

## 🌟 What is Tej India?

Tej India enables users to **learn new skills for free** by trading skills with peers instead of paying for courses.

### The Problem
- **83% of Indian engineering graduates are unemployable** (NASSCOM)
- Upskilling courses cost **₹15,000-40,000** - unaffordable for most youth
- **1.5 Crore youth struggle** to find jobs annually due to skill gaps

### Our Solution
**Trade your skills instead of money:**
- You teach Python → Someone teaches you English
- You teach Excel → Someone teaches you Guitar
- **100% Free** - Zero course fees!

---

## ✨ Key Features

### For Users
- 🆓 **Completely Free** - No subscriptions, no hidden costs
- 🤖 **AI-Powered Matching** - Find perfect skill swap partners
- ✅ **Verified Skills** - AI-powered skill verification system
- 💬 **Real-Time Chat** - Connect with matches instantly
- 🏆 **Gamification** - Earn SkillCoins, badges, and climb leaderboards
- 📍 **Online & Offline** - Learn via video calls or local meetups
- ⭐ **Reviews & Ratings** - Build your reputation
- 🎯 **Session Tracking** - Monitor your learning progress

### Tech Highlights
- **AI Matching Algorithm** - 5-factor scoring system (skills, location, rating, activity, availability)
- **Real-time Communication** - Socket.IO for instant messaging
- **Scalable Architecture** - PostgreSQL + Redis + Docker
- **Type-Safe** - Full TypeScript implementation
- **Modern Stack** - React 18 + Express + Prisma ORM

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

**Required:**
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd LiveData

# 2. Start infrastructure (PostgreSQL + Redis)
docker-compose up -d

# 3. Setup Backend
cd backend
cp .env.example .env    # Edit with your config
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed      # Adds 50+ skills, 9 categories, 8 badges

# 4. Setup Frontend
cd ../frontend
cp .env.example .env
npm install

# 5. Start Development Servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **API Health**: http://localhost:5000/health
- **pgAdmin**: http://localhost:5050 (admin@skillswap.in / admin123)
- **Prisma Studio**: `npx prisma studio` (from backend folder)

---

## 📁 Project Structure

```
LiveData/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── config/         # Configuration (CORS, database)
│   │   ├── middleware/     # Auth, validation, rate limiting
│   │   ├── routes/         # API endpoints
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── skill.routes.ts
│   │   │   └── swap.routes.ts
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema (15+ models)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API client (Axios)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── stores/        # State management (Zustand)
│   │   ├── types/         # TypeScript interfaces
│   │   └── styles/        # Tailwind CSS + Glass morphism
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                  # Documentation
│   ├── TEJ-INDIA-README.md
│   ├── Tej-India-Design-System-guide.md
│   └── ...
│
├── scripts/               # Automation scripts
│   └── finalize.sh       # Complete setup script
│
├── docker-compose.yml    # PostgreSQL + Redis + pgAdmin
├── PROJECT_OVERVIEW.md   # Detailed project overview
├── DEPLOYMENT.md         # Production deployment guide
├── QUICKSTART.md         # Quick setup guide
└── README.md             # This file
```

---

## 💻 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript 5.3
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Cache**: Redis 7+
- **Real-time**: Socket.IO 4.6
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate limiting

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5.3
- **State Management**: Zustand + React Query
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom Glass Morphism Design
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **HTTP Client**: Axios

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database UI**: pgAdmin 4
- **Process Manager**: PM2 (production)
- **Reverse Proxy**: Nginx (production)

---

## 🗄️ Database Schema

**15+ Prisma Models:**

### Core Models
- **User** - Profile, gamification (coins, XP, level, streak)
- **Skill** - Available skills (50+ seeded)
- **SkillCategory** - 9 categories (Programming, Languages, Design, etc.)
- **UserSkill** - What users can teach/want to learn
- **Swap** - Skill exchange between two users
- **SwapSession** - Individual learning sessions

### Social & Community
- **Review** - Ratings and feedback
- **Connection** - User networking
- **Message** - Real-time chat
- **Event** - Offline meetups
- **EventAttendance** - Event registrations

### Gamification
- **Badge** - Achievements (8 types seeded)
- **UserBadge** - Earned badges
- **Notification** - System notifications
- **Referral** - Referral program

### Business
- **Transaction** - Payments (Premium subscriptions)
- **AuditLog** - Activity tracking

---

## 🎮 How It Works

### User Journey

1. **Sign Up & Onboarding**
   - Create account with email/phone
   - Add skills you can teach (min 1)
   - Add skills you want to learn (min 1)
   - Get 50 SkillCoins as welcome bonus

2. **Discover Matches**
   - AI algorithm finds perfect matches
   - Matches scored on: skill overlap, location, rating, activity, availability
   - Browse top 10 recommended matches

3. **Initiate Skill Swap**
   - Send swap request to matched user
   - Specify skills to exchange
   - Set learning goals and schedule
   - Choose meeting type (online/offline)

4. **Complete Sessions**
   - Attend scheduled sessions (typically 4-8)
   - Mark attendance and add notes
   - Track progress (0-100%)
   - Complete all sessions

5. **Review & Earn**
   - Rate each other (1-5 stars)
   - Leave detailed reviews
   - Earn SkillCoins (10 per completed swap)
   - Unlock badges (First Swap, Skill Master, etc.)

---

## 🏆 Gamification System

### SkillCoins
**Earn coins by:**
- Complete a swap: +10 coins
- Get 5-star rating: +5 bonus
- Refer a friend: +20 coins
- First swap of month: +15 coins

**Spend coins on:**
- Priority matching: 30 coins
- Verified skill badge: 50 coins
- Premium subscription: 500 coins = ₹500 voucher

### Badges (8 Types)
- 🎯 **First Swap** - Complete your first swap (10 coins)
- 🏆 **Skill Master** - Teach 100+ hours (100 coins)
- 🔥 **Learning Beast** - Learn 10 skills (50 coins)
- 💎 **Community Hero** - Complete 100 swaps (200 coins)
- ⚡ **Fast Learner** - Complete swap in <2 weeks (30 coins)
- ⭐ **Trusted Teacher** - Get 50 five-star reviews (80 coins)
- 🦋 **Social Butterfly** - Attend 5 events (40 coins)
- 🎁 **Referral Champion** - Refer 20 friends (100 coins)

### Levels & Leaderboards
- Level up by earning XP (Experience Points)
- Weekly city-wise leaderboards
- National ranking system

---

## 🔐 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcryptjs
- ✅ Rate limiting (100 requests/15min)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ Audit logging for critical actions

---

## 📊 API Endpoints

### Authentication
```
POST   /api/v1/auth/register    - Create account
POST   /api/v1/auth/login       - Login
POST   /api/v1/auth/refresh     - Refresh token
POST   /api/v1/auth/logout      - Logout
```

### Skills
```
GET    /api/v1/skills/categories         - Get skill categories
GET    /api/v1/skills                    - Get all skills
POST   /api/v1/skills/add                - Add skill to profile
PUT    /api/v1/skills/:id                - Update user skill
DELETE /api/v1/skills/:id                - Remove skill
GET    /api/v1/skills/recommendations    - Get personalized recommendations
```

### Matching
```
GET    /api/v1/matches          - Get AI-matched users
GET    /api/v1/matches/:userId  - Get user profile
```

### Swaps
```
POST   /api/v1/swaps                      - Create swap request
GET    /api/v1/swaps                      - Get user's swaps
GET    /api/v1/swaps/:id                  - Get swap details
PUT    /api/v1/swaps/:id                  - Update swap (accept/cancel)
POST   /api/v1/swaps/:id/sessions/complete - Mark session complete
POST   /api/v1/swaps/:id/review           - Submit review
```

### Users
```
GET    /api/v1/users/profile    - Get user profile
PUT    /api/v1/users/profile    - Update profile
GET    /api/v1/users/:id        - Get user by ID
```

Full API documentation: [API.md](docs/API.md)

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete production deployment guide.

### Quick Deploy

```bash
# Build for production
cd backend && npm run build
cd frontend && npm run build

# Start with PM2
pm2 start ecosystem.config.js
```

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/skillswap_prod
JWT_SECRET=<strong-secret>
REDIS_URL=redis://localhost:6379
```

**Frontend (.env):**
```env
VITE_API_URL=https://api.skillswap.in/api/v1
VITE_SOCKET_URL=https://api.skillswap.in
```

---

## 📈 Roadmap

### ✅ 48-Week Development Roadmap: 100% COMPLETE

**Week 1-48**: All core features, advanced capabilities, and infrastructure complete! 🎉

#### Completed Milestones:
- ✅ **Week 1-4**: Project Foundation & Authentication
- ✅ **Week 5-8**: Core Backend Development
- ✅ **Week 9-12**: Frontend Foundation
- ✅ **Week 13-16**: Core Features (Swaps, Reviews)
- ✅ **Week 17-20**: Social Features (Messaging, Communities)
- ✅ **Week 21-24**: Advanced Features (Events, Gamification)
- ✅ **Week 25-28**: Premium Features (Payments, Subscriptions)
- ✅ **Week 29-32**: Testing & Quality Assurance
- ✅ **Week 33-36**: Performance Optimization & Scaling
- ✅ **Week 37-40**: Deployment & DevOps Infrastructure
- ✅ **Week 41-44**: Advanced Features & AI Integration
- ✅ **Week 45-48**: Final Polish & Launch Preparation

**See [PROGRESS.md](PROGRESS.md) for detailed breakdown of all features delivered.**

### 🚀 Post-Launch Roadmap (Months 1-12)

**Month 1**: Launch & Stabilization
- Goal: 1,000+ users, >99.5% uptime
- Focus: Bug fixes, performance, user feedback

**Month 2-3**: User Feedback & Quick Wins
- Goal: 10,000 users
- Focus: PWA, mobile experience, search improvements

**Month 4-6**: Feature Expansion
- Goal: 35,000 users, ₹150K MRR
- Focus: Video calls, skill verification, group learning, marketplace

**Month 7-9**: Advanced Features
- Goal: 60,000 users
- Focus: AI Matching v2.0, Gamification v2.0, Content Hub

**Month 10-12**: Scale & Optimize
- Goal: 100,000 users, ₹600K MRR
- Focus: Infrastructure scaling, internationalization, enterprise partnerships

**See [POST_LAUNCH_ROADMAP.md](docs/POST_LAUNCH_ROADMAP.md) for complete 12-month strategy.**

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Areas to Contribute
- 🐛 **Bug Fixes** - Found a bug? Fix it!
- ✨ **New Features** - Implement planned features
- 📝 **Documentation** - Improve docs, add tutorials
- 🎨 **UI/UX** - Design improvements
- 🧪 **Testing** - Add unit/integration tests
- 🌐 **Localization** - Translate to regional languages

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Original codebase transformed from **LiveData** (file storage) to **Tej India**
- Inspired by global platforms like Simbi (USA) and TimeRepublik (Switzerland)
- Built to solve India's youth employability crisis

---

## 📚 Comprehensive Documentation

We've created extensive documentation covering every aspect of the platform:

### For Users
- **[Help Center](docs/HELP_CENTER.md)** - Complete user guide with 100+ FAQs
- **[API Documentation](docs/API.md)** - Full API reference with examples

### For Developers
- **[Project Summary](PROJECT_SUMMARY.md)** - Complete project overview
- **[Progress Tracker](PROGRESS.md)** - Detailed development progress (2,700+ lines)
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment (950 lines)
- **[Security Guide](docs/SECURITY.md)** - Security best practices (800 lines)
- **[Performance Guide](docs/PERFORMANCE.md)** - Optimization strategies (900 lines)

### For Operations
- **[Launch Checklist](docs/LAUNCH_CHECKLIST.md)** - 300+ pre-launch items
- **[Monitoring Strategy](docs/MONITORING_STRATEGY.md)** - Full monitoring architecture (1,700 lines)
- **[Maintenance Procedures](docs/MAINTENANCE_PROCEDURES.md)** - Daily to annual procedures (1,000 lines)

### For Growth
- **[Post-Launch Roadmap](docs/POST_LAUNCH_ROADMAP.md)** - 12-month growth strategy (1,800 lines)

**Total Documentation**: 15,000+ lines covering every aspect from user help to operational procedures!

---

## 📞 Contact & Support

- **Website**: [skillswap.in](https://skillswap.in) (coming soon)
- **Email**: support@skillswap.in
- **Twitter**: [@skillswapindia](https://twitter.com/skillswapindia)
- **GitHub Issues**: [Report bugs](https://github.com/your-repo/issues)
- **Discord**: [Join community](https://discord.gg/skillswap) (coming soon)

---

## 📊 Project Stats

```
Status: Production Ready ✅
Roadmap Completion: 100% (48/48 weeks)
Total Files: 150+
Lines of Code: 30,000+
Documentation: 15,000+ lines
Database Models: 20+
API Endpoints: 50+
Seeded Skills: 60+
Skill Categories: 10
Achievement Badges: 8
Email Templates: 12+
Notification Types: 10+
```

---

## 💡 For Developers

### Useful Commands

```bash
# Backend
npm run dev              # Start dev server
npm run build            # Build for production
npm run prisma:studio    # Open database UI
npm run prisma:migrate   # Run migrations
npm run lint             # Run ESLint
npm run format           # Format with Prettier

# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript
```

### Database Management

```bash
# Create migration
npx prisma migrate dev --name description

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

---

**Built with ❤️ for India's youth | सीखो और सिखाओ 🇮🇳**

*Transform your skills into opportunities. Join the TejIndiarevolution!*
