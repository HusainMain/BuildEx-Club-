import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Zap, LayoutDashboard, QrCode } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="logo-text">Build<span className="logo-accent">Ex</span></span>
        </Link>

        {/* Nav links */}
        <div className="navbar-links">
          {user && (
            <>
              {!isAdmin && (
                <Link
                  to="/dashboard"
                  className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin/scanner"
                  className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                >
                  <QrCode size={15} />
                  Scanner
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right side */}
        <div className="navbar-right">
          {user ? (
            <div className="navbar-user">
              <div className="user-avatar">
                {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
              <span className="user-name">{profile?.full_name || user.email}</span>
              {isAdmin && <span className="badge badge-primary">Admin</span>}
              <button className="icon-btn" onClick={handleSignOut} title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="nav-link">Sign in</Link>
              <Link to="/signup" className="btn-primary-sm">Get started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
