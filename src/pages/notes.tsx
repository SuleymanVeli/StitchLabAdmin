"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import styles from '@/styles/notes.module.css';

export default function NoteList() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notes');
        if (res.ok) {
          const data = await res.json();
          setNotes(data);
        }
      } catch (error) {
        console.error("Xəta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // 1. "Flat" siyahını "Tree" strukturuna çevirən funksiya
  const buildTree = (notes: any[]) => {
    const tree: any = {};

    notes.forEach((note) => {
      const parts = note.path ? note.path.split('/') : [];
      let current = tree;

      parts.forEach((part) => {
        if (!current[part]) {
          current[part] = { _isFolder: true, children: {} };
        }
        current = current[part].children;
      });

      // Faylı ən son qovluğun altına yerləşdiririk
      const noteId = note._id;
      current[noteId] = { ...note, _isFolder: false };
    });

    return tree;
  };

  const noteTree = useMemo(() => buildTree(notes), [notes]);

  // 2. Rekursiv render funksiyası
  const renderTree = (node: any, name: string = "Root") => {
    const entries = Object.entries(node);

    return entries.map(([key, value]: [string, any]) => {
      if (value._isFolder) {
        return (
          <details key={key} className={styles.folderWrapper} open>
            <summary className={styles.folderName}>
              <span className={styles.icon}>📁</span> {key}
            </summary>
            <div className={styles.folderContent}>
              {renderTree(value.children, key)}
            </div>
          </details>
        );
      } else {
        // Fayl (Note) renderi
        return (
          <div key={value._id} className={styles.card}>
            <div className={styles.noteInfo}>
              <span className={styles.icon}>📄</span>
              <h2 className={styles.title}>{value.title}</h2>
            </div>
            <div className={styles.actions}>
              <Link href={`/notesform?id=${value._id}`} className={styles.editLink}>
                Düzəliş
              </Link>
              <Link href={`/notes/${value._id}`} className={styles.viewButton}>
                Bax
              </Link>
            </div>
          </div>
        );
      }
    });
  };

  if (loading) return <div className={styles.container}>Yüklənir...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Notlar</h1>
        <Link href="/notesform" className={styles.addButton}>+ Yeni Not</Link>
      </div>

      <div className={styles.list}>
        {notes.length === 0 ? (
          <p className={styles.emptyState}>Hələ heç bir qeyd yoxdur.</p>
        ) : (
          renderTree(noteTree)
        )}
      </div>
    </div>
  );
}