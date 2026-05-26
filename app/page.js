import React from 'react';

export default function Home() {
  return (
    <>
      <video autoPlay loop muted playsInline className="video-background">
        <source src="/bg-item.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="container">
        <div className="glass-card">
          <h1 className="title">Toxic PvP</h1>
          <p className="subtitle">Welcome to the ultimate custom PvP experience.</p>
          
          <div className="stats">
            <div className="stat-box">
              <div className="stat-value">Online</div>
              <div className="stat-label">Server Status</div>
            </div>
            <div className="stat-box">
              <div className="stat-value" id="player-count">--</div>
              <div className="stat-label">Players</div>
            </div>
          </div>

          <div className="buttons">
            <a href="fivem://connect/YOUR_SERVER_IP" className="btn btn-primary">
              Play Now
            </a>
            <a href="https://discord.gg/rFzbU6TF4R" target="_blank" rel="noreferrer" className="btn btn-discord">
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
