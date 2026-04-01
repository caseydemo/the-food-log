import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Log from '@/models/Log';
import type { IFood } from '@/types/food';
import styles from './page.module.css';

export default async function LogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const log = await Log.findById(id).populate('food').lean();
  if (!log) notFound();

  const food = log.food as unknown as IFood;
  const date = new Date(log.loggedAt as Date);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/logs" className={styles.back}>← Logs</Link>
        <Link href={`/logs/${id}/edit`} className={styles.editBtn}>Edit</Link>
      </div>

      <h1 className={styles.foodName}>{food.name}</h1>
      <p className={styles.time}>{date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>

      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Quantity</span>
          <span className={styles.detailValue}>{log.quantity}{log.unit ? ` ${log.unit}` : ''}</span>
        </div>
        {food.calories != null && (
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Calories</span>
            <span className={styles.detailValue}>{Math.round(food.calories * log.quantity)} kcal</span>
          </div>
        )}
      </div>

      {log.notes && <p className={styles.notes}>{log.notes}</p>}

      <Link href={`/foods/${food._id}`} className={styles.foodLink}>View {food.name} →</Link>
    </div>
  );
}
