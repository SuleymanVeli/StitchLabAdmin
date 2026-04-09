"use client";

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '@/styles/notedetail.module.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NoteDetail() {
  const params = useParams();
  const id = params?.id;
  
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNote = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/notes?id=${id}`);
        if (!res.ok) {
          throw new Error("Qeyd tapılmadı.");
        }
        const data = await res.json();
        setNote(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingText}>Yüklənir...</div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className={styles.container}>
        <div className={styles.errorText}>Xəta: {error || "Məlumat tapılmadı"}</div>
        <Link href="/notes" className={styles.backLink}>← Geri qayıt</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/notes" className={styles.backLink}>
        ← Siyahıya qayıt
      </Link>

      <div className={styles.detailHeader}>
        <span className={styles.badge}>
          {note.path ? note.path.split('/').join(' > ') : 'Root'}
        </span>
        <h1 className={styles.title}>{note.title}</h1>
        <p className={styles.date}>
          Son yenilənmə: {new Date(note.updatedAt).toLocaleDateString('az-AZ')}
        </p>
      </div>

      <div className={styles.contentArea}>
        <article>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}