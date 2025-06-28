#!/bin/bash

# Wait for the database to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Generate migration files
echo "Generating migrations..."
npm run db:generate

# Apply migrations to database
echo "Applying migrations to database..."
npm run db:push

echo "Database initialization complete!" 