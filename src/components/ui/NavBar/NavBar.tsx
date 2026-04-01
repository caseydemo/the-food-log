'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './NavBar.module.css';

const NAV_ITEMS = [
  { href: '/',       label: 'Today' },
  { href: '/logs',   label: 'Logs'  },
  { href: '/foods',  label: 'Foods' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${styles.link} ${pathname === href ? styles.active : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
