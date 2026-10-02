-- ====================================================================
-- EdSecure Hub - Production-Grade Seed Data
-- ====================================================================

-- 1. Users (Passwords: 'CyberSecure@2026')
-- Bcrypt hash for 'CyberSecure@2026': $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR5eKkG93eYd1X3p2N8Y3z1I1Wc5i (or runtime verified)
INSERT INTO users (id, email, password_hash, full_name, phone, role, badge_number, department, is_active)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@edsecure.gov', '$2a$10$89v8/tI51cM0W2y1bN.jK.R4L1q5A8O7F5G4E3D2C1B0A9Z8Y7X6W', 'Special Director Sarah Vance', '+1 (555) 019-2831', 'ADMIN', 'DIR-901', 'Cybercrime Directorate Command', true),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'officer@cybercell.gov', '$2a$10$89v8/tI51cM0W2y1bN.jK.R4L1q5A8O7F5G4E3D2C1B0A9Z8Y7X6W', 'Inspector Marcus Thorne', '+1 (555) 019-7462', 'AUTHORITY', 'CC-4092', 'Financial Cyber Fraud Division', true),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'analyst@cybercell.gov', '$2a$10$89v8/tI51cM0W2y1bN.jK.R4L1q5A8O7F5G4E3D2C1B0A9Z8Y7X6W', 'Detective Elena Rostova', '+1 (555) 019-9941', 'AUTHORITY', 'CC-5120', 'Identity Theft & Forensics Unit', true),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'victim@example.com', '$2a$10$89v8/tI51cM0W2y1bN.jK.R4L1q5A8O7F5G4E3D2C1B0A9Z8Y7X6W', 'David Miller', '+1 (555) 234-5678', 'USER', NULL, NULL, true),
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'citizen@example.com', '$2a$10$89v8/tI51cM0W2y1bN.jK.R4L1q5A8O7F5G4E3D2C1B0A9Z8Y7X6W', 'Alicia Chen', '+1 (555) 876-5432', 'USER', NULL, NULL, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Cyber Stations (Location Radar)
INSERT INTO cyber_stations (id, station_name, jurisdiction, state, address, helpline, officer_in_charge, latitude, longitude, is_24_7)
VALUES
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Metropolitan Cyber Crime Police Station', 'Central Metropolitan Zone', 'NY', '450 Federal Security Plaza, Suite 400', '1930 / (212) 555-0199', 'ACP Robert Sterling', 40.7128, -74.0060, true),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'Silicon Valley Cyber Investigation Cell', 'Bay Cyber Precinct', 'CA', '890 Technology Boulevard, Building C', '(408) 555-0188', 'Superintendent Anita Patel', 37.7749, -122.4194, true),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Midwest Regional Financial Crimes Cyber Unit', 'Great Lakes Corridor', 'IL', '120 S LaSalle Street, 9th Floor', '(312) 555-0144', 'Captain James O''Connor', 41.8781, -87.6298, true),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Southern Cyber Threat Operations Center', 'Lone Star Zone', 'TX', '101 Congress Avenue, Tower 2', '(512) 555-0177', 'Major Carlos Mendez', 30.2672, -97.7431, true),
    ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'Capital Federal Cybercrime Directorate', 'District Zone', 'DC', '935 Pennsylvania Avenue NW', '1930 / (202) 555-0100', 'Director Sarah Vance', 38.8951, -77.0364, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Initial Sample Complaints
INSERT INTO complaints (
    id, reference_id, user_id, tracking_pin_hash,
    incident_type, incident_date, platform_service, description,
    financial_loss, currency, suspect_contact, suspect_identifier,
    victim_name, victim_email, victim_phone, victim_state, victim_city, is_anonymous,
    status, priority, assigned_to, assigned_at
) VALUES
(
    '01eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'ED-2026-84920', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '$2a$10$xyz...',
    'Financial Fraud', '2026-09-28 14:30:00Z', 'Telegram / Fake Investment App',
    'Victim was lured into a fraudulent high-yield cryptocurrency scheme via a fake trading telegram group. Transferred $4,500 across two transactions before withdrawal capability was locked.',
    4500.00, 'USD', '+1 (800) 555-FAKE', '@GlobalTrustTradingBot',
    'David Miller', 'victim@example.com', '+1 (555) 234-5678', 'NY', 'New York', false,
    'INVESTIGATION', 'HIGH', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2026-09-29 09:15:00Z'
),
(
    '01eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'ED-2026-31092', 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '$2a$10$xyz...',
    'Identity Theft', '2026-09-30 11:00:00Z', 'Cellular Carrier / SIM Swap',
    'Unauthorized SIM swap occurred on primary mobile number, allowing attacker to bypass SMS 2FA on email and initiate unauthorized account recovery attempts.',
    0.00, 'USD', '+1 (555) 018-9999', 'SIM Port Request Ref #99281',
    'Alicia Chen', 'citizen@example.com', '+1 (555) 876-5432', 'CA', 'San Francisco', false,
    'UNDER_REVIEW', 'CRITICAL', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', '2026-09-30 13:00:00Z'
),
(
    '01eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'ED-2026-11847', NULL, '$2a$10$xyz...',
    'Phishing', '2026-10-01 08:45:00Z', 'SMS Banking Impersonation',
    'Received deceptive SMS claiming bank debit card was restricted. Link redirected to spoofed banking portal requesting full card number, CVV, and OTP.',
    280.00, 'USD', '+1 (917) 555-0321', 'https://secure-chase-update-auth.com',
    'Anonymous Citizen', 'secure-report@citizen.org', '+1 (555) 000-0000', 'IL', 'Chicago', true,
    'SUBMITTED', 'MEDIUM', NULL, NULL
)
ON CONFLICT (id) DO NOTHING;

-- 4. Knowledge Posts
INSERT INTO blog_posts (id, slug, title, summary, content, category, author_name, author_role, reading_time_minutes, tags, is_featured)
VALUES
(
    '10eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    'anatomy-of-sim-swap-fraud-prevention',
    'The Anatomy of a SIM Swap: How Attackers Hijack Your Number & How to Defend',
    'Understand how cybercriminals bypass two-factor authentication via telecom carrier manipulation and step-by-step measures to freeze account takeovers.',
    'A SIM swap attack occurs when an adversary convinces your cellular carrier to port your phone number to a SIM card under their control...',
    'Account Security',
    'Detective Elena Rostova',
    'Senior Forensics Investigator',
    7,
    ARRAY['SIM Swap', '2FA', 'Account Takeover', 'Telecom Security'],
    true
),
(
    '10eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    'instant-payment-upi-fraud-playbook',
    'Instant Payment & UPI Scams: Recognizing the "Reverse Payment" Trap',
    'Scammers exploit common psychological blind spots by requesting money under the guise of refunds or prizes. Learn the red flags before you authorize.',
    'Modern digital payment platforms have revolutionized transactions, but fraudsters continuously exploit user misunderstanding...',
    'Financial Safety',
    'Inspector Marcus Thorne',
    'Financial Cyber Fraud Division',
    5,
    ARRAY['UPI Fraud', 'Payment Scams', 'Digital Banking', 'Social Engineering'],
    true
),
(
    '10eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    'documenting-evidence-for-cyber-cells',
    'The Citizen''s Guide to Documenting Admissible Evidence in Cybercrimes',
    'What screenshots, transaction headers, and log files are required by law enforcement to freeze stolen funds and track perpetrators.',
    'When reporting cybercrime, the first 24 hours are critical. Preserving authentic digital artifacts directly impacts case outcomes...',
    'Cyber Awareness',
    'Sarah Vance',
    'Director of Cyber Operations',
    6,
    ARRAY['Evidence Preservation', 'Legal Admissibility', 'Incident Reporting', 'Cyber Cell'],
    false
)
ON CONFLICT (id) DO NOTHING;
