import { getDb } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// POST /api/vip - Request VIP activation
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  await db.execute(
    'UPDATE web_users SET vip_request = 1, vip_request_at = NOW() WHERE discord_id = ?',
    [session.user.discordId]
  );

  // Notify admin via Discord webhook
  if (process.env.DISCORD_ADMIN_WEBHOOK) {
    await fetch(process.env.DISCORD_ADMIN_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '💎 VIP Request',
          description: `**${session.user.name}** has requested VIP activation.`,
          color: 0xFFD700,
          fields: [
            { name: 'Discord ID', value: session.user.discordId, inline: true },
          ],
          timestamp: new Date().toISOString(),
        }]
      }),
    });
  }

  return Response.json({ success: true });
}
