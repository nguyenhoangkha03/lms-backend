#!/bin/bash

# Database backup script
set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD:-}
DB_DATABASE=${DB_DATABASE:-lms_database}

# Create backup directory
BACKUP_DIR="backups/database"
mkdir -p $BACKUP_DIR

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/lms_backup_$TIMESTAMP.sql"

echo "💾 Creating database backup..."
echo "📁 Backup file: $BACKUP_FILE"

# Create backup
mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" \
    --routines --triggers --events --single-transaction \
    "$DB_DATABASE" > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"

echo "✅ Backup created: ${BACKUP_FILE}.gz"

# Keep only last 10 backups
echo "🧹 Cleaning old backups..."
cd "$BACKUP_DIR"
ls -t lms_backup_*.sql.gz | tail -n +11 | xargs -r rm

echo "🎉 Backup completed successfully!"