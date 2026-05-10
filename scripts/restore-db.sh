#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./restore-db.sh <backup_file.sql.gz>"
  exit 1
fi

BACKUP_FILE=$1
DB_NAME="traveloop"

echo "🔄 Restoring database $DB_NAME from $BACKUP_FILE..."

# Decompress and restore
gunzip -c "$BACKUP_FILE" | psql -U postgres "$DB_NAME"

if [ $? -eq 0 ]; then
  echo "✅ Restore completed successfully!"
else
  echo "❌ Restore failed!"
  exit 1
fi
