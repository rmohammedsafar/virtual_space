#!/bin/bash

echo "==============================================="
echo "Starting backup process at $(date)"
echo "==============================================="

# Go to the backend directory
cd ~/virtual_space/backend || exit 1

# Ensure .env exists
if [ ! -f .env ]; then
  echo "Error: .env file not found in ~/virtual_space/backend."
  exit 1
fi

# Source the .env file safely
set -a
source .env
set +a

# Fallback values if not present
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USER:-root}
DB_NAME=${DB_NAME:-quickspace_db}

# Setup backup directory
mkdir -p ~/backups
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$HOME/backups/db_backup_$TIMESTAMP.sql"

echo "Dumping database $DB_NAME from $DB_HOST..."
if [ -n "$DB_PASSWORD" ]; then
  mysqldump --protocol=tcp -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"
else
  mysqldump --protocol=tcp -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"
fi

if [ $? -ne 0 ]; then
  echo "Error: mysqldump failed."
  exit 1
fi

echo "Database dump successful."

# S3 Backup
if [ -n "$BACKUP_S3_BUCKET_NAME" ] && [ -n "$BACKUP_AWS_REGION" ]; then
  echo "Uploading backup to S3 bucket $BACKUP_S3_BUCKET_NAME in region $BACKUP_AWS_REGION..."
  aws s3 cp "$BACKUP_FILE" "s3://$BACKUP_S3_BUCKET_NAME/db-backups/db_backup_$TIMESTAMP.sql" --region "$BACKUP_AWS_REGION"
  
  if [ $? -ne 0 ]; then
    echo "Error: Failed to upload database backup to S3."
  else
    echo "Database backup upload to S3 successful."
  fi
  
  if [ -n "$AWS_S3_BUCKET_NAME" ]; then
    echo "Syncing primary S3 bucket ($AWS_S3_BUCKET_NAME) to backup bucket..."
    aws s3 sync "s3://$AWS_S3_BUCKET_NAME" "s3://$BACKUP_S3_BUCKET_NAME/s3-backups/" --region "$BACKUP_AWS_REGION" --source-region ap-south-1
  fi
else
  echo "Warning: BACKUP_S3_BUCKET_NAME or BACKUP_AWS_REGION not found in .env. Skipping S3 upload and sync."
  echo "Please add these variables to your AWS Secrets Manager secret."
fi

# Clean up old local backups (keep last 7 days)
echo "Cleaning up local backups older than 7 days..."
find ~/backups -type f -name "*.sql" -mtime +7 -delete

echo "Backup process completed at $(date)."
echo "==============================================="
