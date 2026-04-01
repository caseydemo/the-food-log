import Link from 'next/link';
import type { IFood } from '@/types/food';
import styles from './FoodCard.module.css';

interface FoodCardProps {
  food: IFood;
}

export default function FoodCard({ food }: FoodCardProps) {
  return (
    <Link href={`/foods/${food._id}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.name}>{food.name}</span>
        {food.category && <span className={styles.category}>{food.category}</span>}
      </div>
      {food.calories != null && (
        <div className={styles.macros}>
          <span>{food.calories} kcal</span>
          {food.protein != null && <span>{food.protein}g protein</span>}
          {food.carbs != null && <span>{food.carbs}g carbs</span>}
          {food.fat != null && <span>{food.fat}g fat</span>}
        </div>
      )}
      {food.servingSize && <p className={styles.serving}>per {food.servingSize}</p>}
    </Link>
  );
}
