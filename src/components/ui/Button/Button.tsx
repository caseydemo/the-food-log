'use client';

import styles from './Button.module.css';

type Variant = 'primary' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`${styles.btn} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
