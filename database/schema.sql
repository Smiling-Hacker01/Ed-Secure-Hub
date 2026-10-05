-- ====================================================================
-- EdSecure Hub - Production-Grade PostgreSQL Database Schema
-- Multi-tier Cybersecurity and Cybercrime Response Platform
-- ====================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'AUTHORITY', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE complaint_status AS ENUM (
        'SUBMITTED',
        'UNDER_REVIEW',
        'ASSIGNED',
        'INVESTIGATION',
        'ACTION_TAKEN',
        'RESOLVED',
        'REJECTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE incident_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE note_visibility AS ENUM ('INTERNAL', 'AUTHORITY_ONLY', 'PUBLIC_UPDATE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    role user_role NOT NULL DEFAULT 'USER',
    badge_number VARCHAR(50),
    department VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    mfa_secret VARCHAR(100),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id VARCHAR(32) UNIQUE NOT NULL, -- Format: ED-YYYY-XXXXX
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tracking_pin_hash VARCHAR(255) NOT NULL,
    
    -- Incident Details
    incident_type VARCHAR(80) NOT NULL,
    incident_date TIMESTAMPTZ NOT NULL,
    platform_service VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    financial_loss NUMERIC(14, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    suspect_contact VARCHAR(255),
    suspect_identifier VARCHAR(255),
    
    -- Complainant / Victim Profile
    victim_name VARCHAR(150) NOT NULL,
    victim_email VARCHAR(255) NOT NULL,
    victim_phone VARCHAR(30) NOT NULL,
    victim_state VARCHAR(100),
    victim_city VARCHAR(100),
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    
    -- Management
    status complaint_status NOT NULL DEFAULT 'SUBMITTED',
    priority incident_priority NOT NULL DEFAULT 'MEDIUM',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ,
    resolution_summary TEXT,
    closed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_complaints_reference_id ON complaints(reference_id);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned_to ON complaints(assigned_to);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);

ALTER TABLE complaints ADD COLUMN IF NOT EXISTS assigned_officer_name VARCHAR(150);

-- 3. Evidence Table
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes VARCHAR(255),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evidence_complaint_id ON evidence(complaint_id);

ALTER TABLE evidence ADD COLUMN IF NOT EXISTS signed_url TEXT;
ALTER TABLE evidence ADD COLUMN IF NOT EXISTS file_data BYTEA;

-- 4. Status History (Immutable Timeline)
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    previous_status complaint_status,
    new_status complaint_status NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    change_reason TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_status_history_complaint_id ON complaint_status_history(complaint_id);
CREATE INDEX IF NOT EXISTS idx_status_history_created_at ON complaint_status_history(created_at ASC);

ALTER TABLE complaint_status_history ADD COLUMN IF NOT EXISTS changed_by_name VARCHAR(150);

-- 5. Internal Officer Notes
CREATE TABLE IF NOT EXISTS internal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    note TEXT NOT NULL,
    visibility note_visibility NOT NULL DEFAULT 'INTERNAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_internal_notes_complaint_id ON internal_notes(complaint_id);

ALTER TABLE internal_notes ADD COLUMN IF NOT EXISTS author_name VARCHAR(150);
ALTER TABLE internal_notes ADD COLUMN IF NOT EXISTS author_badge VARCHAR(50);

-- 6. Audit Events (Tamper-evident system log)
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role user_role,
    action VARCHAR(100) NOT NULL,
    old_state JSONB,
    new_state JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON audit_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events(created_at DESC);

ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS actor_name VARCHAR(150);

-- 7. Knowledge Hub / Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(60) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(100) NOT NULL,
    reading_time_minutes INT NOT NULL DEFAULT 5,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    view_count INT NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- 9. Cyber Cell Stations (Location Radar)
CREATE TABLE IF NOT EXISTS cyber_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_name VARCHAR(150) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    helpline VARCHAR(50) NOT NULL,
    officer_in_charge VARCHAR(100),
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    is_24_7 BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_complaints_updated_at
BEFORE UPDATE ON complaints
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
