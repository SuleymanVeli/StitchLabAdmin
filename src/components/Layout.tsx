import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/admin.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const navLinks = [
    { name: 'Məhsullar', path: '/products' },
    { name: 'Notlar', path: '/notes' },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>ADMIN PANEL</h2>
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
          <span>Xoş gəldiniz, Admin</span>
          <button className={styles.logoutBtn}>Çıxış</button>
        </header>
        <div className={styles.pageBody}>
          {children}
        </div>
      </main>
    </div>
  );
}