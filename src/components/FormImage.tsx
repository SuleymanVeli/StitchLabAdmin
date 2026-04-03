import React from 'react';
import styles from '../styles/formimage.module.css';

interface FormImageProps {
  label?: string;
  placeholder?: string;
  error?: string;
  registration: any;
  value: string; // Cari URL dəyəri
  onRemove: () => void; // X-ə basanda URL-i silmək üçün funksiya
}

const FormImage: React.FC<FormImageProps> = ({ 
  label, 
  placeholder, 
  error, 
  registration, 
  value, 
  onRemove 
}) => {
  // URL-in dolu və düzgün formatda olub-olmadığını yoxlayırıq
  const isValidUrl = value && (value.startsWith('http://') || value.startsWith('https://'));

  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.inputWrapper}>
        {isValidUrl ? (
          <div className={styles.previewContainer}>
            <img src={value} alt="Preview" className={styles.previewImage} />
            <button 
              type="button" 
              onClick={onRemove} 
              className={styles.removeBadge}
              title="Şəkli sil"
            >
              ✕
            </button>
          </div>
        ) : (
          <input 
            {...registration} 
            placeholder={placeholder || "Şəkil URL-i əlavə edin..."} 
            className={styles.input} 
          />
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default FormImage;