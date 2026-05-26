-- Run these SQL commands on your Godlike MySQL database
-- to create the required tables for the web dashboard

-- Table: web_users (stores player data synced between FiveM & website)
CREATE TABLE IF NOT EXISTS web_users (
    discord_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) DEFAULT '',
    avatar VARCHAR(255) DEFAULT '',
    identifier VARCHAR(100) DEFAULT NULL,   -- FiveM license identifier
    points INT DEFAULT 0,
    role_name VARCHAR(50) DEFAULT 'Player',
    vip_status BOOLEAN DEFAULT false,
    vip_request BOOLEAN DEFAULT false,
    vip_request_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW() ON UPDATE NOW()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: web_tickets (support tickets)
CREATE TABLE IF NOT EXISTS web_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(50) NOT NULL,
    username VARCHAR(100) DEFAULT '',
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    status ENUM('Open','Answered','Closed') DEFAULT 'Open',
    admin_reply TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (discord_id) REFERENCES web_users(discord_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_tickets_discord ON web_tickets(discord_id);
CREATE INDEX IF NOT EXISTS idx_users_points ON web_users(points DESC);
