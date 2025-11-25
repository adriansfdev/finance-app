# Finance App

A personal finance management application built with Next.js, NextAuth, Hero UI, and PostgreSQL.

## Features

- ✅ User authentication (email/password)
- ✅ Personal and shared accounts
- ✅ Income and expense tracking
- ✅ Customizable categories
- ✅ Monthly budgets
- ✅ Monthly summary
- 🔄 Dashboards (in development)
- 🔄 Transactions management (in development)
- 🔄 Budgets management (in development)
- 🔄 Accounts management (in development)

## Tech Stack

- **Next.js 14** - React framework with App Router
- **NextAuth.js v5** - Authentication
- **Hero UI** - UI component library
- **Prisma** - ORM for PostgreSQL
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Docker** - Local PostgreSQL database
- **PostgreSQL** - Database

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js >= 18.17.0** (required for Next.js 14)
- **npm** or **yarn** package manager
- **Docker Desktop** (for local database)

### Installing Node.js

If you don't have Node.js installed or have an older version:

**Using nvm (recommended):**
```bash
nvm install 18
nvm use 18
```

**Or download from:**
- [Node.js official website](https://nodejs.org/)

### Installing Docker Desktop

Download and install Docker Desktop from:
- [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
- [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)

Make sure Docker Desktop is running before starting the database.

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd finance-app
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

**Note:** We use `--legacy-peer-deps` because Hero UI v2.4 requires Tailwind CSS v4, but we're using Tailwind v3.4 for compatibility. This flag allows npm to install despite the peer dependency warning.

### 3. Set up environment variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

The `.env.example` file already contains the correct configuration for local PostgreSQL with Docker. You only need to generate the `NEXTAUTH_SECRET`:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

Copy the generated string and paste it in your `.env` file as the value for `NEXTAUTH_SECRET`.

Your `.env` file should look like this:

```env
DATABASE_URL="postgresql://finance_user:finance_password@localhost:5433/finance_app?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
NODE_ENV="development"
```

**Note:** The database uses port `5433` instead of the default `5432` to avoid conflicts with other PostgreSQL instances.

### 4. Start the local database

Make sure Docker Desktop is running, then:

```bash
npm run db:up
```

This will start PostgreSQL in a Docker container. The first time it runs, it will download the PostgreSQL image, which may take a few minutes.

Verify the database is running:

```bash
docker ps
```

You should see a container named `finance-app-db` running.

### 5. Set up the database schema

```bash
# Generate Prisma Client
npm run db:generate

# Create tables in the database
npm run db:push
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Development
- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:up` - Start PostgreSQL in Docker
- `npm run db:down` - Stop PostgreSQL
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Sync schema with database (development)
- `npm run db:migrate` - Run migrations (production)
- `npm run db:studio` - Open Prisma Studio (GUI to view/edit data)
- `npm run db:reset` - Reset database (⚠️ deletes all data)

## Viewing Database Data

### Option 1: Prisma Studio (Recommended)

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables and data
- Edit records
- Create new records
- Filter and search

### Option 2: PostgreSQL Client

You can use any PostgreSQL client (pgAdmin, DBeaver, TablePlus, etc.) and connect to:
- **Host:** `localhost`
- **Port:** `5433`
- **User:** `finance_user`
- **Password:** `finance_password`
- **Database:** `finance_app`

### Option 3: Terminal (psql)

```bash
docker exec -it finance-app-db psql -U finance_user -d finance_app
```

## Project Structure

```
finance-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── auth/         # Authentication (NextAuth)
│   ├── dashboard/        # Dashboard pages
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/           # React components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utilities and helpers
│   ├── prisma.ts        # Prisma client instance
│   └── utils.ts         # Helper functions
├── prisma/               # Prisma schema
│   └── schema.prisma    # Database models
├── types/                # TypeScript types
├── docker-compose.yml    # PostgreSQL local configuration
└── .env                  # Environment variables (not in git)
```

## Database Models

- **User** - Application users
- **Account** - Personal or shared accounts
- **AccountMember** - Relationship between users and accounts
- **Transaction** - Income and expense transactions
- **Category** - Transaction categories
- **Budget** - Monthly budgets

## Current Status

### ✅ Working Features
- User registration
- User login
- User logout
- Dashboard with monthly summary
- Account display (read-only)

### 🔄 In Development
- Transactions management (add, edit, delete)
- Budgets management
- Accounts management (create, edit, share)
- Categories management

## Troubleshooting

### Database won't start
```bash
# Check if Docker is running
docker ps

# Check container logs
docker logs finance-app-db

# Restart the container
npm run db:down
npm run db:up
```

### Port 5432 already in use
The application uses port `5433` by default to avoid conflicts. If you need to change it:
1. Update `docker-compose.yml` (change `5433:5432` to your desired port)
2. Update `.env` (change `localhost:5433` to your desired port)

### Database connection error
- Verify the container is running: `docker ps`
- Verify `.env` has the correct `DATABASE_URL`
- Make sure you ran `npm run db:push`

### "Cannot connect to Docker daemon"
- Make sure Docker Desktop is running
- Verify with: `docker ps`

### Reset the database
```bash
npm run db:reset
```
⚠️ **Warning:** This will delete all data.

## Deployment

### Deploy to Vercel

1. Connect your repository to Vercel
2. Configure environment variables in Vercel:
   - `DATABASE_URL` (from your PostgreSQL service)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Vercel domain)
3. Vercel will automatically detect Next.js and deploy

### Database Options for Production

- **Supabase** - Free tier available
- **Neon** - Serverless PostgreSQL
- **Railway** - Easy PostgreSQL hosting
- **Render** - PostgreSQL hosting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
