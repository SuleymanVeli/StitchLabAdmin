import React from 'react';
import styles from '../styles/forminput.module.css'; // Stil faylının yolu

interface FormInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  registration?: any; 
  otherProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

const FormTextArea: React.FC<FormInputProps> = ({ label, placeholder, error, registration, otherProps }) => {
  return (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <textarea 
        {...registration} 
        placeholder={placeholder} 
        className={styles.input} 
        {...otherProps}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default FormTextArea;