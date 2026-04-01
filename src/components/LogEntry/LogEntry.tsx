import Link from 'next/link';
import type { ILog } from '@/types/log';
import type { IFood } from '@/types/food';
import styles from './LogEntry.module.css';

interface LogEntryProps {
  log: ILog;
}

export default function LogEntry({ log }: LogEntryProps) {
  const food = log.food as IFood;
  const date = new Date(log.loggedAt);

  return (
    <Link href={`/logs/${log._id}`} className={styles.entry}>
      <div className={styles.time}>
        <span className={styles.hour}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span className={styles.date}>{date.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
      </div>
      <div className={styles.info}>
        <span className={styles.foodName}>{food.name}</span>
        <span className={styles.quantity}>
          {log.quantity}{log.unit ? ` ${log.unit}` : ''}
        </span>
        {log.notes && <p className={styles.notes}>{log.notes}</p>}
      </div>
      {food.calories != null && (
        <span className={styles.calories}>{Math.round(food.calories * log.quantity)} kcal</span>
      )}
    </Link>
  );
}
