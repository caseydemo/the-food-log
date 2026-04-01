'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './page.module.css';

export default function NewFoodPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(
      [...form.entries()].filter(([, v]) => v !== '').map(([k, v]) => [
        k,
        ['calories', 'protein', 'carbs', 'fat'].includes(k) ? Number(v) : v,
      ])
    );

    const res = await fetch('/api/foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (!res.ok) { setError('Failed to save food.'); return; }
    router.push('/foods');
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>New Food</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="Name" name="name" required />
        <Input label="Description" name="description" />
        <Input label="Category" name="category" placeholder="e.g. protein, grain, vegetable" />
        <Input label="Serving Size" name="servingSize" placeholder='e.g. 100g, 1 cup' />
        <div className={styles.macros}>
          <Input label="Calories" name="calories" type="number" min="0" />
          <Input label="Protein (g)" name="protein" type="number" min="0" />
          <Input label="Carbs (g)" name="carbs" type="number" min="0" />
          <Input label="Fat (g)" name="fat" type="number" min="0" />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save Food'}</Button>
      </form>
    </div>
  );
}
