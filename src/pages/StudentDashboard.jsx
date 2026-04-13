import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import { X, Calendar, MapPin, User, LogOut, CheckCircle2, ArrowRight, ArrowLeft, Zap, Activity, Clock, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PerspectiveGrid, MagneticWrapper, BorderBeamCard, AuroraOrbs } from '../components/VengeanceUI';

/* ─── Liquid Elastic Progress Bar ─── */
const STEPS = ['Your Details', 'Generating Pass'];

const LiquidProgress = ({ step, total }) => {
  // Percentage of full width to fill
  const pct = Math.round((step / (total - 1)) * 100);

  return (
    <div className="w-full mb-8">
      {/* Step labels */}
      <div className="flex justify-between mb-2">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className="text-xs font-semibold transition-colors duration-300"
            style={{ color: i <= step ? 'var(--color-primary)' : 'rgba(255,255,255,0.25)' }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Track */}
      <div
        className="relative h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        {/* Liquid fill — spring with mass:1 for heavy, water-like feel */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #635BFF 0%, #4CD7F6 100%)',
            willChange: 'width',
          }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, mass: 1 }}
        />
        {/* Shimmer riding on the fill */}
        <motion.div
          className="absolute inset-y-0 rounded-full"
          style={{
            width: '60px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
            willChange: 'left',
          }}
          animate={{ left: `calc(${pct}% - 60px)` }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, mass: 1 }}
        />
      </div>
    </div>
  );
};

/* ─── Step Content ─── */
const StepContent = ({ step, event, details, setDetails }) => {
  if (step === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold">{event.title}</h3>
          <p className="text-gray-400 text-sm mt-1">{event.description}</p>
        </div>

        {/* Step 1: Your Details */}
        <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary)' }}>Your Details</h4>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
            <input
              value={details.fullName}
              onChange={e => setDetails({ ...details, fullName: e.target.value })}
              className="w-full rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors border"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 mb-1">Department</label>
              <select
                value={details.department}
                onChange={e => setDetails({ ...details, department: e.target.value })}
                className="w-full rounded-xl px-3 py-2 text-sm text-white focus:outline-none border"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <option style={{ background: '#131313' }} value="CE">CE</option>
                <option style={{ background: '#131313' }} value="IT">IT</option>
                <option style={{ background: '#131313' }} value="ME">ME</option>
                <option style={{ background: '#131313' }} value="EE">EE</option>
                <option style={{ background: '#131313' }} value="CL">CL</option>
                <option style={{ background: '#131313' }} value="EC">EC</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 mb-1">Year</label>
              <select
                value={details.year}
                onChange={e => setDetails({ ...details, year: e.target.value })}
                className="w-full rounded-xl px-3 py-2 text-sm text-white focus:outline-none border"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <option style={{ background: '#131313' }} value="1st Year">1st Year</option>
                <option style={{ background: '#131313' }} value="2nd Year">2nd Year</option>
                <option style={{ background: '#131313' }} value="3rd Year">3rd Year</option>
                <option style={{ background: '#131313' }} value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Enrollment No.</label>
            <input
              value={details.enrollmentNo}
              onChange={e => setDetails({ ...details, enrollmentNo: e.target.value })}
              className="w-full rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors border"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              placeholder="e.g. 23010101011"
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="flex flex-col items-center text-center space-y-4">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
            style={{ background: 'rgba(76,215,246,0.15)', border: '2px solid rgba(76,215,246,0.5)' }}
          >
            <Zap size={28} style={{ color: 'var(--color-cyan)' }} />
          </div>
        </motion.div>
        <h3 className="text-2xl font-bold">Entry Pass Generated!</h3>
        <p className="text-gray-400 text-sm">Present this QR code at the entrance.</p>
        <motion.div
          className="bg-white p-4 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <QRCodeSVG value={event.qr_token || event.__qrPayload || 'TOKEN-ERROR'} size={180} />
        </motion.div>
        <div className="w-full text-center mt-2 flex flex-col items-center">
          <span className="text-xl font-bold text-white tracking-widest uppercase">{details.enrollmentNo || 'N/A'}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] mt-1">Enrollment No.</span>
        </div>
        <div className="w-full text-xs text-gray-600 font-mono break-all px-2 mt-2">
          PAYLOAD: {event.qr_token || event.__qrPayload || 'TOKEN-ERROR'}
        </div>
      </div>
    );
  }
};

/* ─── Registration Modal ─── */
const RegistrationModal = ({ payload, userId, onClose, onRegistered }) => {
  const { event, existingReg } = payload;
  const [step, setStep] = useState(existingReg ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    fullName: existingReg ? existingReg.full_name || '' : '',
    department: existingReg ? existingReg.department || 'CE' : 'CE',
    year: existingReg ? existingReg.year || '1st Year' : '1st Year',
    enrollmentNo: existingReg ? existingReg.enrollment_no || '' : ''
  });
  const [enrichedEvent, setEnrichedEvent] = useState(existingReg ? { ...event, qr_token: existingReg.qr_token } : event);

  const next = async () => {
    if (step === 0) {
      if (!details.fullName.trim() || !details.enrollmentNo.trim()) {
        alert('Please fill out your Full Name and Enrollment No.');
        return;
      }

      setLoading(true);
      const uniqueToken = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

      // Check capacity before inserting
      let regStatus = 'registered';
      if (event.max_capacity) {
        const { count } = await supabase
          .from('registrations')
          .select('id', { count: 'exact', head: true })
          .eq('event_id', event.id)
          .neq('status', 'waiting');
        if (count >= event.max_capacity) regStatus = 'waiting';
      }

      const { error } = await supabase
        .from('registrations')
        .insert([{
          user_id: userId,
          event_id: event.id,
          full_name: details.fullName.trim(),
          department: details.department,
          year: details.year,
          enrollment_no: details.enrollmentNo.trim(),
          qr_token: uniqueToken,
          status: regStatus
        }]);

      setLoading(false);

      let finalToken = uniqueToken;
      if (error && !error.message.includes('duplicate')) {
        alert('Registration failed: ' + error.message);
        return;
      }

      setEnrichedEvent({
        ...event,
        qr_token: finalToken,
      });
      if (onRegistered) {
        onRegistered({
          event_id: event.id,
          user_id: userId,
          qr_token: finalToken,
          enrollment_no: details.enrollmentNo,
          full_name: details.fullName,
          department: details.department,
          year: details.year,
          status: regStatus
        });
      }
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep(s => Math.max(s - 1, 0));
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: 'rgba(0,0,0,0.7)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal card */}
      <motion.div
        className="relative rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
        style={{
          background: 'rgba(19,19,19,0.95)',
          border: '1px solid rgba(99,91,255,0.3)',
          willChange: 'transform',
        }}
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-6 pb-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--color-primary)' }}
          >
            Event Registration
          </span>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-6 pb-4">
          <LiquidProgress step={step} total={STEPS.length} />

          {/* Slide-in/out step content */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ willChange: 'transform, opacity' }}
            >
              <StepContent step={step} event={enrichedEvent} details={details} setDetails={setDetails} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div
          className="flex gap-3 px-6 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {step > 0 && !isLast && (
            <button
              onClick={back}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          {!isLast ? (
            <motion.button
              onClick={next}
              disabled={loading}
              whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 400, damping: 14 } }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white"
              style={{
                background: 'var(--color-primary)',
                boxShadow: '0 0 20px rgba(99,91,255,0.35)',
                willChange: 'transform',
              }}
            >
              {loading ? 'Registering…' : step === 1 ? 'Generate My Pass' : 'Continue'}
              {!loading && <ArrowRight size={16} />}
            </motion.button>
          ) : (
            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.96 }}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm"
              style={{
                background: 'rgba(76,215,246,0.12)',
                border: '1px solid rgba(76,215,246,0.4)',
                color: 'var(--color-cyan)',
              }}
            >
              ✓ Done — Close
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main Page ─── */
export default function StudentDashboard() {
  const [session, setSession] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]); // Global Registration Check
  const [activeTab, setActiveTab] = useState('live');
  const [qrModalPayload, setQrModalPayload] = useState(null); // Will store { qr_token, enrollment_no }
  const [registrationPayload, setRegistrationPayload] = useState(null); // { event, existingReg }

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*').order('start_time', { ascending: true });
    if (!error) setEvents(data ?? []);
  };

  const fetchRegistrations = async (userId) => {
    const { data, error } = await supabase.from('registrations').select('*').eq('user_id', userId);
    console.log("Registered Events:", data); // Check the Mount Fetch
    if (!error && data) {
      setRegistrations(data);
      setUserRegistrations(data.map(r => String(r.event_id)));
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchEvents();
        fetchRegistrations(session.user.id);
      }
    });

    // Added Real-time listener for events to auto-refresh data
    const channel = supabase.channel('public:events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  /** Compute status dynamically from start_time + duration so new events appear correctly */
  const getEventStatus = (event) => {
    if (!event.start_time) return event.status ?? 'upcoming';

    const nowTime = new Date().getTime();
    const startTimeStamp = new Date(event.start_time).getTime();
    const endTimeStamp = startTimeStamp + (event.duration || 60) * 60000;

    if (nowTime >= startTimeStamp && nowTime <= endTimeStamp) return 'live';
    if (new Date(event.start_time) > new Date()) return 'upcoming';
    return 'past';
  };

  const isRegistered = (eventId) => registrations.some(r => String(r.event_id) === String(eventId));
  const getRegStatus = (eventId) => registrations.find(r => String(r.event_id) === String(eventId))?.status || null;

  const showQrPass = (eventId) => {
    const reg = registrations.find(r => String(r.event_id) === String(eventId));
    if (reg && reg.qr_token) {
      setQrModalPayload({ qr_token: reg.qr_token, enrollment_no: reg.enrollment_no });
    } else {
      setQrModalPayload({ qr_token: `err-no-token-${eventId}`, enrollment_no: 'N/A' });
    }
  };

  const handleRegisterClick = async (event) => {
    // 1. Check local state first for instantaneous performance
    let existingReg = registrations.find(r => String(r.event_id) === String(event.id));

    // Provide a DB-driven fallback just in case
    if (!existingReg) {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('event_id', event.id)
        .single();
      if (!error && data) existingReg = data;
    }

    if (existingReg) {
       // Scenario A: Found. Bypass the registration form directly to Generating Pass step (Step 1).
       setRegistrationPayload({ event, existingReg });
    } else {
       // Scenario B: Not Found. Proceed to normal Your Details step.
       setRegistrationPayload({ event, existingReg: null });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    window.location.replace('/role-selection');
  };

  const filteredEvents = events.filter(e => getEventStatus(e) === activeTab);

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] p-4 md:p-8 relative pb-32">
      <PerspectiveGrid />
      <AuroraOrbs />
      
      <header className="flex justify-between items-center mb-10 max-w-5xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold tracking-tight">Event Hub</h1>
        <motion.button
          whileTap={{ scale: 0.92, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white glass glass-border px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={18} /> <span className="hidden sm:inline">Sign Out</span>
        </motion.button>
      </header>

      {/* Spacer for no top nav */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {filteredEvents.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 glass rounded-2xl glass-border">
            No {activeTab} events found in the database.
          </div>
        )}

        {filteredEvents.map(event => {
          const registered = isRegistered(event.id);
          const eventStatus = getEventStatus(event);
          const isLive = eventStatus === 'live';

          const CardInner = (
            <div key={event.id} className={`glass rounded-2xl p-6 shadow-neon flex flex-col relative overflow-hidden transition-all ${
              isLive ? 'border-transparent' : 'glass-border hover:border-[var(--color-primary)]/50'
            }`}>
              {isLive && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                  <span className="absolute top-4 right-4 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-cyan)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-cyan)]"></span>
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold mb-2 pr-6">{event.title}</h3>
              <p className="text-gray-400 text-sm mb-4 flex-1">{event.description}</p>

              <div className="space-y-2 mb-6 text-sm text-[var(--color-surface-variant)]">
                <div className="flex items-center gap-2 text-gray-300"><Calendar size={16} className="text-[var(--color-primary)]" /> {new Date(event.event_date).toLocaleDateString()}</div>
                <div className="flex items-center gap-2 text-gray-300"><MapPin size={16} className="text-[var(--color-primary)]" /> {event.location || 'TBA'}</div>
                {event.speaker_name && <div className="flex items-center gap-2 text-gray-300"><User size={16} className="text-[var(--color-primary)]" /> {event.speaker_name}</div>}
              </div>

              {/* ── Register / Get Pass Button ── */}
              {(eventStatus === 'upcoming' || eventStatus === 'live') && (() => {
                const regStatus = getRegStatus(event.id);
                const isWaiting = regStatus === 'waiting';
                const isAdmitted = regStatus === 'admitted' || regStatus === 'registered';
                return (
                  <div className="flex flex-col gap-2">
                    {isAdmitted && (
                      <div className="flex items-center gap-2 justify-center text-[var(--color-cyan)] font-medium mb-2">
                        <CheckCircle2 size={18} /> Verified Registered
                      </div>
                    )}
                    {isWaiting && (
                      <div className="flex items-center gap-2 justify-center text-amber-400 font-medium mb-2">
                        <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" /></span>
                        On Waiting List
                      </div>
                    )}
                    <MagneticWrapper strength={12} className="w-full">
                      <motion.button
                        onClick={() => handleRegisterClick(event)}
                        whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 400, damping: 14 } }}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${
                          isAdmitted
                            ? 'bg-[var(--color-primary)] text-white shadow-[0_0_20px_rgba(99,91,255,0.35)] hover:bg-[var(--color-primary-hover)]'
                            : isWaiting
                            ? 'bg-amber-500/10 border border-amber-500/50 text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.2)] hover:bg-amber-500/20'
                            : 'bg-[var(--color-surface-highest)] border border-white/10 text-white hover:bg-white/10'
                        }`}
                        style={{ willChange: 'transform' }}
                      >
                        {isAdmitted ? 'Show Entry Pass' : isWaiting ? '⏳ Join Waiting List' : 'Register Now'}
                      </motion.button>
                    </MagneticWrapper>
                  </div>
                );
              })()}

              {eventStatus === 'past' && registered && (
                <button
                  onClick={() => alert('Feedback popup logic initiated!')}
                  className="w-full bg-[var(--color-surface-highest)] border border-gray-600 text-gray-300 hover:bg-gray-800 py-3 rounded-lg font-bold transition-all"
                >
                  Provide Feedback to unlock Certificate
                </button>
              )}
            </div>
          );

          return isLive ? (
            <BorderBeamCard key={event.id} variant="cyan" className="rounded-2xl">
              {CardInner}
            </BorderBeamCard>
          ) : (
            <div key={event.id}>{CardInner}</div>
          );
        })}
      </div>

      {/* ── 3-Step Registration Modal ── */}
      <AnimatePresence>
        {registrationPayload && (
          <RegistrationModal
            payload={registrationPayload}
            userId={session?.user?.id}
            onClose={() => setRegistrationPayload(null)}
            onRegistered={async (newReg) => {
              if (newReg) {
                // Optimistic instant update
                setUserRegistrations(prev => [...prev, String(newReg.event_id)]);
                setRegistrations(prev => [...prev, newReg]);
              }
              // Async background sync ensures 100% hard-reload refresh of state
              if (session) await fetchRegistrations(session.user.id);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── QR Code Modal ── */}
      {qrModalPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setQrModalPayload(null)}></div>
          <div className="relative glass bg-[var(--color-surface-base)]/80 border border-white/10 rounded-2xl p-8 shadow-neon max-w-sm w-full flex flex-col items-center">
            <button onClick={() => setQrModalPayload(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Access Credentials</h2>
            <p className="text-gray-400 text-sm mb-8 text-center">Present this QR code to the scanner at the event entrance.</p>
            <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex flex-col items-center">
              <QRCodeSVG value={qrModalPayload.qr_token} size={200} />
            </div>
            <div className="w-full text-center mt-2 mb-4 flex flex-col items-center">
              <span className="text-2xl font-bold text-white tracking-widest uppercase">{qrModalPayload.enrollment_no || 'N/A'}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-primary)] mt-1">Enrollment No.</span>
            </div>
            <div className="w-full text-center text-xs text-gray-500 font-mono break-all px-4">
              PAYLOAD: {qrModalPayload.qr_token}
            </div>
          </div>
        </div>
      )}

      {/* ── Glass Dock (Bottom Navigation) ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10" style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)' }}>
          {[
            { id: 'live', icon: Activity, label: 'Live', color: 'var(--color-cyan)' },
            { id: 'upcoming', icon: Calendar, label: 'Schedule', color: 'var(--color-primary)' },
            { id: 'past', icon: History, label: 'History', color: '#9CA3AF' },
          ].map(({ id, icon: Icon, label, color }) => (
            <motion.button
              key={id}
              onClick={() => setActiveTab(id)}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-colors relative"
              style={{
                background: activeTab === id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === id ? color : 'rgba(156,163,175,0.7)',
              }}
            >
              <Icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
              {activeTab === id && (
                <motion.div layoutId="dock-indicator" className="absolute -bottom-1 w-1 h-1 rounded-full" style={{ background: color }} />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
