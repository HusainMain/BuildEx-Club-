import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { QrCode, CheckCircle2, XCircle, Camera, Keyboard } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import './AdminScanner.css';

export default function AdminScanner() {
  const [manualCode, setManualCode] = useState('');
  const [result, setResult]         = useState(null);   // { success, name, event, message }
  const [loading, setLoading]       = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const inputRef = useRef(null);

  async function verifyAndMarkAttendance(token) {
    if (!token.trim()) return;
    setLoading(true);
    setResult(null);

    // Look up registration by QR token or qr_code_string
    const { data: reg, error } = await supabase
      .from('registrations')
      .select('*, profiles(full_name, email), events(title, event_date)')
      .or(`qr_token.eq.${token},qr_code_string.eq.${token}`)
      .single();

    if (error || !reg) {
      setResult({ success: false, message: 'QR code not found. Invalid or unregistered ticket.' });
      setLoading(false);
      return;
    }

    if (reg.attended) {
      setResult({
        success: false,
        message: `Already marked! ${reg.profiles?.full_name || 'Student'} was checked in earlier.`,
        name: reg.profiles?.full_name,
        event: reg.events?.title,
      });
      setLoading(false);
      addToRecent({ token, name: reg.profiles?.full_name, event: reg.events?.title, status: 'duplicate' });
      return;
    }

    // Mark as attended
    const { error: updateErr } = await supabase
      .from('registrations')
      .update({ attended: true, attended_at: new Date().toISOString() })
      .eq('id', reg.id);

    if (updateErr) {
      setResult({ success: false, message: 'Failed to update attendance. Try again.' });
    } else {
      setResult({
        success: true,
        name: reg.profiles?.full_name || reg.profiles?.email || 'Student',
        event: reg.events?.title || 'Event',
        message: 'Attendance marked successfully!',
      });
      addToRecent({ token, name: reg.profiles?.full_name, event: reg.events?.title, status: 'success' });
    }

    setLoading(false);
    setManualCode('');
  }

  function addToRecent(scan) {
    setRecentScans(prev => [{ ...scan, time: new Date() }, ...prev].slice(0, 10));
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    verifyAndMarkAttendance(manualCode);
  }

  return (
    <div className="page scanner-page">
      <div className="bg-mesh" />
      <div className="container scanner-container">

        {/* Header */}
        <div className="scanner-header animate-fadeInUp">
          <div className="scanner-title-wrap">
            <div className="scanner-icon-badge">
              <QrCode size={24} />
            </div>
            <div>
              <h1 className="scanner-title">Attendance Scanner</h1>
              <p>Scan student QR codes to mark attendance</p>
            </div>
          </div>
          <div className="scanner-count">
            <span className="count-val">{recentScans.filter(s => s.status === 'success').length}</span>
            <span className="count-label">Checked in this session</span>
          </div>
        </div>

        <div className="scanner-layout">
          {/* Left – Manual entry */}
          <div className="scanner-left">
            <GlassCard glow className="manual-card animate-fadeInUp delay-100">
              <div className="manual-header">
                <Keyboard size={18} />
                <h3>Manual Code Entry</h3>
              </div>
              <p className="manual-hint">
                Paste or type the QR token from the student's ticket.
              </p>

              <form onSubmit={handleManualSubmit} className="manual-form">
                <div className="form-group">
                  <label>QR Token / Code</label>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="BUILDEX-xxxxxxxx-xxxxxxxx-..."
                    value={manualCode}
                    onChange={e => setManualCode(e.target.value)}
                    autoFocus
                  />
                </div>
                <PrimaryButton type="submit" loading={loading} fullWidth icon={<CheckCircle2 size={16} />}>
                  Verify & Mark Attendance
                </PrimaryButton>
              </form>
            </GlassCard>

            {/* Result */}
            {result && (
              <GlassCard hover={false} className={`result-card animate-fadeIn ${result.success ? 'result-success' : 'result-error'}`}>
                <div className="result-icon">
                  {result.success
                    ? <CheckCircle2 size={32} />
                    : <XCircle size={32} />
                  }
                </div>
                <div className="result-content">
                  <p className="result-message">{result.message}</p>
                  {result.name && <p className="result-name">{result.name}</p>}
                  {result.event && <p className="result-event">{result.event}</p>}
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right – Recent scans */}
          <div className="scanner-right animate-fadeInUp delay-200">
            <GlassCard hover={false} className="recents-card">
              <h3 className="recents-title">Recent Scans</h3>
              {recentScans.length === 0 ? (
                <div className="recents-empty">
                  <Camera size={32} className="recents-empty-icon" />
                  <p>No scans yet this session</p>
                </div>
              ) : (
                <div className="recents-list">
                  {recentScans.map((scan, i) => (
                    <div key={i} className={`scan-item ${scan.status}`}>
                      <div className="scan-dot" />
                      <div className="scan-info">
                        <span className="scan-name">{scan.name || 'Unknown'}</span>
                        <span className="scan-event">{scan.event || '—'}</span>
                      </div>
                      <div className="scan-right">
                        <span className={`scan-badge ${scan.status === 'success' ? 'badge-success' : 'badge-error'}`}>
                          {scan.status === 'success' ? '✓' : '✗'}
                        </span>
                        <span className="scan-time">
                          {scan.time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </div>

      </div>
    </div>
  );
}
