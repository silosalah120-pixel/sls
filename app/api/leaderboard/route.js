import { getDb } from '@/lib/db';

// GET /api/leaderboard - Public leaderboard
export async function GET() {
  const db = getDb();
  const [rows] = await db.execute(
    'SELECT discord_id, username, avatar, points, role_name, vip_status FROM web_users ORDER BY points DESC LIMIT 10'
  );
  return Response.json(rows);
}
