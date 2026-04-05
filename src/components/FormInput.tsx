import React from 'react';
import styles from '../styles/forminput.module.css'; // Stil faylının yolu

interface FormInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  registration?: any; 
  type?: string // dafault olaraq "text" olacaq, amma number, email kimi də ola bilər;
  otherProps?: React.InputHTMLAttributes<HTMLInputElement>; // digər input atributları üçün
}

const FormInput: React.FC<FormInputProps> = ({ label, placeholder, error, registration, type, otherProps }) => {
  return (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <input 
        {...registration} 
        placeholder={placeholder} 
        className={styles.input} 
        type={type}
        {...otherProps}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default FormInput;