import React from 'react';

export default function Home() {
  return (
    <>
      <video autoPlay loop muted playsInline className="video-background">
        <source src="/bg-item.mp4" type="video/mp4" />
      </video>
      <div className="bg-overlay"></div>

      <div className="dashboard">
        <aside className="sidebar">
          <div className="brand">
            <h1>TOXIC</h1>
          </div>
          <ul className="nav-menu">
            <li className="nav-item active">
              <span>🏠</span> Dashboard
            </li>
            <li className="nav-item">
              <span>🏆</span> Leaderboard
            </li>
            <li className="nav-item">
              <span>💎</span> VIP Store
            </li>
            <li className="nav-item">
              <span>🎫</span> Support Tickets
            </li>
            <li className="nav-item" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <span>⚙️</span> Admin Panel
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <header className="header animate-1">
            <div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Welcome to the Arena</h2>
              <p style={{ color: '#aaa', fontSize: '1.1rem', marginTop: '5px' }}>The ultimate PvP Hub. Connect your Discord to track points.</p>
            </div>
            <div className="user-profile">
              <div className="avatar">Discord</div>
              <span style={{ fontWeight: 800, paddingRight: '10px' }}>Login</span>
            </div>
          </header>

          <div className="grid-container">
            {/* Stat 1 */}
            <div className="glass-panel animate-2">
              <h3 className="panel-title">Live Players</h3>
              <div className="stat-huge text-gradient">128</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <div style={{ width: '10px', height: '10px', background: '#00f260', borderRadius: '50%', boxShadow: '0 0 10px #00f260' }}></div>
                <span style={{ color: '#ccc', fontWeight: 600 }}>Server Online</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="glass-panel animate-3">
              <h3 className="panel-title">Your Profile</h3>
              <div className="stat-huge" style={{ color: '#fff' }}>0 <span style={{fontSize: '1.2rem', color: '#777'}}>PTS</span></div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 15px', borderRadius: '8px', display: 'inline-block', marginTop: '10px' }}>
                <span style={{ color: '#FFD700', fontWeight: 800 }}>Role: Unranked</span>
              </div>
            </div>

            {/* Actions */}
            <div className="glass-panel animate-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
              <a href="fivem://connect/YOUR_SERVER_IP" style={{textDecoration: 'none'}}>
                <button className="btn-glow">🚀 Play Now</button>
              </a>
              <a href="https://discord.gg/rFzbU6TF4R" target="_blank" rel="noreferrer" style={{textDecoration: 'none'}}>
                <button className="btn-glow btn-discord">🎮 Join Discord</button>
              </a>
            </div>

            {/* Feature preview */}
            <div className="glass-panel animate-4" style={{ gridColumn: 'span 2' }}>
              <h3 className="panel-title">🏆 Top Warriors (Live)</h3>
              
              <div className="leaderboard-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFD700' }}>#1</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Toxic Efe</span>
                </div>
                <span className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: 900 }}>9,500</span>
              </div>

              <div className="leaderboard-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#C0C0C0' }}>#2</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Ghost_Player</span>
                </div>
                <span className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: 900 }}>8,200</span>
              </div>

              <div className="leaderboard-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#cd7f32' }}>#3</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>Sniper_Elite</span>
                </div>
                <span className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: 900 }}>7,450</span>
              </div>
            </div>

            <div className="glass-panel animate-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 className="panel-title">💎 VIP Status</h3>
                <p style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  Elevate your gameplay. Get exclusive custom weapons, special tags in chat, and a custom Discord role automatically.
                </p>
              </div>
              <button className="btn-glow btn-vip">Request VIP</button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
