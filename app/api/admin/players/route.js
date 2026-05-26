import { getDb } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/admin/players - Admin: list all players
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const db = getDb();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';

  const [rows] = await db.execute(
    'SELECT * FROM web_users WHERE username LIKE ? ORDER BY points DESC LIMIT 50',
    [`%${search}%`]
  );

  return Response.json(rows);
}

// PATCH /api/admin/players - Admin: modify player points, VIP, role
export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { discordId, points, vip_status, role_name, vip_request } = await req.json();
  const db = getDb();

  const updates = [];
  const values = [];

  if (points !== undefined) { updates.push('points = ?'); values.push(points); }
  if (vip_status !== undefined) { updates.push('vip_status = ?'); values.push(vip_status); }
  if (role_name !== undefined) { updates.push('role_name = ?'); values.push(role_name); }
  if (vip_request !== undefined) { updates.push('vip_request = ?'); values.push(vip_request); }

  if (updates.length === 0) return Response.json({ error: 'No fields to update' }, { status: 400 });

  values.push(discordId);
  await db.execute(`UPDATE web_users SET ${updates.join(', ')} WHERE discord_id = ?`, values);

  return Response.json({ success: true });
}
