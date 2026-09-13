-- ============================================================
-- NEXUS LEDGER — Seed Data
-- ============================================================
USE nexus_ledger;

-- Demo users (passwords are bcrypt hashed)
-- admin@nexusledger.demo : Admin@123
-- user@nexusledger.demo  : User@123
-- auditor@nexusledger.demo : Audit@123
INSERT INTO users (name, email, password_hash, role, did, avatar, status) VALUES
('Arjun Sharma',  'admin@nexusledger.demo',   '$2y$12$wJQ9Z8pNqKHYgFk7VxUcBuAQrMdLsTeWz5JfP1nCo6RhEbvlGXsOy', 'Super Admin', 'did:nexus:8f73a91c4b2e6d0f1a3c5e7b9d2f4a6c', 'AS', 'active'),
('Priya Nair',    'user@nexusledger.demo',    '$2y$12$mKL3nQpXvRs9ZtWa6HyUeDfBgCjEi4oV8NwTu2lAYkPbcMhFI7JsOz', 'User',        'did:nexus:3c9e1b7a5f2d8e0c4a6b1d3f5e7c9a0b', 'PN', 'active'),
('Rahul Verma',   'auditor@nexusledger.demo', '$2y$12$xEr7sKpMvWdLh5GqTnUcFiBjAzCeO9fY4RwXa1Nk6bVsPl8oH3JtUq', 'Auditor',     'did:nexus:7d2f4b6a8c0e2f4d6b8a0c2e4f6a8b0c', 'RV', 'active'),
('Sneha Kapoor',  'manager@nexusledger.demo', '$2y$12$yFs8tLqNwXeOi6HrUoVdGjCkBaDf5pZ3SwYa7Mb2cRnVlE9uI4KvWr', 'Manager',     'did:nexus:2a4c6e8f0b1d3f5a7c9e1b3d5f7a9c1e', 'SK', 'active'),
('Vikram Singh',  'vikram@nexusledger.demo',  '$2y$12$zGt9uMrOyYfPj7IsVpWeHkDlCbEg6qA4TxZb8Nc3dSoWmF0vJ5LwXs', 'User',        'did:nexus:9b1d3f5a7c9e0b2d4f6a8c0e2f4b6d8a', 'VS', 'inactive');

-- DIDs
INSERT INTO dids (did, owner_id, owner_name, owner_email, method, status, verified, blockchain_tx, block_number, last_verified) VALUES
('did:nexus:8f73a91c4b2e6d0f1a3c5e7b9d2f4a6c', 1, 'Arjun Sharma',  'admin@nexusledger.demo',   'nexus-v1', 'Active', 1, '0x7f3a91c4b2e6d0f1a3c5e7b9d2f4a6c8e1b3d5f', 18924301, '2024-03-10 14:22:00'),
('did:nexus:3c9e1b7a5f2d8e0c4a6b1d3f5e7c9a0b', 2, 'Priya Nair',    'user@nexusledger.demo',    'nexus-v1', 'Active', 1, '0x3c9e1b7a5f2d8e0c4a6b1d3f5e7c9a0b2d4f6a', 18951822, '2024-03-12 11:45:00'),
('did:nexus:7d2f4b6a8c0e2f4d6b8a0c2e4f6a8b0c', 3, 'Rahul Verma',   'auditor@nexusledger.demo', 'nexus-v1', 'Active', 1, '0x7d2f4b6a8c0e2f4d6b8a0c2e4f6a8b0c1e3a5c', 18935410, '2024-03-11 09:30:00'),
('did:nexus:2a4c6e8f0b1d3f5a7c9e1b3d5f7a9c1e', 4, 'Sneha Kapoor',  'manager@nexusledger.demo', 'nexus-v1', 'Active', 0, '0x2a4c6e8f0b1d3f5a7c9e1b3d5f7a9c1e0b2d4f', 18984102, NULL),
('did:nexus:9b1d3f5a7c9e0b2d4f6a8c0e2f4b6d8a', 5, 'Vikram Singh',  'vikram@nexusledger.demo',  'nexus-v1', 'Deactivated', 0, '0x9b1d3f5a7c9e0b2d4f6a8c0e2f4b6d8a1c3e5f', 18801234, NULL);

-- Assets
INSERT INTO assets (asset_id, name, type, owner_name, sha256_hash, token_id, blockchain_tx, block_number, blockchain_status, status) VALUES
('ASSET-001', 'BEL Defense Training Certificate', 'Training Certificate', 'Arjun Sharma', 'a3f8c2d1e4b7f9a2c5d8e1f4b7c0a3d6e9f2b5c8d1e4a7f0b3c6d9e2f5a8b1', 'NFT-BEL-2024-001', '0xa3f8c2d1e4b7f9a2c5d8e1f4b7c0a3d6e9f2b5c8', 18960001, 'Confirmed', 'Active'),
('ASSET-002', 'Equipment License — Radar System', 'Equipment License',    'Priya Nair',   'b6e9c2f5a8d1e4b7c0f3a6d9e2f5b8c1e4a7d0f3b6c9e2f5a8b1d4e7f0a3c6', 'NFT-BEL-2024-002', '0xb6e9c2f5a8d1e4b7c0f3a6d9e2f5b8c1e4a7d0f3', 18961500, 'Confirmed', 'Active'),
('ASSET-003', 'Government Security Clearance',   'Government Record',    'Rahul Verma',  'c9f2b5e8a1d4f7c0b3e6a9d2f5c8b1e4a7d0f3c6b9e2f5a8d1c4e7f0b3a6d9', 'NFT-GOV-2024-003', '0xc9f2b5e8a1d4f7c0b3e6a9d2f5c8b1e4a7d0f3c6', 18963200, 'Confirmed', 'Active');

-- Certificates
INSERT INTO certificates (cert_id, title, holder, issuer, issued_date, expiry_date, sha256_hash, status, risk_score, blockchain_tx) VALUES
('CERT-2024-001', 'Advanced Cybersecurity Training',   'Arjun Sharma',  'Bharat Electronics Limited',  '2024-02-01', '2027-02-01', 'a3f8c2d1e4b7f9a2c5d8e1f4b7c0a3d6e9f2b5c8d1e4a7f0b3c6d9e2f5a8b1', 'Verified',   8,  '0xa3f8c2d1e4b7f9a2c5d8e1f4b7c0a3d6e9f2b5c8'),
('CERT-2024-002', 'ISO 27001 Security Certification',  'Priya Nair',   'Bureau of Indian Standards',   '2024-01-15', '2026-01-15', 'b6e9c2f5a8d1e4b7c0f3a6d9e2f5b8c1e4a7d0f3b6c9e2f5a8b1d4e7f0a3c6', 'Verified',   12, '0xb6e9c2f5a8d1e4b7c0f3a6d9e2f5b8c1e4a7d0f3'),
('CERT-2024-003', 'Suspicious Defense Clearance',      'Unknown Entity','Unverified Authority',         '2024-03-01', '2025-03-01', 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1', 'Suspicious', 74, NULL),
('CERT-2024-004', 'DRDO Equipment Operator License',   'Rahul Verma',  'DRDO Training Academy',         '2023-12-10', '2025-12-10', 'c9f2b5e8a1d4f7c0b3e6a9d2f5c8b1e4a7d0f3c6b9e2f5a8d1c4e7f0b3a6d9', 'Verified',   5,  '0xc9f2b5e8a1d4f7c0b3e6a9d2f5c8b1e4a7d0f3c6'),
('CERT-2024-005', 'Tampered Engineering Certificate',  'Fraud Actor',  'IIT Delhi (FAKE)',              '2024-03-10', '2029-03-10', '0000000000000000000000000000000000000000000000000000000000000000', 'Tampered',   97, NULL);

-- Audit log seed entries
INSERT INTO audit_logs (user_id, user_name, role, action, resource, risk, status, ip) VALUES
(1, 'Arjun Sharma', 'Super Admin', 'LOGIN',          'Auth System',     'Low',      'Success', '192.168.1.105'),
(1, 'Arjun Sharma', 'Super Admin', 'CREATE_DID',     'DID-004',         'Low',      'Success', '192.168.1.105'),
(2, 'Priya Nair',   'User',        'VERIFY_CERT',    'CERT-2024-001',   'Low',      'Success', '10.0.0.42'),
(1, 'Arjun Sharma', 'Super Admin', 'REGISTER_ASSET', 'ASSET-001',       'Low',      'Success', '192.168.1.105'),
(NULL, 'Unknown',   'N/A',         'FAILED_LOGIN',   'Auth System',     'Critical', 'Failed',  '185.220.101.47');
