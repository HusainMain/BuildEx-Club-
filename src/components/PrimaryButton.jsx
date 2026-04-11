import './PrimaryButton.css';

export default function PrimaryButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',  // primary | secondary | danger | ghost
  size = 'md',          // sm | md | lg
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        pbt
        pbt-${variant}
        pbt-${size}
        ${fullWidth ? 'pbt-full' : ''}
        ${loading ? 'pbt-loading' : ''}
        ${className}
      `.trim()}
    >
      {loading ? (
        <span className="pbt-spinner" />
      ) : (
        <>
          {icon && <span className="pbt-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
