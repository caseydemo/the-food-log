'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import type { IFood } from '@/types/food';
import styles from './page.module.css';

function NewLogForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedFood = searchParams.get('food') ?? '';

  const [foods, setFoods] = useState<IFood[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/foods').then(r => r.json()).then(setFoods);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(
      [...form.entries()].filter(([, v]) => v !== '').map(([k, v]) => [
        k,
        k === 'quantity' ? Number(v) : v,
      ])
    );

    const res = await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (!res.ok) { setError('Failed to save log.'); return; }
    router.push('/');
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Log Food</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="food">Food</label>
          <select id="food" name="food" required defaultValue={preselectedFood} className={styles.select}>
            <option value="">Select a food…</option>
            {foods.map(f => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>
        </div>
        <Input label="Quantity" name="quantity" type="number" min="0" step="0.1" required defaultValue="1" />
        <Input label="Unit" name="unit" placeholder='e.g. servings, grams, cups' />
        <Input label="Notes" name="notes" />
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Log Food'}</Button>
      </form>
    </div>
  );
}

export default function NewLogPage() {
  return (
    <Suspense>
      <NewLogForm />
    </Suspense>
  );
}
