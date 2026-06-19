export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(to top, var(--tertiary-container), var(--surface))',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      marginTop: 'auto',
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 32,
        padding: '40px 80px',
        alignItems: 'center',
      }}>
        <div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '-0.02em',
          }}>DriveLux</span>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, marginTop: 12, maxWidth: 300 }}>
            © 2024 DriveLux. Precision Engineering. Total Exclusivity.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 32px', justifyContent: 'flex-end', alignItems: 'center' }}>
          {['Privacy Policy', 'Terms of Service', 'Contact Us', 'Showrooms', 'Careers'].map(link => (
            <a key={link} href="#"
              style={{ color: 'var(--on-surface-variant)', fontSize: 14, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--on-surface-variant)'}
            >{link}</a>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          footer .container { grid-template-columns: 1fr !important; padding: 32px 20px !important; }
          footer .container div:last-child { justify-content: flex-start !important; }
        }
      `}</style>
    </footer>
  );
}
