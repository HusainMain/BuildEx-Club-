import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Html5Qrcode } from 'html5-qrcode';
import { Scan, LogOut, X, Plus, Clock, MapPin, User, Calendar, Trash2, Search, Flashlight, SwitchCamera } from 'lucide-react';
import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { PerspectiveGrid, MagneticWrapper, BorderBeamCard, AuroraOrbs } from '../components/VengeanceUI';

const COLORS = ['#635BFF', '#4CD7F6', '#7C3AED', '#2A2A2A'];

/* ═══════════════════════════════════════════════════════╗
   ROLLING NUMBER — slot-machine digit columns
╚══════════════════════════════════════════════════════ */
const DIGIT_HEIGHT = 44;
const DigitColumn = ({ digit }) => (
  <div style={{ height: DIGIT_HEIGHT, overflow: 'hidden', display: 'inline-block' }}>
    <motion.div
      animate={{ y: -digit * DIGIT_HEIGHT }}
      transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.8 }}
      style={{ willChange: 'transform' }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{ height: DIGIT_HEIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>{i}</div>
      ))}
    </motion.div>
  </div>
);
const RollingNumber = ({ value }) => (
  <div style={{ display: 'flex', alignItems: 'center', willChange: 'transform' }}>
    {String(Math.max(0, Math.round(value))).split('').map((d, i) => <DigitColumn key={i} digit={Number(d)} />)}
  </div>
);

/* ═══════════════════════════════════════════════════════╗
   FLASHLIGHT GLOW CARD
╚══════════════════════════════════════════════════════ */
const GlowCard = ({ children }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gradient = useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(99,91,255,0.18), transparent 80%)`;
  const handleMove = useCallback((cx, cy) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mouseX.set(cx - r.left); mouseY.set(cy - r.top);
  }, [mouseX, mouseY]);
  return (
    <div ref={cardRef} onMouseMove={e => handleMove(e.clientX, e.clientY)} onTouchMove={e => e.touches[0] && handleMove(e.touches[0].clientX, e.touches[0].clientY)} style={{ position: 'relative' }}>
      <motion.div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: gradient, pointerEvents: 'none', zIndex: 1, willChange: 'background' }} />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════╗
   SCAN WAVE — expands from center, mix-blend-mode: lighten
╚══════════════════════════════════════════════════════ */
const ScanWave = ({ onDone }) => (
  <motion.div
    aria-hidden
    style={{ position: 'fixed', top: '50%', left: '50%', width: 60, height: 60, marginTop: -30, marginLeft: -30, borderRadius: '50%', border: '2px solid rgba(76,215,246,0.85)', mixBlendMode: 'lighten', pointerEvents: 'none', zIndex: 9999, willChange: 'transform, opacity' }}
    initial={{ scale: 0, opacity: 0.9 }}
    animate={{ scale: 30, opacity: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    onAnimationComplete={onDone}
  />
);

/* ═══════════════════════════════════════════════════════╗
   LIQUID PROGRESS BAR
╚══════════════════════════════════════════════════════ */
const FORM_STEPS = ['Identity', 'Logistics'];
const LiquidProgress = ({ step }) => {
  const pct = Math.round((step / (FORM_STEPS.length - 1)) * 100);
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2">
        {FORM_STEPS.map((label, i) => (
          <span key={label} className="text-xs font-bold uppercase tracking-widest transition-colors duration-300" style={{ color: i <= step ? 'var(--color-primary)' : 'rgba(255,255,255,0.25)' }}>{label}</span>
        ))}
      </div>
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, #635BFF 0%, #4CD7F6 100%)', willChange: 'width' }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, mass: 1 }}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════╗
   SCHEDULE EVENT MODAL — 2-step glass slide-up
╚══════════════════════════════════════════════════════ */
const ScheduleModal = ({ onClose, onCreated }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', speaker_name: '', location: '', description: '', start_time: '', duration: 90 });
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  /* Real-time end_time display */
  const endTime = (() => {
    if (!form.start_time) return '—';
    try {
      const d = new Date(form.start_time);
      d.setMinutes(d.getMinutes() + Number(form.duration));
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch { return '—'; }
  })();

  const startDisplay = (() => {
    if (!form.start_time) return '';
    try { return new Date(form.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
  })();

  const validateStep1 = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.speaker_name.trim()) e.speaker_name = 'Speaker is required';
    if (!form.location.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.start_time) e.start_time = 'Start time is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const formatDuration = (val) => {
    const hours = Math.floor(val / 60);
    const minutes = val % 60;
    if (hours > 0) return `${hours}h ${minutes === 0 ? '00' : minutes}m`;
    return `${minutes}m`;
  };

  const nextStep = () => {
    if (step === 0 && !validateStep1()) return;
    setStep(1);
  };

  const handleCreate = async () => {
    if (!validateStep2()) return;
    setLoading(true);

    const startDate = new Date(form.start_time);
    const endDate = new Date(startDate.getTime() + form.duration * 60000);

    const { error } = await supabase.from('events').insert([{
      title: form.title.trim(),
      description: form.description.trim() || null,
      speaker_name: form.speaker_name.trim(),
      location: form.location.trim(),
      start_time: startDate.toISOString(),
      event_date: startDate.toISOString(), // keep legacy col in sync
      duration: Number(form.duration),
      status: startDate <= new Date() && new Date() <= endDate ? 'live' : startDate > new Date() ? 'upcoming' : 'past',
    }]);

    setLoading(false);
    if (error) { setErrors({ submit: error.message }); return; }
    onCreated();
    onClose();
  };

  const inputCls = "w-full bg-[var(--color-surface-highest)] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors";
  const inputStyle = (field) => ({ borderColor: errors[field] ? '#ef4444' : 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' });
  const labelCls = "block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: 'rgba(0,0,0,0.75)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal — slides up from bottom on mobile, springs in from center on desktop */}
      <motion.div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ background: 'rgba(14,14,18,0.97)', border: '1px solid rgba(99,91,255,0.3)', willChange: 'transform', maxHeight: '92vh', overflowY: 'auto' }}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 1.1 }}
      >
        {/* Drag handle pill (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-6 pt-4 pb-2 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">Admin · Schedule Event</span>
            <h2 className="text-xl font-bold mt-0.5">New Event</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-2 pb-6">
          <LiquidProgress step={step} />

          <AnimatePresence mode="wait" initial={false}>
            {step === 0 ? (
              <motion.div key="step0" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} style={{ willChange: 'transform, opacity' }} className="space-y-4">
                <div>
                  <label className={labelCls}>Event Title *</label>
                  <input className={inputCls} style={inputStyle('title')} placeholder="e.g. Build Ex Hackathon 2026" value={form.title} onChange={e => set('title', e.target.value)} />
                  {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className={labelCls}>Speaker Name *</label>
                  <input className={inputCls} style={inputStyle('speaker_name')} placeholder="e.g. Dr. Priya Mehta" value={form.speaker_name} onChange={e => set('speaker_name', e.target.value)} />
                  {errors.speaker_name && <p className="text-xs text-red-400 mt-1">{errors.speaker_name}</p>}
                </div>
                <div>
                  <label className={labelCls}>Location *</label>
                  <input className={inputCls} style={inputStyle('location')} placeholder="e.g. Seminar Hall B, Block 3" value={form.location} onChange={e => set('location', e.target.value)} />
                  {errors.location && <p className="text-xs text-red-400 mt-1">{errors.location}</p>}
                </div>
                <div>
                  <label className={labelCls}>Description <span className="normal-case text-gray-600">(optional)</span></label>
                  <textarea className={`${inputCls} resize-none`} style={inputStyle('description')} rows={3} placeholder="Brief event overview…" value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
                <motion.button
                  onClick={nextStep}
                  whileTap={{ scaleX: 0.96, scaleY: 0.93, transition: { type: 'spring', stiffness: 500, damping: 16 } }}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm mt-2"
                  style={{ background: 'var(--color-primary)', boxShadow: '0 0 24px rgba(99,91,255,0.35)', willChange: 'transform' }}
                >
                  Continue to Logistics →
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="step1" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} style={{ willChange: 'transform, opacity' }} className="space-y-5">
                {/* Date & Time picker */}
                <div>
                  <label className={labelCls}>
                    <Calendar size={11} className="inline mr-1" />Date & Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    style={{ ...inputStyle('start_time'), colorScheme: 'dark' }}
                    value={form.start_time}
                    onChange={e => set('start_time', e.target.value)}
                  />
                  {errors.start_time && <p className="text-xs text-red-400 mt-1">{errors.start_time}</p>}
                </div>

                {/* Duration slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className={labelCls}><Clock size={11} className="inline mr-1" />Duration</label>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                      {formatDuration(form.duration)}
                    </span>
                  </div>

                  {/* Glassmorphic slider track wrapper */}
                  <div className="relative py-2">
                    <div className="h-2 rounded-full relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${((form.duration - 30) / (300 - 30)) * 100}%`,
                          background: 'linear-gradient(90deg, #635BFF 0%, #4CD7F6 100%)',
                          transition: 'width 0.05s',
                        }}
                      />
                    </div>
                    <input
                      type="range"
                      min={30} max={300} step={30}
                      value={form.duration}
                      onChange={e => set('duration', Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      style={{ height: '100%', touchAction: 'none' }}
                    />
                    {/* Custom thumb indicator with tooltip */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 pointer-events-none flex items-center justify-center"
                      style={{
                        left: `calc(${((form.duration - 30) / (300 - 30)) * 100}% - 12px)`,
                        background: '#635BFF',
                        borderColor: 'rgba(99,91,255,0.6)',
                        boxShadow: '0 0 12px rgba(99,91,255,0.6)',
                        willChange: 'left',
                      }}
                      layout
                      transition={{ duration: 0.05 }}
                    >
                      {/* Floating tooltip label over thumb */}
                      <div className="absolute -top-8 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded-md text-[10px] font-bold text-white shadow-xl whitespace-nowrap">
                        {formatDuration(form.duration)}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 border-r border-b border-white/10 rotate-45 transform" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Tick labels */}
                  <div className="flex justify-between text-[10px] text-gray-600 mt-1 relative pb-4">
                    {['30m', '1h', '1h 30m', '2h', '2h 30m', '3h', '3h 30m', '4h', '4h 30m', '5h'].map((label) => {
                      const isMajor = label.indexOf('30m') === -1;
                      return (
                        <div key={label} className="flex flex-col items-center relative" style={{ width: 0 }}>
                          <span className={`${isMajor ? 'text-gray-400 font-medium' : 'hidden sm:block opacity-60'} absolute top-0 whitespace-nowrap -translate-x-1/2`}>
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Real-time end time display */}
                <div
                  className="rounded-xl p-4 flex items-center gap-4"
                  style={{ background: 'rgba(76,215,246,0.06)', border: '1px solid rgba(76,215,246,0.2)' }}
                >
                  <Clock size={18} style={{ color: 'var(--color-cyan)', flexShrink: 0 }} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-0.5">Calculated Time Slot</p>
                    {form.start_time ? (
                      <p className="text-sm font-bold text-white">
                        {startDisplay} <span className="text-gray-500 font-normal">→</span> <span style={{ color: 'var(--color-cyan)' }}>{endTime}</span>
                        <span className="text-gray-500 font-normal ml-2">
                          ({formatDuration(form.duration)})
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Set a start time to preview</p>
                    )}
                  </div>
                </div>

                {errors.submit && (
                  <div className="rounded-xl p-3 text-sm text-red-400" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {errors.submit}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => { setStep(0); setErrors({}); }}
                    className="flex-none px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    ← Back
                  </button>
                  <motion.button
                    onClick={handleCreate}
                    disabled={loading}
                    whileTap={{ scaleX: 0.96, scaleY: 0.93, transition: { type: 'spring', stiffness: 500, damping: 16 } }}
                    className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                    style={{ background: loading ? 'rgba(99,91,255,0.5)' : 'var(--color-primary)', boxShadow: '0 0 24px rgba(99,91,255,0.35)', willChange: 'transform' }}
                  >
                    {loading ? 'Creating Event…' : '⚡ Create Event'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
/* ═══════════════════════════════════════════════════════╗
   EVENT INTELLIGENCE MODAL
╚══════════════════════════════════════════════════════ */
const EventIntelligenceModal = ({ event, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetchRegistrations();
  }, [event.id]);

  const fetchRegistrations = async () => {
    setLoading(true);
    // Specific fetch for this event only
    const { data, error } = await supabase
      .from('registrations')
      .select('*, profiles:user_id(full_name, enrollment_no, department, year)')
      .eq('event_id', event.id);
    
    if (data) {
      // Flatten the data if needed or use as is if schema is redundant
      setRegistrations(data);
    }
    setLoading(false);
  };

  const toggleAttendance = async (reg) => {
    const newState = !reg.attended;
    const now = new Date().toISOString();
    
    // Optimistic update
    setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, attended: newState, attended_at: newState ? now : null } : r));
    
    const { error } = await supabase.from('registrations').update({ 
      attended: newState,
      attended_at: newState ? now : null 
    }).eq('id', reg.id);
    if (error) {
      // Revert if error
      setRegistrations(prev => prev.map(r => r.id === reg.id ? { ...r, attended: reg.attended } : r));
      document.dispatchEvent(new CustomEvent('toastTrigger', { detail: { msg: 'Error: ' + error.message, isError: true } }));
    } else {
      document.dispatchEvent(new CustomEvent('toastTrigger', { detail: { msg: 'Attendance Updated', isError: false } }));
    }
  };

  const attendedCount = registrations.filter(r => r.attended).length;
  const filteredRegs = registrations.filter(r => 
    (r.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.enrollment_no || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative glass border border-[var(--color-primary)] rounded-2xl shadow-neon w-full max-w-5xl flex flex-col overflow-hidden max-h-[85vh] bg-[var(--color-surface-base)]"
      >
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--color-surface-elevated)] sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2"><Scan size={20} style={{ color: 'var(--color-cyan)' }}/> {event.title}</h2>
            <div className="flex gap-4 mt-2">
              <span className="text-sm text-gray-400">Registered: <strong className="text-white">{registrations.length}</strong></span>
              <span className="text-sm text-[var(--color-cyan)]">Attended: <strong className="text-white">{attendedCount}</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search name or enrollment..." 
                className="w-full bg-[var(--color-surface-highest)] border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:border-[var(--color-cyan)] focus:outline-none transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={onClose} className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading Intelligence Data...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-[#1a1a24] text-xs uppercase tracking-wider text-gray-400 sticky top-0 z-0">
                <tr>
                  <th className="px-6 py-4 font-semibold w-24 border-b border-white/5">Status</th>
                  <th className="px-6 py-4 font-semibold border-b border-white/5">Full Name</th>
                  <th className="px-6 py-4 font-semibold border-b border-white/5">Enrollment No.</th>
                  <th className="px-6 py-4 font-semibold border-b border-white/5">Dept / Year</th>
                  <th className="px-6 py-4 font-semibold border-b border-white/5">Scan Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredRegs.map(reg => (
                  <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-3">
                      <button 
                        onClick={() => toggleAttendance(reg)}
                        className={`w-11 h-6 rounded-full relative transition-colors ${reg.attended ? 'bg-[var(--color-cyan)]' : 'bg-gray-700'}`}
                      >
                        <motion.div 
                          layout
                          className="w-4 h-4 bg-white rounded-full absolute top-1"
                          style={{ left: reg.attended ? 'calc(100% - 20px)' : '4px' }}
                          transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-3 font-semibold text-white">{reg.full_name || reg.profiles?.full_name || 'N/A'}</td>
                    <td className="px-6 py-3 text-gray-400">{reg.enrollment_no || reg.profiles?.enrollment_no || 'N/A'}</td>
                    <td className="px-6 py-3 text-gray-500">
                      {reg.department || reg.profiles?.department} {reg.year || reg.profiles?.year ? `- ${reg.year || reg.profiles?.year}` : ''}
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-400 font-mono">
                      {reg.attended_at ? new Date(reg.attended_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}
                    </td>
                  </tr>
                ))}
                {filteredRegs.length === 0 && (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">No matching students found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════╗
   STAFF MANAGEMENT MODAL
╚══════════════════════════════════════════════════════ */
const StaffModal = ({ onClose, session, admins, refreshAdmins }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isMasterAdmin = session?.user?.email === 'admin.husain@buildex.com';

  const handleCreate = async () => {
    if (!email || !fullName || !password) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('create_admin', {
        body: { email, password, full_name: fullName }
      });

      if (invokeError) throw new Error(invokeError.message);
      if (data?.error) throw new Error(data.error);

      setSuccess('Admin successfully created!');
      setEmail(''); setFullName(''); setPassword('');
      refreshAdmins();
    } catch (err) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (targetId) => {
    if (!confirm("Confirm staff deletion execution?")) return;
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('delete_admin', {
        body: { targetId }
      });
      if (invokeError) throw new Error(invokeError.message);
      if (data?.error) throw new Error(data.error);

      document.dispatchEvent(new CustomEvent('toastTrigger', { detail: { msg: 'Staff Removed', isError: false } }));
      refreshAdmins();
    } catch (err) {
      document.dispatchEvent(new CustomEvent('toastTrigger', { detail: { msg: 'Error: ' + err.message, isError: true } }));
    }
  };

  const inputCls = "w-full bg-[var(--color-surface-highest)] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors border-[var(--color-surface-highest)] focus:border-[var(--color-primary)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ willChange: 'transform' }}
        className="relative glass border border-[var(--color-primary)] rounded-2xl shadow-neon w-full max-w-4xl flex flex-col md:flex-row overflow-hidden max-h-[85vh]"
      >
        {/* Left Side: Admins List */}
        <div className="w-full md:w-1/2 p-6 flex flex-col border-b md:border-b-0 md:border-r border-white/10 bg-[var(--color-surface-elevated)] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><User size={24} style={{ color: 'var(--color-primary)' }}/> Staff Directory</h2>
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white"><X size={20} /></button>
          </div>
          
          <div className="flex flex-col gap-3">
            {admins.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No staff found.</p>
            ) : admins.map((adm, i) => (
              <div key={i} className="bg-[var(--color-surface-highest)] rounded-xl p-4 border border-white/5 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{adm.full_name || 'Unnamed Admin'}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{adm.role}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{adm.email}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-6 text-center border-t border-white/5 pt-4">
             Note: For security, staff deprovisioning must be authorized through the Supabase Management Console.
          </p>
        </div>

        {/* Right Side: Create Admin Form */}
        <div className="w-full md:w-1/2 p-6 flex flex-col bg-[var(--color-surface-base)] relative overflow-y-auto">
          <button onClick={onClose} className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-white"><X size={20} /></button>
          
          <h2 className="text-xl font-bold mb-2">Create New Admin</h2>
          <p className="text-sm text-gray-400 mb-6">Provision new staff accounts securely.</p>

          {isMasterAdmin ? (
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Full Name</label>
                <input className={inputCls} placeholder="e.g. Jane Doe" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
                <input type="email" className={inputCls} placeholder="e.g. staff@buildex.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Temporary Password</label>
                <input type="text" className={inputCls} placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              {error && <div className="text-xs text-red-400 mt-2 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}
              {success && <div className="text-xs text-[var(--color-cyan)] mt-2 bg-[var(--color-cyan)]/10 p-3 rounded-lg border border-[var(--color-cyan)]/20">{success}</div>}

              <div className="mt-auto pt-6">
                <motion.button
                  onClick={handleCreate}
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                  style={{ background: loading ? 'rgba(99,91,255,0.5)' : 'var(--color-primary)', boxShadow: '0 0 24px rgba(99,91,255,0.35)', willChange: 'transform' }}
                >
                  {loading ? 'Provisioning...' : <><Plus size={18} /> Provision Admin Account</>}
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
                <User size={24} />
              </div>
              <h3 className="font-bold text-white mb-1">Access Restricted</h3>
              <p className="text-xs text-gray-400">Only the master administrator (admin.husain@buildex.com) possesses the clearance to provision new staff nodes.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════╗
   MAIN ADMIN DASHBOARD
╚══════════════════════════════════════════════════════ */
const Activity = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);

const History = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('live');
  const [stats, setStats] = useState({ total_events: 0, total_registrations: 0, scans_today: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [allEventsRegs, setAllEventsRegs] = useState({}); // eventId -> { registered, checkedIn }
  
  const [scannerOpen, setScannerOpen] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [pulse, setPulse] = useState(false);
  const [showScanWave, setShowScanWave] = useState(false);
  const [gridPaused, setGridPaused] = useState(false);
  const [intelligenceOpen, setIntelligenceOpen] = useState(null);

  const [staffOpen, setStaffOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [session, setSession] = useState(null);

  const [torchOn, setTorchOn] = useState(false);
  const toggleTorch = async (enabled) => {
    const track = window.html5QrCode?.getRunningTrack();
    if (track) {
      await track.applyConstraints({ advanced: [{ torch: enabled }] });
      setTorchOn(enabled);
    }
  };

  useEffect(() => {
    const handleToast = (e) => showToast(e.detail.msg, e.detail.isError);
    document.addEventListener('toastTrigger', handleToast);
    return () => document.removeEventListener('toastTrigger', handleToast);
  }, []);

  useEffect(() => { fetchAnalytics(); }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: authListener } = supabase.auth.onAuthStateChange((_, sess) => setSession(sess));
    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const fetchAdmins = async () => {
    const { data } = await supabase.from('profiles').select('id, email, full_name, role').eq('role', 'admin');
    if (data) setAdmins(data);
  };

  useEffect(() => {
    if (staffOpen) fetchAdmins();
  }, [staffOpen]);

  useEffect(() => {
    const el = document.querySelector('.data-flow-bg');
    if (!el) return;
    el.style.animationPlayState = gridPaused ? 'paused' : '';
  }, [gridPaused]);

  const fetchAnalytics = async () => {
    const { data: events } = await supabase.from('events').select('*').order('start_time', { ascending: true });
    const { data: registrations } = await supabase.from('registrations').select('id, event_id, attended, attended_at');

    if (events && registrations) {
      const now = Date.now();
      const upcoming = [], live = [], past = [];
      const regCounts = {};

      // Initialize regCounts
      events.forEach(ev => {
        regCounts[ev.id] = { registered: 0, checkedIn: 0 };
      });

      registrations.forEach(reg => {
        if (regCounts[reg.event_id]) {
          regCounts[reg.event_id].registered++;
          if (reg.attended) regCounts[reg.event_id].checkedIn++;
        }
      });

      events.forEach(ev => {
        const s = new Date(ev.start_time).getTime();
        const e = s + (ev.duration || 60) * 60000;
        
        if (now < s) upcoming.push(ev);
        else if (now >= s && now <= e) live.push(ev);
        else past.push(ev);
      });

      setUpcomingEvents(upcoming);
      setLiveEvents(live);
      setPastEvents(past);
      setAllEventsRegs(regCounts);

      // Scans Today (Calendar Day logic)
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const scansToday = registrations.filter(r => r.attended && r.attended_at && new Date(r.attended_at) >= startOfDay).length;

      setStats({
        total_events: events.length,
        total_registrations: registrations.length,
        scans_today: scansToday
      });
    }
  };

  const triggerSuccess = () => {
    setPulse(true); setTimeout(() => setPulse(false), 500);
    setShowScanWave(true);
    setGridPaused(true); setTimeout(() => setGridPaused(false), 600);
  };

  const handleScanSuccess = async (text, activeScanner) => {
    try {
      const payload = JSON.parse(text);
      if (payload.user_id && payload.event_id) {
        if (activeScanner) await activeScanner.clear();
        setScannerOpen(false);
        if (window.navigator.vibrate) window.navigator.vibrate(50);
        showToast('Scanner success! Updating…');
        const now = new Date().toISOString();
        const { error } = await supabase.from('registrations')
          .update({ attended: true, attended_at: now })
          .match({ user_id: payload.user_id, event_id: payload.event_id });
        if (error) { showToast('Error: ' + error.message, true); }
        else { showToast('Student checked in!'); triggerSuccess(); fetchAnalytics(); }
      }
    } catch { showToast('Invalid QR Format.', true); }
  };

  useEffect(() => {
    let ht5Qrcode = null;
    let timer = null;
    if (scannerOpen) {
      timer = setTimeout(() => {
        try {
          ht5Qrcode = new Html5Qrcode('reader');
          window.html5QrCode = ht5Qrcode;
          const config = { fps: 10, qrbox: { width: 250, height: 250 } };
          ht5Qrcode.start({ facingMode }, config, text => {
            handleScanSuccess(text, ht5Qrcode);
          }, () => {}).catch(err => {
            showToast('Camera Error: ' + err.message, true);
          });
        } catch (e) { showToast('Camera Initialization Error: ' + e.message, true); }
      }, 150);
    }
    return () => { 
      if (timer) clearTimeout(timer); 
      if (ht5Qrcode) {
        try {
          ht5Qrcode.stop().then(() => ht5Qrcode.clear()).catch(() => {});
        } catch (e) {}
      }
    };
  }, [scannerOpen, facingMode]);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    window.location.replace('/role-selection');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-transparent relative">
      <PerspectiveGrid />
      <AuroraOrbs />
      {/* Scan Wave */}
      <AnimatePresence>{showScanWave && <ScanWave onDone={() => setShowScanWave(false)} />}</AnimatePresence>

      {/* Indigo success pulse */}
      <motion.div animate={{ opacity: pulse ? 0.25 : 0 }} transition={{ duration: 0.4 }} className="fixed inset-0 pointer-events-none z-0" style={{ background: '#635BFF' }} />

      <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto relative z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Command Center</h1>
          {liveEvents.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-cyan)] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-cyan)]" /></span>
              <span className="text-xs text-[var(--color-cyan)] font-semibold">{liveEvents.length} live event{liveEvents.length > 1 ? 's' : ''} right now</span>
            </div>
          )}
        </div>
        <motion.button 
          whileTap={{ scale: 0.92, transition: { type: 'spring', stiffness: 400, damping: 10 } }} 
          onClick={handleLogout} 
          className="border border-white/10 bg-white/5 p-2 rounded-full text-gray-400 hover:text-white transition-colors"
          title="Sign Out"
        >
          <LogOut size={18} />
        </motion.button>
      </header>

      {/* Stat Cards */}
      {/* Power Summary Strip */}
      <div className="max-w-6xl mx-auto mb-10 relative z-10">
        <div className="glass glass-border rounded-2xl p-6 flex flex-wrap justify-around items-center gap-6 shadow-neon">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Events</p>
            <p className="text-3xl font-black text-white font-mono-telemetry">{stats.total_events}</p>
          </div>
          <div className="w-px h-10 bg-white/10 hidden md:block" />
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registrations</p>
            <p className="text-3xl font-black text-[var(--color-primary)] font-mono-telemetry">{stats.total_registrations}</p>
          </div>
          <div className="w-px h-10 bg-white/10 hidden md:block" />
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Scans Today</p>
            <p className="text-3xl font-black text-[var(--color-cyan)] font-mono-telemetry">{stats.scans_today}</p>
          </div>
        </div>
      </div>

      {/* 3-Tab Navigator — Spring Physics layoutId */}
      <div className="max-w-6xl mx-auto mb-8 relative z-10">
        <div
          className="flex gap-1 p-1.5 rounded-2xl relative"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {[
            { id: 'upcoming', label: 'Upcoming', icon: Calendar },
            { id: 'live', label: 'In Progress', icon: Activity },
            { id: 'past', label: 'History', icon: History }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 relative transition-colors z-10"
              style={{ color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.35)' }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    boxShadow: '0 0 20px rgba(99,91,255,0.2)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }}
                />
              )}
              <tab.icon size={16} />
              <span className="relative z-10">{tab.label}</span>
              {tab.id === 'live' && liveEvents.length > 0 && (
                <span
                  className="relative z-10 w-2 h-2 rounded-full animate-pulse"
                  style={{ background: 'var(--color-cyan)', boxShadow: '0 0 6px var(--color-cyan)' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Display */}
      <div className="max-w-6xl mx-auto mb-20 relative z-10">
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(ev => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={ev.id} className="glass glass-border rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                <h3 className="text-lg font-bold text-white mb-2">{ev.title}</h3>
                <div className="flex flex-col gap-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2"><Calendar size={14} /> {new Date(ev.start_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  <div className="flex items-center gap-2"><Clock size={14} /> {new Date(ev.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="mt-6 flex justify-between items-center bg-white/5 rounded-lg p-3">
                  <span className="text-xs font-bold text-gray-500 uppercase">Waitlist</span>
                  <span className="text-sm font-bold text-white">{allEventsRegs[ev.id]?.registered || 0}</span>
                </div>
              </motion.div>
            ))}
            {upcomingEvents.length === 0 && <p className="text-gray-500 italic text-center py-10 col-span-full">No upcoming events scheduled.</p>}
          </div>
        )}

        {activeTab === 'live' && (
          <div className="flex flex-col gap-6">
            {liveEvents.map(ev => (
              <BorderBeamCard key={ev.id} variant="admin" className="rounded-3xl">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-cyan)] opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--color-cyan)]" /></span>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-cyan)]">Live Control Room</span>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-6">{ev.title}</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Registered</p>
                        <p className="text-2xl font-black text-white">{allEventsRegs[ev.id]?.registered || 0}</p>
                      </div>
                      <div className="bg-[var(--color-cyan)]/10 rounded-2xl p-4 border border-[var(--color-cyan)]/20">
                        <p className="text-[10px] font-bold text-[var(--color-cyan)] uppercase mb-1">Checked In</p>
                        <p className="text-2xl font-black text-[var(--color-cyan)]">{allEventsRegs[ev.id]?.checkedIn || 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full md:w-64">
                    <MagneticWrapper strength={12} className="w-full">
                      <button onClick={() => setScannerOpen(true)} className="w-full bg-[var(--color-cyan)] hover:opacity-90 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-neon transition-opacity active:scale-95">
                        <Scan size={20} /> Open QR Scanner
                      </button>
                    </MagneticWrapper>
                    <button onClick={() => setIntelligenceOpen(ev)} className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl flex items-center justify-center gap-2 border border-white/10 transition-colors">
                      <Activity size={18} /> Details
                    </button>
                  </div>
                </motion.div>
              </BorderBeamCard>
            ))}
            {liveEvents.length === 0 && (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <Activity size={48} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-500 font-medium">No live events at the moment.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastEvents.map(ev => (
              <div key={ev.id} onClick={() => setIntelligenceOpen(ev)} className="glass glass-border rounded-xl p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group">
                <div>
                  <h3 className="font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">{ev.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{new Date(ev.start_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {allEventsRegs[ev.id]?.checkedIn || 0} Attended</p>
                </div>
                <History className="text-gray-700 group-hover:text-white transition-colors" size={20} />
              </div>
            ))}
            {pastEvents.length === 0 && <p className="text-gray-500 italic text-center py-10 col-span-full">History is currently empty.</p>}
          </div>
        )}
      </div>

      {/* FABs (overlap-safe — scanner on right, schedule on left of scanner) */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-row-reverse items-center gap-4">
        {/* Scanner FAB */}
        <motion.button
          whileTap={{ scaleX: 0.9, scaleY: 0.88, transition: { type: 'spring', stiffness: 500, damping: 16 } }}
          onClick={() => setScannerOpen(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white p-4 rounded-full shadow-neon flex items-center justify-center"
          style={{ willChange: 'transform' }}
          title="Open QR Scanner"
        >
          <Scan size={28} />
        </motion.button>

        {/* Schedule FAB */}
        <motion.button
          whileTap={{ scaleX: 0.9, scaleY: 0.88, transition: { type: 'spring', stiffness: 500, damping: 16 } }}
          onClick={() => setScheduleOpen(true)}
          className="text-white p-4 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(76,215,246,0.15)', border: '1px solid rgba(76,215,246,0.4)', boxShadow: '0 0 20px rgba(76,215,246,0.2)', willChange: 'transform' }}
          title="Schedule New Event"
        >
          <Plus size={28} />
        </motion.button>

        {/* Staff FAB */}
        <motion.button
          whileTap={{ scaleX: 0.9, scaleY: 0.88, transition: { type: 'spring', stiffness: 500, damping: 16 } }}
          onClick={() => setStaffOpen(true)}
          className="text-white p-4 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', boxShadow: '0 0 20px rgba(124,58,237,0.2)', willChange: 'transform' }}
          title="Manage Staff"
        >
          <User size={28} style={{ color: '#7C3AED' }} />
        </motion.button>
      </div>

      {/* Scanner Modal */}
      <AnimatePresence>
        {scannerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setScannerOpen(false)} />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ willChange: 'transform' }}
              className="relative glass border border-[var(--color-primary)] rounded-2xl shadow-neon max-w-lg w-full flex flex-col items-center overflow-hidden h-[85vh] overflow-y-auto"
            >
              <div className="w-full bg-[var(--color-surface-elevated)] p-4 border-b border-white/5 flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-lg font-bold">Scanning Protocol</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')} 
                    className="p-2 rounded-full glass glass-border shadow-neon transition-colors text-[var(--color-cyan)] hover:text-white"
                    title="Flip Camera"
                  >
                    <SwitchCamera size={18} />
                  </button>
                  <button 
                    onClick={() => toggleTorch(!torchOn)} 
                    className={`p-2 rounded-full glass glass-border shadow-neon transition-colors ${torchOn ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-cyan)] hover:text-white'}`}
                  >
                    <Flashlight size={18} />
                  </button>
                  <button onClick={() => setScannerOpen(false)} className="text-gray-400 hover:text-white p-1"><X size={20} /></button>
                </div>
              </div>
              <div className="w-full p-4 bg-white text-black min-h-[300px] relative overflow-hidden">
                <div id="reader" width="100%"></div>
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2.5, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute left-0 w-full h-[2px] bg-[var(--color-primary)] shadow-[0_0_15px_var(--color-primary)] z-10 pointer-events-none"
                />
              </div>
              <div className="w-full bg-[#050505] border-t border-purple-500/50 p-6">
                <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-2">Manual Override</h3>
                <p className="text-xs text-gray-400 mb-3">Input the student payload JSON manually.</p>
                <textarea id="manual-payload" className="w-full bg-zinc-900/90 border border-purple-500/30 rounded-lg p-3 text-sm font-black tracking-widest text-white focus:border-[var(--color-primary)] focus:outline-none min-h-[80px]" placeholder='{"user_id": "...", "event_id": "..."}' />
                <button onClick={() => { const v = document.getElementById('manual-payload').value; if (v) handleScanSuccess(v, null); }} className="w-full mt-3 bg-gray-800 hover:bg-gray-700 py-2 rounded shadow-neon transition-colors font-medium text-sm border border-gray-700">
                  Submit Manual Payload
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Staff Management Modal */}
      <AnimatePresence>
        {staffOpen && (
          <StaffModal
            onClose={() => setStaffOpen(false)}
            session={session}
            admins={admins}
            refreshAdmins={fetchAdmins}
          />
        )}
      </AnimatePresence>

      {/* Event Intelligence Modal */}
      <AnimatePresence>
        {intelligenceOpen && (
          <EventIntelligenceModal
            event={intelligenceOpen}
            onClose={() => setIntelligenceOpen(null)}
          />
        )}
      </AnimatePresence>

      {/* Schedule Event Modal */}
      <AnimatePresence>
        {scheduleOpen && (
          <ScheduleModal
            onClose={() => setScheduleOpen(false)}
            onCreated={() => { triggerSuccess(); fetchAnalytics(); showToast('Event created and scheduled!'); }}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      {toastMessage && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full font-bold shadow-neon transition-all ${toastMessage.isError ? 'bg-red-600 text-white' : 'bg-[var(--color-cyan)] text-black'}`}>
          {toastMessage.text}
        </div>
      )}
    </div>
  );
}
