import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Log from '@/models/Log';
import LogEntry from '@/components/LogEntry/LogEntry';
import type { ILog } from '@/types/log';
import styles from './page.module.css';

export default async function DashboardPage() {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logs = await Log.find({ loggedAt: { $gte: today } })
    .populate('food')
    .sort({ loggedAt: -1 })
    .lean();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Today</h1>
        <Link href="/logs/new" className={styles.addBtn}>+ Log food</Link>
      </div>

      {logs.length === 0 ? (
        <p className={styles.empty}>Nothing logged yet today.</p>
      ) : (
        <ul className={styles.list}>
          {logs.map((log) => (
            <li key={String(log._id)}>
              <LogEntry log={log as unknown as ILog} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
