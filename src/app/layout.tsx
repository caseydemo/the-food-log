import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import styles from './layout.module.css';
import NavBar from '@/components/ui/NavBar/NavBar';

export const metadata: Metadata = {
  title: 'the-food-log',
  description: 'Track what you eat, simply.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className={styles.appShell}>
            <main className={styles.main}>
              <div className="container">{children}</div>
            </main>
            <NavBar />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
