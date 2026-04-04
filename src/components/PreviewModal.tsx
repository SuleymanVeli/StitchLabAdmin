import React from 'react';
import styles from '../styles/preview.module.css';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.phoneContainer} onClick={(e) => e.stopPropagation()}>
                {/* Telefonun Üst Hissəsi (Notch) */}
               

                {/* Canlı Məzmun */}
                <div className={styles.content}>
                    <img
                        src={data.images?.large || '/placeholder.png'}
                        className={styles.heroImage}
                        alt="Hero"
                    />

                    <div className={styles.body}>
                        <div className={styles.headerInfo}>
                            <h1 className={styles.title}>{data.title || "Adsız Layihə"}</h1>
                            <p className={styles.description}>{data.description}</p>
                            <span className={styles.badge}>{data.difficulty || "Asan"}</span>
                            {data.isPro && <span className={styles.proBadge}>PRO</span>}
                        </div>

                        <div className={styles.card}>
                            <h3>Hazırlıq</h3>
                            <div className={styles.prepRow}>🧶 {data.preparation?.main?.yarn}</div>
                            <div className={styles.prepRow}>📍 {data.preparation?.main?.hook}</div>
                        </div>

                        <div className={styles.sectionTitle}>Digər</div>
                        <ul className={styles.extrasList}>
                            {data.preparation?.extras?.map((ex: any, i: number) => (
                                <li key={i}>{ex}</li>
                            ))}
                        </ul>

                        {data.sections?.map((section: any, sIdx: number) => (
                            <div key={sIdx} className={styles.patternSection}>
                                <div className={styles.parcaCard}>
                                    <img src={section.sectionImage} alt="" />
                                    <span>{section.name}</span>
                                </div>

                                {section.content?.map((item: any, cIdx: number) => (
                                    <div key={cIdx} className={styles.contentItem}>

                                        {/* 1. Addım (Step) və ya Düz Mətn (Text) Bloku */}
                                        {(item.type === 'step' || item.type === 'text') && (
                                            <div className={`${styles.stepBox} ${item.type === 'text' ? styles.plainText : ''}`}>
                                                {item.type === 'step' && (
                                                    <div className={styles.stepNum}>{item.step}</div>
                                                )}
                                                <p className={styles.stepText}>{item.text}</p>
                                            </div>
                                        )}

                                        {/* 2. Şəkil Bloku */}
                                        {item.type === 'image' && item.images && item.images.length > 0 && (
                                            <div className={styles.imageGrid}>
                                                {item.images.map((imgUrl: string, imgIdx: number) => (
                                                    <img
                                                        key={imgIdx}
                                                        src={imgUrl}
                                                        alt={`Step image ${imgIdx}`}
                                                        className={styles.stepImage}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <button className={styles.closeBtn} onClick={onClose}>Bağla</button>
            </div>
        </div>
    );
};

export default PreviewModal;