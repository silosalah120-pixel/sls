import { verifyKey } from 'discord-interactions';

export const runtime = 'edge'; // Optional: Use Edge runtime for better performance on Vercel

export async function POST(request) {
  try {
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const rawBody = await request.text();

    const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY; 

    if (!PUBLIC_KEY) {
      return new Response('Server configuration error: Missing PUBLIC_KEY', { status: 500 });
    }

    const isValidRequest = verifyKey(rawBody, signature, timestamp, PUBLIC_KEY);
    if (!isValidRequest) {
      return new Response('Bad request signature', { status: 401 });
    }

    const interaction = JSON.parse(rawBody);

    // 1: PING
    if (interaction.type === 1) {
      return Response.json({ type: 1 });
    }

    // 2: APPLICATION_COMMAND
    if (interaction.type === 2) {
      const commandName = interaction.data.name;

      if (commandName === 'points') {
        // TODO: Fetch points from database
        return Response.json({
          type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
          data: {
            content: '🌟 Your current points: **0**',
          },
        });
      }

      if (commandName === 'vip') {
        return Response.json({
          type: 4,
          data: {
            content: '💎 You have requested VIP activation. An admin will review it.',
          },
        });
      }
    }

    return new Response('Unknown interaction', { status: 400 });
  } catch (error) {
    console.error('Interaction Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
