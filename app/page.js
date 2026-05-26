'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

const NAV_ITEMS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'profile', icon: '👤', label: 'My Profile' },
  { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' },
  { id: 'vip', icon: '💎', label: 'VIP Store' },
  { id: 'tickets', icon: '🎫', label: 'Support Tickets' },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [activePage, setActivePage] = useState('home');
  const [leaderboard, setLeaderboard] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '', category: 'General' });
  const [vipMsg, setVipMsg] = useState('');
  const [players, setPlayers] = useState([]);
  const [editPlayer, setEditPlayer] = useState(null);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/leaderboard').then(r => r.json()).then(setLeaderboard);
    if (session) {
      fetch('/api/tickets').then(r => r.json()).then(setTickets);
      if (session.user.isAdmin) {
        fetch('/api/admin/players').then(r => r.json()).then(setPlayers);
      }
    }
  }, [session]);

  const handleVipRequest = async () => {
    const res = await fetch('/api/vip', { method: 'POST' });
    const data = await res.json();
    setVipMsg(data.success ? '✅ VIP request sent! Admin will review it shortly.' : '❌ Already requested.');
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketForm),
    });
    if (res.ok) {
      setTicketForm({ subject: '', message: '', category: 'General' });
      fetch('/api/tickets').then(r => r.json()).then(setTickets);
    }
  };

  const handleAdminSearch = () => {
    fetch(`/api/admin/players?search=${search}`).then(r => r.json()).then(setPlayers);
  };

  const handleAdminUpdate = async () => {
    if (!editPlayer) return;
    await fetch('/api/admin/players', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editPlayer),
    });
    setEditPlayer(null);
    fetch('/api/admin/players').then(r => r.json()).then(setPlayers);
  };

  const handleTicketReply = async (ticketId, reply, status) => {
    await fetch('/api/tickets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, reply, status }),
    });
    fetch('/api/tickets').then(r => r.json()).then(setTickets);
  };

  const medalColors = ['#FFD700', '#C0C0C0', '#cd7f32'];

  return (
    <>
      <video autoPlay loop muted playsInline className={styles.videoBg}>
        <source src="/bg-item.mp4" type="video/mp4" />
      </video>
      <div className={styles.overlay}></div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.brand}>
            <span>☣️</span>
            <h1>TOXIC PvP</h1>
          </div>

          <nav>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`${styles.navBtn} ${activePage === item.id ? styles.navActive : ''}`}
                onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
            {session?.user?.isAdmin && (
              <button
                className={`${styles.navBtn} ${activePage === 'admin' ? styles.navActive : ''}`}
                onClick={() => { setActivePage('admin'); setSidebarOpen(false); }}
              >
                <span>🛡️</span> Admin Panel
              </button>
            )}
          </nav>

          <div className={styles.sidebarBottom}>
            {session ? (
              <div className={styles.userBox}>
                <img
                  src={`https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.image?.split('/').pop() || 'default'}.png`}
                  onError={e => e.target.src = '/default-avatar.png'}
                  alt="avatar"
                  className={styles.avatar}
                />
                <div>
                  <div className={styles.userName}>{session.user.name}</div>
                  <div className={styles.userRole}>{session.user.isAdmin ? '🛡️ Admin' : `⚡ ${session.user.role || 'Player'}`}</div>
                </div>
                <button className={styles.logoutBtn} onClick={() => signOut()}>⏏</button>
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={() => signIn('discord')}>
                🔐 Login with Discord
              </button>
            )}
          </div>
        </aside>

        {/* Mobile menu toggle */}
        <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

        {/* Main */}
        <main className={styles.main}>

          {/* ── HOME PAGE ── */}
          {activePage === 'home' && (
            <div className={styles.page}>
              <h2 className={styles.pageTitle}>Welcome to <span className={styles.gradient}>Toxic PvP</span></h2>
              <p className={styles.pageSubtitle}>The most intense PvP experience in FiveM. Connect, compete, and dominate.</p>

              <div className={styles.heroCards}>
                <div className={styles.card}>
                  <div className={styles.bigStat} style={{ color: '#00f260' }}>ONLINE</div>
                  <div className={styles.cardLabel}>🟢 Server Status</div>
                  <a href="fivem://connect/YOUR_SERVER_IP" className={`${styles.btn} ${styles.btnGreen}`}>
                    🚀 Play Now
                  </a>
                </div>

                <div className={styles.card}>
                  <div className={styles.bigStat}>#{leaderboard.length > 0 ? leaderboard.length : '--'}</div>
                  <div className={styles.cardLabel}>🏆 Ranked Players</div>
                  <button className={`${styles.btn} ${styles.btnBlue}`} onClick={() => setActivePage('leaderboard')}>
                    View Leaderboard
                  </button>
                </div>

                <div className={styles.card}>
                  <div className={styles.bigStat} style={{ color: '#FFD700' }}>VIP</div>
                  <div className={styles.cardLabel}>💎 Special Perks</div>
                  <button className={`${styles.btn} ${styles.btnGold}`} onClick={() => setActivePage('vip')}>
                    Get VIP
                  </button>
                </div>
              </div>

              {/* Server Info */}
              <div className={styles.card} style={{ marginTop: '30px' }}>
                <h3 className={styles.sectionTitle}>📋 Server Info</h3>
                <div className={styles.infoGrid}>
                  <div><span>IP</span><strong>YOUR_SERVER_IP</strong></div>
                  <div><span>Mode</span><strong>Custom PvP</strong></div>
                  <div><span>Discord</span><strong>discord.gg/rFzbU6TF4R</strong></div>
                  <div><span>Community</span><strong>.gg/toxicfivem</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE PAGE ── */}
          {activePage === 'profile' && (
            <div className={styles.page}>
              <h2 className={styles.pageTitle}>👤 My <span className={styles.gradient}>Profile</span></h2>
              {!session ? (
                <div className={styles.card} style={{ textAlign: 'center' }}>
                  <p style={{ marginBottom: '20px', color: '#aaa' }}>Login with Discord to view your profile.</p>
                  <button className={`${styles.btn} ${styles.btnDiscord}`} onClick={() => signIn('discord')}>
                    Login with Discord
                  </button>
                </div>
              ) : (
                <div className={styles.profileGrid}>
                  <div className={styles.card}>
                    <img
                      src={session.user.image}
                      alt="avatar"
                      className={styles.profileAvatar}
                    />
                    <h3 style={{ fontSize: '1.6rem', margin: '15px 0 5px' }}>{session.user.name}</h3>
                    <div className={styles.badge}>{session.user.isAdmin ? '🛡️ Admin' : `⚡ ${session.user.role || 'Player'}`}</div>
                  </div>

                  <div>
                    <div className={styles.statRow}>
                      <div className={styles.statCard}>
                        <div className={styles.statNum}>{session.user.points ?? 0}</div>
                        <div className={styles.statLabel}>Total Points</div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statNum}>{session.user.vip ? '✅' : '❌'}</div>
                        <div className={styles.statLabel}>VIP Status</div>
                      </div>
                    </div>

                    <div className={styles.card}>
                      <h4 style={{ marginBottom: '10px', color: '#aaa' }}>Discord ID</h4>
                      <code style={{ color: '#00f260' }}>{session.user.discordId}</code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── LEADERBOARD PAGE ── */}
          {activePage === 'leaderboard' && (
            <div className={styles.page}>
              <h2 className={styles.pageTitle}>🏆 <span className={styles.gradient}>Leaderboard</span></h2>
              <div className={styles.card}>
                {leaderboard.map((p, i) => (
                  <div key={p.discord_id} className={styles.leaderRow}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: medalColors[i] || '#fff', minWidth: '50px' }}>
                      #{i + 1}
                    </span>
                    <div className={styles.leaderInfo}>
                      <strong>{p.username}</strong>
                      <span className={styles.badge} style={{ marginLeft: '10px' }}>{p.vip_status ? '💎 VIP' : p.role_name || 'Player'}</span>
                    </div>
                    <div className={styles.leaderPts}>{p.points?.toLocaleString()} PTS</div>
                  </div>
                ))}
                {leaderboard.length === 0 && <p style={{ color: '#777', textAlign: 'center' }}>No players yet.</p>}
              </div>
            </div>
          )}

          {/* ── VIP PAGE ── */}
          {activePage === 'vip' && (
            <div className={styles.page}>
              <h2 className={styles.pageTitle}>💎 <span className={styles.gradient}>VIP Store</span></h2>
              <div className={styles.card} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '5rem', marginBottom: '20px' }}>👑</div>
                <h3 style={{ fontSize: '2rem', marginBottom: '15px' }}>VIP Membership</h3>
                <ul style={{ listStyle: 'none', color: '#ccc', marginBottom: '30px', lineHeight: '2.2' }}>
                  <li>✅ Custom VIP tag in game & Discord</li>
                  <li>✅ Access to exclusive weapons</li>
                  <li>✅ Priority server queue</li>
                  <li>✅ VIP role in Discord server</li>
                  <li>✅ Special kill effects</li>
                </ul>
                {!session ? (
                  <button className={`${styles.btn} ${styles.btnDiscord}`} onClick={() => signIn('discord')}>Login to Request VIP</button>
                ) : (
                  <>
                    <button className={`${styles.btn} ${styles.btnGold}`} onClick={handleVipRequest}>
                      💎 Request VIP Activation
                    </button>
                    {vipMsg && <p style={{ marginTop: '15px', color: '#00f260' }}>{vipMsg}</p>}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── TICKETS PAGE ── */}
          {activePage === 'tickets' && (
            <div className={styles.page}>
              <h2 className={styles.pageTitle}>🎫 Support <span className={styles.gradient}>Tickets</span></h2>

              {!session ? (
                <div className={styles.card} style={{ textAlign: 'center' }}>
                  <p style={{ marginBottom: '20px', color: '#aaa' }}>Login to open or view tickets.</p>
                  <button className={`${styles.btn} ${styles.btnDiscord}`} onClick={() => signIn('discord')}>Login with Discord</button>
                </div>
              ) : (
                <>
                  <div className={styles.card} style={{ marginBottom: '30px' }}>
                    <h3 className={styles.sectionTitle}>Open New Ticket</h3>
                    <form onSubmit={handleTicketSubmit} className={styles.form}>
                      <select
                        className={styles.input}
                        value={ticketForm.category}
                        onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}
                      >
                        <option>General</option>
                        <option>Bug Report</option>
                        <option>Appeal</option>
                        <option>VIP Request</option>
                        <option>Other</option>
                      </select>
                      <input
                        className={styles.input}
                        placeholder="Subject"
                        value={ticketForm.subject}
                        onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        required
                      />
                      <textarea
                        className={styles.textarea}
                        placeholder="Describe your issue..."
                        value={ticketForm.message}
                        onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                        required
                      />
                      <button type="submit" className={`${styles.btn} ${styles.btnGreen}`}>Submit Ticket</button>
                    </form>
                  </div>

                  <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>My Tickets</h3>
                    {tickets.map(t => (
                      <div key={t.id} className={styles.ticketRow}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <strong>{t.subject}</strong>
                          <span className={`${styles.badge} ${t.status === 'Open' ? styles.badgeGreen : styles.badgeGray}`}>{t.status}</span>
                        </div>
                        <p style={{ color: '#aaa', fontSize: '0.95rem' }}>{t.message}</p>
                        {t.admin_reply && (
                          <div className={styles.adminReply}>
                            <strong>🛡️ Admin Reply:</strong> {t.admin_reply}
                          </div>
                        )}
                        <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '8px' }}>{new Date(t.created_at).toLocaleDateString()}</div>

                        {/* Admin ticket reply UI */}
                        {session.user.isAdmin && (
                          <div className={styles.adminTicketControls}>
                            <input className={styles.input} placeholder="Reply..." id={`reply-${t.id}`} />
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                className={`${styles.btn} ${styles.btnGreen}`}
                                style={{ flex: 1 }}
                                onClick={() => handleTicketReply(t.id, document.getElementById(`reply-${t.id}`).value, 'Answered')}
                              >Reply</button>
                              <button
                                className={`${styles.btn} ${styles.btnGray}`}
                                style={{ flex: 1 }}
                                onClick={() => handleTicketReply(t.id, '', 'Closed')}
                              >Close</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {tickets.length === 0 && <p style={{ color: '#777' }}>No tickets yet.</p>}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── ADMIN PANEL PAGE ── */}
          {activePage === 'admin' && session?.user?.isAdmin && (
            <div className={styles.page}>
              <h2 className={styles.pageTitle}>🛡️ Admin <span className={styles.gradient}>Panel</span></h2>

              <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Player Management</h3>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <input
                    className={styles.input}
                    placeholder="Search player by username..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button className={`${styles.btn} ${styles.btnGreen}`} onClick={handleAdminSearch}>Search</button>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Discord ID</th>
                        <th>Points</th>
                        <th>VIP</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map(p => (
                        <tr key={p.discord_id}>
                          <td>{p.username}</td>
                          <td><code style={{ color: '#aaa', fontSize: '0.8rem' }}>{p.discord_id}</code></td>
                          <td><strong style={{ color: '#00f260' }}>{p.points}</strong></td>
                          <td>{p.vip_status ? '✅' : '❌'}</td>
                          <td>{p.role_name || 'Player'}</td>
                          <td>
                            <button
                              className={`${styles.btn} ${styles.btnBlue}`}
                              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                              onClick={() => setEditPlayer(p)}
                            >Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit Player Modal */}
              {editPlayer && (
                <div className={styles.modal}>
                  <div className={styles.modalContent}>
                    <h3 style={{ marginBottom: '20px' }}>Edit Player: <span className={styles.gradient}>{editPlayer.username}</span></h3>
                    <div className={styles.form}>
                      <label style={{ color: '#aaa' }}>Points</label>
                      <input
                        className={styles.input}
                        type="number"
                        value={editPlayer.points}
                        onChange={e => setEditPlayer({ ...editPlayer, points: parseInt(e.target.value) })}
                      />
                      <label style={{ color: '#aaa' }}>Role</label>
                      <select
                        className={styles.input}
                        value={editPlayer.role_name || 'Player'}
                        onChange={e => setEditPlayer({ ...editPlayer, role_name: e.target.value })}
                      >
                        <option>Player</option>
                        <option>VIP</option>
                        <option>Moderator</option>
                        <option>Admin</option>
                        <option>Owner</option>
                      </select>
                      <label style={{ color: '#aaa' }}>VIP Status</label>
                      <select
                        className={styles.input}
                        value={editPlayer.vip_status ? '1' : '0'}
                        onChange={e => setEditPlayer({ ...editPlayer, vip_status: e.target.value === '1' })}
                      >
                        <option value="0">No VIP</option>
                        <option value="1">Active VIP</option>
                      </select>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <button className={`${styles.btn} ${styles.btnGreen}`} style={{ flex: 1 }} onClick={handleAdminUpdate}>Save Changes</button>
                        <button className={`${styles.btn} ${styles.btnGray}`} style={{ flex: 1 }} onClick={() => setEditPlayer(null)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  );
}
