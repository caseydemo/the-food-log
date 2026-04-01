import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Food from '@/models/Food';
import FoodCard from '@/components/FoodCard/FoodCard';
import type { IFood } from '@/types/food';
import styles from './page.module.css';

export default async function FoodsPage() {
  await connectDB();
  const foods = await Food.find().sort({ name: 1 }).lean();

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Foods</h1>
        <Link href="/foods/new" className={styles.addBtn}>+ New food</Link>
      </div>

      {foods.length === 0 ? (
        <p className={styles.empty}>No foods yet. Add one to get started.</p>
      ) : (
        <ul className={styles.list}>
          {foods.map((food) => (
            <li key={String(food._id)}>
              <FoodCard food={food as unknown as IFood} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
