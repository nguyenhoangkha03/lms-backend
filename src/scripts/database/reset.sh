#!/bin/bash

# Database reset script
set -e

echo "⚠️  WARNING: This will completely reset the database!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled"
    exit 1
fi

echo "🔄 Resetting database..."

# Drop and recreate database
echo "🗑️ Dropping existing database..."
npm run schema:drop

echo "🔄 Running migrations..."
npm run migration:run

echo "🌱 Running seeds..."
npm run seed

echo "✅ Database reset completed!"