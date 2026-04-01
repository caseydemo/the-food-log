import { render, screen } from '@testing-library/react';
import LogEntry from './LogEntry';
import type { ILog } from '@/types/log';
import type { IFood } from '@/types/food';

const food: IFood = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Chicken Breast',
  calories: 165,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const log: ILog = {
  _id: '507f1f77bcf86cd799439012',
  food,
  quantity: 2,
  unit: 'servings',
  notes: 'post workout',
  loggedAt: new Date('2024-01-15T12:30:00').toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('LogEntry', () => {
  it('renders the food name', () => {
    render(<LogEntry log={log} />);
    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
  });

  it('renders the quantity and unit', () => {
    render(<LogEntry log={log} />);
    expect(screen.getByText('2 servings')).toBeInTheDocument();
  });

  it('renders the notes', () => {
    render(<LogEntry log={log} />);
    expect(screen.getByText('post workout')).toBeInTheDocument();
  });

  it('renders calculated calories', () => {
    render(<LogEntry log={log} />);
    expect(screen.getByText('330 kcal')).toBeInTheDocument();
  });

  it('links to the log detail page', () => {
    render(<LogEntry log={log} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/logs/${log._id}`);
  });

  it('does not render calories when food has no calorie data', () => {
    const noCalFood: IFood = { ...food, calories: undefined };
    render(<LogEntry log={{ ...log, food: noCalFood }} />);
    expect(screen.queryByText(/kcal/)).not.toBeInTheDocument();
  });
});
