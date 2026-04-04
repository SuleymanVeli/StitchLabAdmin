import React from 'react';
import styles from '../styles/loading.module.css';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen, message = "Yüklənir..." }) => {
  return (
    <div className={`${styles.loaderWrapper} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.stitchContainer}>
        {/* Toxuma ilgəyi effekti verən dairələr */}
        <div className={styles.ball}></div>
        <div className={styles.hook}></div>
      </div>
      {message && <p className={styles.text}>{message}</p>}
    </div>
  );
};

export default Loading;