import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Log from '@/models/Log';
import LogEntry from '@/components/LogEntry/LogEntry';
import type { ILog } from '@/types/log';
import styles from './page.module.css';

export default async function LogsPage() {
  await connectDB();
  const logs = await Log.find().populate('food').sort({ loggedAt: -1 }).lean();

  // Group by date
  const groups = logs.reduce<Record<string, typeof logs>>((acc, log) => {
    const key = new Date(log.loggedAt as Date).toLocaleDateString([], {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    (acc[key] ??= []).push(log);
    return acc;
  }, {});

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Log History</h1>
        <Link href="/logs/new" className={styles.addBtn}>+ Log food</Link>
      </div>

      {Object.keys(groups).length === 0 ? (
        <p className={styles.empty}>No logs yet.</p>
      ) : (
        Object.entries(groups).map(([date, entries]) => (
          <section key={date} className={styles.group}>
            <h2 className={styles.dateHeading}>{date}</h2>
            <ul className={styles.list}>
              {entries.map((log) => (
                <li key={String(log._id)}>
                  <LogEntry log={log as unknown as ILog} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
