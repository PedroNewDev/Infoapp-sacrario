import './Button.css';

export default function Button({ children, onClick, variant = 'primary', disabled, fullWidth, type = 'button' }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${fullWidth ? 'btn--full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
