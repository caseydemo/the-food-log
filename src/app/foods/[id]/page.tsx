import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Food from '@/models/Food';
import styles from './page.module.css';

export default async function FoodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const food = await Food.findById(id).lean();
  if (!food) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/foods" className={styles.back}>← Foods</Link>
        <Link href={`/foods/${id}/edit`} className={styles.editBtn}>Edit</Link>
      </div>

      <h1 className={styles.name}>{food.name}</h1>
      {food.category && <span className={styles.category}>{food.category}</span>}
      {food.description && <p className={styles.description}>{food.description}</p>}

      {food.servingSize && (
        <p className={styles.serving}>Per serving: {food.servingSize}</p>
      )}

      <div className={styles.macros}>
        {food.calories != null && <div className={styles.macro}><span className={styles.value}>{food.calories}</span><span className={styles.label}>kcal</span></div>}
        {food.protein != null && <div className={styles.macro}><span className={styles.value}>{food.protein}g</span><span className={styles.label}>protein</span></div>}
        {food.carbs != null && <div className={styles.macro}><span className={styles.value}>{food.carbs}g</span><span className={styles.label}>carbs</span></div>}
        {food.fat != null && <div className={styles.macro}><span className={styles.value}>{food.fat}g</span><span className={styles.label}>fat</span></div>}
      </div>

      <Link href={`/logs/new?food=${id}`} className={styles.logBtn}>Log this food</Link>
    </div>
  );
}
