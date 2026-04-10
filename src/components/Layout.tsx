import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/admin.module.css';
import { useState, useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Link dəyişəndə avtomatik menyunu bağla
  useEffect(() => {
    setSidebarOpen(false);
  }, [router.pathname]);

  const navLinks = [
    { name: 'Məhsullar', path: '/products' },
    { name: 'Notlar', path: '/notes' },
  ];

  return (
    <div className={styles.container}>
      {/* Mobil üçün Overlay */}
      {isSidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <h2>ADMIN PANEL</h2>
          <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        <nav className={styles.nav}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path} 
                  className={router.pathname === link.path ? styles.activeLink : ''}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          {/* Burger Menu Button */}
          <button className={styles.burgerBtn} onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          
          <span className={styles.userName}>Xoş gəldiniz, Admin</span>
          <button className={styles.logoutBtn}>Çıxış</button>
        </header>
        <div className={styles.pageBody}>
          {children}
        </div>
      </main>
    </div>
  );
}