#!/bin/bash

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="traveloop"
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "💾 Starting database backup for $DB_NAME..."

# Execute pg_dump and compress
pg_dump -U postgres "$DB_NAME" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Backup completed: $BACKUP_FILE"
  # Keep only last 7 days
  find "$BACKUP_DIR" -type f -mtime +7 -name "*.sql.gz" -delete
  echo "🧹 Old backups cleaned up."
else
  echo "❌ Backup failed!"
  exit 1
fi
