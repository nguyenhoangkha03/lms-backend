#!/bin/bash
# Database setup script for LMS Backend
set -e

echo "🚀 Setting up LMS Database..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# Default values if not set in .env
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD:-}
DB_DATABASE=${DB_DATABASE:-lms_database}

echo "📋 Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_DATABASE"
echo "  Username: $DB_USERNAME"

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
until mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "SELECT 1" >/dev/null 2>&1; do
    echo "Waiting for MySQL..."
    sleep 2
done

echo "✅ MySQL is ready!"

# Create database if it doesn't exist
echo "🗃️ Creating database if not exists..."
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "✅ Database created/verified!"

# Run migrations
echo "🔄 Running database migrations..."
npm run migration:run

echo "🌱 Running database seeds..."
npm run seed

echo "🎉 Database setup completed successfully!"