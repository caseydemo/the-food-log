import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>{label}</label>
      <input id={inputId} className={`${styles.input} ${error ? styles.inputError : ''}`} {...props} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
