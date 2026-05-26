import mysql from 'mysql2/promise';

let pool = null;

export function getDb() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'wing24.panel.godlike.host',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'u736828_jpEzjbVW78',
      password: process.env.DB_PASSWORD || 'UMpb^kxlJt4qcS+WCT8!ilUf',
      database: process.env.DB_NAME || 's736828_sls',
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}
