-- ============================================================
-- NEXUS LEDGER — MySQL Database Schema
-- PS 26125 — Bharat Electronics Limited — SIH 2024
-- ============================================================

CREATE DATABASE IF NOT EXISTS nexus_ledger CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nexus_ledger;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(150) NOT NULL,
    email         VARCHAR(200) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('Super Admin','Admin','Manager','Auditor','User') NOT NULL DEFAULT 'User',
    did           VARCHAR(100) UNIQUE,
    avatar        VARCHAR(5),
    status        ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role  (role)
);

-- Decentralized Identifiers
CREATE TABLE IF NOT EXISTS dids (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    did            VARCHAR(100) NOT NULL UNIQUE,
    owner_id       INT,
    owner_name     VARCHAR(150) NOT NULL,
    owner_email    VARCHAR(200),
    method         VARCHAR(50) NOT NULL DEFAULT 'nexus-v1',
    key_type       VARCHAR(80) NOT NULL DEFAULT 'Ed25519VerificationKey2020',
    public_key     TEXT,
    status         ENUM('Active','Deactivated','Revoked') NOT NULL DEFAULT 'Active',
    verified       TINYINT(1) NOT NULL DEFAULT 0,
    blockchain_tx  VARCHAR(100),
    block_number   BIGINT,
    last_verified  DATETIME,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_did    (did),
    INDEX idx_owner  (owner_id),
    INDEX idx_status (status)
);

-- Devices
CREATE TABLE IF NOT EXISTS devices (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    device_id    VARCHAR(50) NOT NULL UNIQUE,
    user_id      INT,
    name         VARCHAR(150),
    browser      VARCHAR(100),
    os           VARCHAR(100),
    ip           VARCHAR(50),
    location     VARCHAR(150),
    fingerprint  VARCHAR(100),
    trust_score  INT NOT NULL DEFAULT 50,
    risk         ENUM('Low','Medium','High','Critical') NOT NULL DEFAULT 'Low',
    status       ENUM('Known','New','Suspicious','Revoked') NOT NULL DEFAULT 'New',
    first_seen   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user   (user_id),
    INDEX idx_status (status)
);

-- Digital Assets
CREATE TABLE IF NOT EXISTS assets (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    asset_id           VARCHAR(50) NOT NULL UNIQUE,
    name               VARCHAR(200) NOT NULL,
    type               VARCHAR(100) NOT NULL,
    owner_name         VARCHAR(150),
    owner_did          VARCHAR(100),
    sha256_hash        VARCHAR(64) NOT NULL,
    token_id           VARCHAR(100),
    blockchain_tx      VARCHAR(100),
    block_number       BIGINT,
    blockchain_status  ENUM('Pending','Confirmed','Failed') NOT NULL DEFAULT 'Pending',
    status             ENUM('Active','Revoked','Transferred') NOT NULL DEFAULT 'Active',
    metadata           JSON,
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_asset_id (asset_id),
    INDEX idx_owner    (owner_name),
    INDEX idx_status   (status)
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    cert_id        VARCHAR(50) NOT NULL UNIQUE,
    title          VARCHAR(200) NOT NULL,
    holder         VARCHAR(150) NOT NULL,
    issuer         VARCHAR(200) NOT NULL,
    issued_date    DATE,
    expiry_date    DATE,
    sha256_hash    VARCHAR(64) NOT NULL,
    status         ENUM('Verified','Suspicious','Tampered','Unverified') NOT NULL DEFAULT 'Unverified',
    risk_score     INT NOT NULL DEFAULT 0,
    blockchain_tx  VARCHAR(100),
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cert_id (cert_id),
    INDEX idx_status  (status)
);

-- Security Events
CREATE TABLE IF NOT EXISTS security_events (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    event_id    VARCHAR(50) NOT NULL UNIQUE,
    type        VARCHAR(100) NOT NULL,
    user_id     INT,
    user_name   VARCHAR(150),
    ip          VARCHAR(50),
    severity    ENUM('Info','Low','Medium','High','Critical') NOT NULL DEFAULT 'Info',
    details     TEXT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_severity  (severity),
    INDEX idx_created   (created_at)
);

-- Anomalies
CREATE TABLE IF NOT EXISTS anomalies (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    anomaly_id  VARCHAR(50) NOT NULL UNIQUE,
    type        VARCHAR(100) NOT NULL,
    user_name   VARCHAR(150),
    device_id   VARCHAR(50),
    rule        VARCHAR(100),
    score       INT NOT NULL DEFAULT 0,
    risk_level  ENUM('Low','Medium','High','Critical') NOT NULL DEFAULT 'Low',
    details     TEXT,
    resolved    TINYINT(1) NOT NULL DEFAULT 0,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_resolved  (resolved),
    INDEX idx_risk      (risk_level)
);

-- Blockchain Transactions
CREATE TABLE IF NOT EXISTS blockchain_transactions (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    tx_hash     VARCHAR(100) NOT NULL UNIQUE,
    block_num   BIGINT,
    from_addr   VARCHAR(100),
    to_addr     VARCHAR(100),
    action      VARCHAR(50) NOT NULL,
    gas_used    INT,
    status      ENUM('Pending','Confirmed','Failed') NOT NULL DEFAULT 'Pending',
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hash   (tx_hash),
    INDEX idx_action (action),
    INDEX idx_status (status)
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT,
    user_name  VARCHAR(150),
    role       VARCHAR(50),
    action     VARCHAR(100) NOT NULL,
    resource   VARCHAR(200),
    tx_hash    VARCHAR(100),
    risk       ENUM('Low','Medium','High','Critical') NOT NULL DEFAULT 'Low',
    status     ENUM('Success','Failed','Alert') NOT NULL DEFAULT 'Success',
    ip         VARCHAR(50),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user    (user_id),
    INDEX idx_action  (action),
    INDEX idx_risk    (risk),
    INDEX idx_created (created_at)
);
