'use client';

import { useRouter } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import type { IFood } from '@/types/food';
import styles from '../../new/page.module.css';
import deleteStyles from './delete.module.css';

export default function EditFoodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [food, setFood] = useState<IFood | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/foods/${id}`).then(r => r.json()).then(setFood);
  }, [id]);

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

    const res = await fetch(`/api/foods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (!res.ok) { setError('Failed to save.'); return; }
    router.push(`/foods/${id}`);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('Delete this food?')) return;
    await fetch(`/api/foods/${id}`, { method: 'DELETE' });
    router.push('/foods');
    router.refresh();
  }

  if (!food) return <p>Loading…</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit Food</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="Name" name="name" required defaultValue={food.name} />
        <Input label="Description" name="description" defaultValue={food.description} />
        <Input label="Category" name="category" defaultValue={food.category} />
        <Input label="Serving Size" name="servingSize" defaultValue={food.servingSize} />
        <div className={styles.macros}>
          <Input label="Calories" name="calories" type="number" min="0" defaultValue={food.calories} />
          <Input label="Protein (g)" name="protein" type="number" min="0" defaultValue={food.protein} />
          <Input label="Carbs (g)" name="carbs" type="number" min="0" defaultValue={food.carbs} />
          <Input label="Fat (g)" name="fat" type="number" min="0" defaultValue={food.fat} />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</Button>
      </form>
      <div className={deleteStyles.danger}>
        <Button variant="danger" type="button" onClick={handleDelete}>Delete Food</Button>
      </div>
    </div>
  );
}
