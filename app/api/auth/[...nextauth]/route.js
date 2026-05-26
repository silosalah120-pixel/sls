import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { getDb } from '../../../../lib/db';

const ADMIN_DISCORD_IDS = (process.env.ADMIN_DISCORD_IDS || '').split(',').map(id => id.trim());

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const db = getDb();
      const discordId = profile.id;

      // Upsert user in web_users table
      await db.execute(`
        INSERT INTO web_users (discord_id, username, avatar)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE username = VALUES(username), avatar = VALUES(avatar)
      `, [discordId, profile.username, profile.avatar]);

      return true;
    },

    async session({ session, token }) {
      if (token?.discordId) {
        session.user.discordId = token.discordId;
        session.user.isAdmin = ADMIN_DISCORD_IDS.includes(token.discordId);

        // Fetch player data from DB
        const db = getDb();
        const [rows] = await db.execute(
          'SELECT * FROM web_users WHERE discord_id = ?',
          [token.discordId]
        );
        if (rows.length > 0) {
          session.user.points = rows[0].points;
          session.user.vip = rows[0].vip_status;
          session.user.role = rows[0].role_name || 'Player';
        }
      }
      return session;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = profile.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET || 'toxic-pvp-super-secret-key-2024-fivem',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
