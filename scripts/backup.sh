#!/usr/bin/env bash
# ========================================================
# EdSecure Hub - Automated PostgreSQL Backup Script
# ========================================================
#
# Usage:
#   ./scripts/backup.sh
#
# Cron (daily at 3:00 AM UTC):
#   0 3 * * * /opt/edsecure/scripts/backup.sh >> /var/log/edsecure-backup.log 2>&1
#
# Environment variables (set in .env or export before running):
#   POSTGRES_CONTAINER  - Docker container name (default: edsecure-postgres)
#   POSTGRES_USER       - Database user (default: edsecure_admin)
#   POSTGRES_DB         - Database name (default: edsecure_db)
#   BACKUP_DIR          - Local backup directory (default: /mnt/backups/postgres)
#   BACKUP_RETENTION    - Days to keep local backups (default: 30)
#   S3_BUCKET           - S3 bucket for off-site backup (optional)
#   WEBHOOK_URL         - Slack/Discord webhook for failure alerts (optional)
# ========================================================

set -euo pipefail

# ── Configuration ─────────────────────────────────────────
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_HUMAN=$(date -u '+%Y-%m-%d %H:%M:%S UTC')

POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-edsecure-postgres}"
POSTGRES_USER="${POSTGRES_USER:-edsecure_admin}"
POSTGRES_DB="${POSTGRES_DB:-edsecure_db}"
BACKUP_DIR="${BACKUP_DIR:-/mnt/backups/postgres}"
BACKUP_RETENTION="${BACKUP_RETENTION:-30}"
S3_BUCKET="${S3_BUCKET:-}"
WEBHOOK_URL="${WEBHOOK_URL:-}"

BACKUP_FILE="edsecure_${TIMESTAMP}.dump.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# ── Helper Functions ──────────────────────────────────────
log() {
    echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] $1"
}

notify_failure() {
    local message="$1"
    log "ERROR: ${message}"

    if [[ -n "${WEBHOOK_URL}" ]]; then
        curl -sf -X POST "${WEBHOOK_URL}" \
            -H 'Content-Type: application/json' \
            -d "{\"text\": \"🔴 **EdSecure Backup Failed**\n${message}\nTime: ${DATE_HUMAN}\"}" \
            || true
    fi
}

# ── Pre-flight Checks ────────────────────────────────────
log "═══════════════════════════════════════════"
log "  EdSecure Hub — Database Backup"
log "  Time: ${DATE_HUMAN}"
log "═══════════════════════════════════════════"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Verify the PostgreSQL container is running
if ! docker inspect "${POSTGRES_CONTAINER}" > /dev/null 2>&1; then
    notify_failure "PostgreSQL container '${POSTGRES_CONTAINER}' not found or not running."
    exit 1
fi

# ── Create Backup ─────────────────────────────────────────
log "▸ Creating backup: ${BACKUP_FILE}"

if ! docker exec "${POSTGRES_CONTAINER}" \
    pg_dump \
        -U "${POSTGRES_USER}" \
        -d "${POSTGRES_DB}" \
        --format=custom \
        --compress=9 \
        --verbose \
    2>/dev/null | gzip > "${BACKUP_PATH}"; then
    notify_failure "pg_dump failed for database '${POSTGRES_DB}'."
    rm -f "${BACKUP_PATH}"
    exit 1
fi

# Verify backup file is not empty
BACKUP_SIZE=$(stat -f%z "${BACKUP_PATH}" 2>/dev/null || stat -c%s "${BACKUP_PATH}" 2>/dev/null || echo "0")
if [[ "${BACKUP_SIZE}" -lt 1024 ]]; then
    notify_failure "Backup file is suspiciously small (${BACKUP_SIZE} bytes). Possible corruption."
    exit 1
fi

log "▸ Backup created: ${BACKUP_PATH} ($(numfmt --to=iec ${BACKUP_SIZE} 2>/dev/null || echo "${BACKUP_SIZE} bytes"))"

# ── Upload to S3 (if configured) ─────────────────────────
if [[ -n "${S3_BUCKET}" ]]; then
    log "▸ Uploading to S3: s3://${S3_BUCKET}/postgres/${BACKUP_FILE}"
    if aws s3 cp "${BACKUP_PATH}" "s3://${S3_BUCKET}/postgres/${BACKUP_FILE}" \
        --storage-class STANDARD_IA \
        --only-show-errors; then
        log "▸ S3 upload complete."
    else
        notify_failure "S3 upload failed for ${BACKUP_FILE}. Local backup retained."
        # Don't exit — local backup still exists
    fi
fi

# ── Cleanup Old Backups ──────────────────────────────────
log "▸ Pruning local backups older than ${BACKUP_RETENTION} days..."
DELETED_COUNT=$(find "${BACKUP_DIR}" -name "edsecure_*.dump.gz" -mtime +${BACKUP_RETENTION} -print -delete | wc -l)
log "▸ Deleted ${DELETED_COUNT} old backup(s)."

# ── Summary ───────────────────────────────────────────────
REMAINING_COUNT=$(find "${BACKUP_DIR}" -name "edsecure_*.dump.gz" | wc -l)
TOTAL_SIZE=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1 || echo "unknown")

log "═══════════════════════════════════════════"
log "  ✅ Backup complete"
log "  File:      ${BACKUP_FILE}"
log "  Size:      $(numfmt --to=iec ${BACKUP_SIZE} 2>/dev/null || echo "${BACKUP_SIZE} bytes")"
log "  Retained:  ${REMAINING_COUNT} backup(s) (${TOTAL_SIZE} total)"
log "  S3:        ${S3_BUCKET:-not configured}"
log "═══════════════════════════════════════════"
