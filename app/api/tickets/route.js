import { getDb } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/tickets - fetch tickets for logged-in user (or all for admin)
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  let rows;

  if (session.user.isAdmin) {
    [rows] = await db.execute(
      'SELECT * FROM web_tickets ORDER BY created_at DESC'
    );
  } else {
    [rows] = await db.execute(
      'SELECT * FROM web_tickets WHERE discord_id = ? ORDER BY created_at DESC',
      [session.user.discordId]
    );
  }

  return Response.json(rows);
}

// POST /api/tickets - open a new ticket
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { subject, message, category } = await req.json();
  const db = getDb();

  await db.execute(
    'INSERT INTO web_tickets (discord_id, username, subject, message, category, status) VALUES (?, ?, ?, ?, ?, ?)',
    [session.user.discordId, session.user.name, subject, message, category || 'General', 'Open']
  );

  // Send Discord webhook notification to admin channel
  if (process.env.DISCORD_ADMIN_WEBHOOK) {
    await fetch(process.env.DISCORD_ADMIN_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: `🎫 New Ticket: ${subject}`,
          description: message,
          color: 0x00f260,
          fields: [
            { name: 'Player', value: session.user.name, inline: true },
            { name: 'Category', value: category, inline: true },
          ],
          timestamp: new Date().toISOString(),
        }]
      }),
    });
  }

  return Response.json({ success: true });
}

// PATCH /api/tickets - Admin: reply/close ticket
export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { ticketId, status, reply } = await req.json();
  const db = getDb();

  await db.execute(
    'UPDATE web_tickets SET status = ?, admin_reply = ?, updated_at = NOW() WHERE id = ?',
    [status, reply, ticketId]
  );

  return Response.json({ success: true });
}
