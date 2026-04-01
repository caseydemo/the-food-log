'use client';

import { useRouter } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import type { ILog } from '@/types/log';
import type { IFood } from '@/types/food';
import styles from '../../new/page.module.css';
import deleteStyles from '../../../foods/[id]/edit/delete.module.css';

export default function EditLogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [log, setLog] = useState<ILog | null>(null);
  const [foods, setFoods] = useState<IFood[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/logs/${id}`).then(r => r.json()),
      fetch('/api/foods').then(r => r.json()),
    ]).then(([logData, foodsData]) => {
      setLog(logData);
      setFoods(foodsData);
    });
  }, [id]);

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

    const res = await fetch(`/api/logs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (!res.ok) { setError('Failed to save.'); return; }
    router.push(`/logs/${id}`);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('Delete this log entry?')) return;
    await fetch(`/api/logs/${id}`, { method: 'DELETE' });
    router.push('/logs');
    router.refresh();
  }

  if (!log) return <p>Loading…</p>;

  const currentFoodId = typeof log.food === 'string' ? log.food : (log.food as IFood)._id;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit Log</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="food">Food</label>
          <select id="food" name="food" required defaultValue={currentFoodId} className={styles.select}>
            <option value="">Select a food…</option>
            {foods.map(f => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>
        </div>
        <Input label="Quantity" name="quantity" type="number" min="0" step="0.1" required defaultValue={log.quantity} />
        <Input label="Unit" name="unit" defaultValue={log.unit} />
        <Input label="Notes" name="notes" defaultValue={log.notes} />
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</Button>
      </form>
      <div className={deleteStyles.danger}>
        <Button variant="danger" type="button" onClick={handleDelete}>Delete Log Entry</Button>
      </div>
    </div>
  );
}
