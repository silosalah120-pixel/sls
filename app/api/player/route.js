import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/player - Fetch logged-in player's data
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const [rows] = await db.execute(
    'SELECT * FROM web_users WHERE discord_id = ?',
    [session.user.discordId]
  );

  if (rows.length === 0) return Response.json({ error: 'Player not found' }, { status: 404 });
  return Response.json(rows[0]);
}
