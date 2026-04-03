import React from 'react';
import styles from '../styles/button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  leftIcon, 
  className, 
  ...props 
}: ButtonProps) {
  
  const buttonClass = `
    ${styles.btn} 
    ${styles[variant]} 
    ${styles[size]} 
    ${className || ''}
  `.trim();

  return (
    <button className={buttonClass} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <span className={styles.loader}></span>
      ) : (
        <>
          {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
          {children}
        </>
      )}
    </button>
  );
}