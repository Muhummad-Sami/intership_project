import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { bookings } = useBooking();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Explore' },
    { to: '/cars', label: 'Fleet' },
    { to: '/booking', label: 'Booking' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 73 }}>
          <Link to="/" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--primary)',
            letterSpacing: '-0.02em',
            cursor: 'pointer',
          }}>
            DriveLux
          </Link>

          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }} className="desktop-nav">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="label-caps"
                style={{
                  color: isActive(link.to) ? 'var(--gold)' : 'var(--on-surface-variant)',
                  borderBottom: isActive(link.to) ? '2px solid var(--gold)' : '2px solid transparent',
                  paddingBottom: 4,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!isActive(link.to)) e.target.style.color = 'var(--primary)'; }}
                onMouseLeave={e => { if (!isActive(link.to)) e.target.style.color = 'var(--on-surface-variant)'; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/booking" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>luggage</span>
              {bookings.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -6,
                  right: -8,
                  background: 'var(--gold)',
                  color: '#000',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}>{bookings.length}</span>
              )}
            </Link>

            {user ? (
              <button
                className="btn-secondary"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-secondary">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="label-caps"
              onClick={() => setMenuOpen(false)}
              style={{
                color: isActive(link.to) ? 'var(--gold)' : 'var(--on-surface-variant)',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'block',
              }}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              className="label-caps"
              onClick={() => {
                logout();
                navigate('/');
                setMenuOpen(false);
              }}
              style={{ color: 'var(--on-surface-variant)', padding: '14px 0', display: 'block', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="label-caps" onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--on-surface-variant)', padding: '14px 0', display: 'block' }}>
              Login
            </Link>
          )}
          <Link to="/admin" className="label-caps" onClick={() => setMenuOpen(false)}
            style={{ color: 'var(--outline)', padding: '14px 0', display: 'block' }}>
            Admin Panel
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}