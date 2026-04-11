import './GlassCard.css';

export default function GlassCard({ children, className = '', hover = true, glow = false, style = {} }) {
  return (
    <div
      className={`glass-card ${hover ? 'glass-card-hover' : ''} ${glow ? 'glass-card-glow' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
