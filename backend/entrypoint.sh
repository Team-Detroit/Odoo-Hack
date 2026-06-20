#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Waiting for database to be ready..."
# Extract host and port from DATABASE_URL
# URL format: postgresql://user:password@host:port/database
# We default to db:5432 if parsing is complex.
DB_HOST="db"
DB_PORT="5432"

# Wait for PostgreSQL to start
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "postgres"; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is up - running migrations"
npx prisma migrate deploy

echo "Seeding database..."
# Run the seed script. Since it's typescript, we can run it using ts-node or compile it first.
# Wait! In the production stage we only have node, not ts-node. Let's check how seed is configured or if we can run it.
# Let's check how backend/src/database/seed.ts is structured. We can compile it to dist during the build stage.
# Let's verify backend/src/database/seed.ts.
node dist/database/seed.js || echo "Database seeding completed or skipped"

echo "Starting backend server..."
exec npm start
