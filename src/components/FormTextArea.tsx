import React from 'react';
import styles from '../styles/forminput.module.css'; // Stil faylının yolu

interface FormInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  registration: any; 
}

const FormTextArea: React.FC<FormInputProps> = ({ label, placeholder, error, registration }) => {
  return (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <textarea 
        {...registration} 
        placeholder={placeholder} 
        className={styles.input} 
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default FormTextArea;