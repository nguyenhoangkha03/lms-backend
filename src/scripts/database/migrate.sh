#!/bin/bash

# Migration management script
set -e

ACTION=${1:-help}

case $ACTION in
    "generate")
        if [ -z "$2" ]; then
            echo "Usage: $0 generate <migration_name>"
            exit 1
        fi
        
        echo "📝 Generating migration: $2"
        npm run migration:generate src/database/migrations/$2
        ;;
        
    "run")
        echo "🔄 Running pending migrations..."
        npm run migration:run
        ;;
        
    "revert")
        echo "⏪ Reverting last migration..."
        npm run migration:revert
        ;;
        
    "status")
        echo "📊 Migration status:"
        npm run typeorm -- migration:show -d src/config/database.config.ts
        ;;
        
    "create")
        if [ -z "$2" ]; then
            echo "Usage: $0 create <migration_name>"
            exit 1
        fi
        
        TIMESTAMP=$(date +"%Y%m%d%H%M%S")
        MIGRATION_NAME="${TIMESTAMP}-${2}"
        MIGRATION_FILE="src/database/migrations/${MIGRATION_NAME}.ts"
        
        echo "📝 Creating empty migration: $MIGRATION_NAME"
        
        cat > "$MIGRATION_FILE" << EOF
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${2}${TIMESTAMP} implements MigrationInterface {
  name = '${2}${TIMESTAMP}';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add your migration logic here
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add your rollback logic here
  }
}
EOF
        
        echo "✅ Migration created: $MIGRATION_FILE"
        ;;
        
    "help"|*)
        echo "🔧 Database Migration Management"
        echo ""
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  generate <name>   Generate migration from entity changes"
        echo "  create <name>     Create empty migration file"
        echo "  run               Run pending migrations"
        echo "  revert            Revert last migration"
        echo "  status            Show migration status"
        echo "  help              Show this help message"
        ;;
esac
