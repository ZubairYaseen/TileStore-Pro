# TileStore Pro

TileStore Pro is a tile catalog, ordering, inventory, transfer, and reporting application built with Next.js, React, and MongoDB.

## Requirements

- Node.js 20 or newer: https://nodejs.org/
- MongoDB Community Server running locally, or a MongoDB Atlas cluster: https://www.mongodb.com/atlas

## Installation

```bash
git clone https://github.com/ZubairYaseen/Project.git
cd Project
npm install
```

## Database Configuration

The default database is:

```text
mongodb://127.0.0.1:27017/tileStorePrototype
```

Start MongoDB locally, or create `.env.local` in the project root for MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tileStorePrototype
```

Replace the placeholders with your database credentials. Do not commit `.env.local` or expose the connection string publicly.

## Seed Demo Data

Run this once to create sample categories, products, inventory, orders, and users:

```bash
npm run seed
```

Warning: seeding deletes the existing application data before inserting the demo data.

Demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@tilestore.com` | `admin123` |
| Super Admin | `superadmin@tilestore.com` | `admin123` |
| Admin | `ops@tilestore.com` | `admin123` |
| Customer | `ali@example.com` | `customer123` |
| Customer | `sana@example.com` | `customer123` |
| Customer | `hamza@example.com` | `customer123` |

## Run the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run lint      # Run ESLint
npm run seed      # Reset and insert demo database data
```

## Project Structure

- `app/` - Next.js pages and API routes
- `components/` - Shared layouts and UI components
- `models/` - MongoDB/Mongoose models
- `lib/` - Database and authentication helpers
- `scripts/seed.js` - Demo data seeding script
