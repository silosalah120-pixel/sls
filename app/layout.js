import './globals.css';

export const metadata = {
  title: 'Toxic PvP - Web Dashboard',
  description: 'Official Dashboard for Toxic PvP FiveM Server',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
