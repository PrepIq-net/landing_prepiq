# Prisma Setup and Database Management

This project uses [Prisma](https://www.prisma.io/) as the ORM to manage interactions with a PostgreSQL database.

## Prerequisites

- PostgreSQL must be installed and running on your local machine.

## Configuration

The database connection is configured via environment variables. Ensure you have a `.env` file in the root directory with the following structure:

```bash
DATABASE_URL=postgres://<username>:<password>@localhost:5432/<database_name>
ADMIN_PASSWORD=<admin_password_for_seeding>
```

## Database Initialization

To initialize or synchronize the database schema with the defined Prisma models:

```bash
npx prisma db push
```

## Seeding

To populate the database with required initial data (admin users, pages, sections, links), run:

```bash
npm run db:seed
```

This command runs both the admin and pages seeding scripts.
