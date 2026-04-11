import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Zap, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import './Auth.css';

export function LoginPage() {
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await signInWithEmail(form.email, form.password);
    setLoading(false);
    if (error) { setError(error.message); return; }
    // Role-based redirect happens in App router
    navigate('/dashboard');
  }

  return (
    <div className="page auth-page">
      <div className="bg-mesh" />
      <div className="auth-container">
        <div className="auth-logo">
          <div className="logo-icon"><Zap size={18} fill="currentColor" /></div>
          <span className="logo-text">Build<span className="logo-accent">Ex</span></span>
        </div>

        <GlassCard className="auth-card animate-fadeInUp">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your Build Ex account</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email address</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <PrimaryButton type="submit" loading={loading} fullWidth size="md" icon={<ArrowRight size={16} />}>
              Sign In
            </PrimaryButton>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    const { error } = await signUpWithEmail(form.email, form.password, form.fullName);
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess(true);
  }

  if (success) return (
    <div className="page auth-page">
      <div className="bg-mesh" />
      <div className="auth-container">
        <GlassCard className="auth-card animate-fadeIn" style={{ textAlign: 'center' }}>
          <div className="success-icon">✉️</div>
          <h2>Check your email</h2>
          <p style={{ marginTop: 12 }}>We've sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account, then <Link to="/login">sign in</Link>.</p>
        </GlassCard>
      </div>
    </div>
  );

  return (
    <div className="page auth-page">
      <div className="bg-mesh" />
      <div className="auth-container">
        <div className="auth-logo">
          <div className="logo-icon"><Zap size={18} fill="currentColor" /></div>
          <span className="logo-text">Build<span className="logo-accent">Ex</span></span>
        </div>

        <GlassCard className="auth-card animate-fadeInUp">
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-subtitle">Join the Build Ex club today</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-icon-wrap">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  placeholder="Husain Rangwala"
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email address</label>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <PrimaryButton type="submit" loading={loading} fullWidth size="md" icon={<ArrowRight size={16} />}>
              Create Account
            </PrimaryButton>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
