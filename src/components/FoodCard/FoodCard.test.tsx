import { render, screen } from '@testing-library/react';
import FoodCard from './FoodCard';
import type { IFood } from '@/types/food';

const food: IFood = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Oats',
  calories: 389,
  protein: 17,
  carbs: 66,
  fat: 7,
  servingSize: '100g',
  category: 'grain',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('FoodCard', () => {
  it('renders the food name', () => {
    render(<FoodCard food={food} />);
    expect(screen.getByText('Oats')).toBeInTheDocument();
  });

  it('renders calories', () => {
    render(<FoodCard food={food} />);
    expect(screen.getByText(/389 kcal/)).toBeInTheDocument();
  });

  it('renders the category badge', () => {
    render(<FoodCard food={food} />);
    expect(screen.getByText('grain')).toBeInTheDocument();
  });

  it('renders serving size', () => {
    render(<FoodCard food={food} />);
    expect(screen.getByText(/per 100g/)).toBeInTheDocument();
  });

  it('links to the food detail page', () => {
    render(<FoodCard food={food} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/foods/${food._id}`);
  });

  it('does not render macros section when calories is undefined', () => {
    const minimal: IFood = { ...food, calories: undefined, protein: undefined, carbs: undefined, fat: undefined };
    render(<FoodCard food={minimal} />);
    expect(screen.queryByText(/kcal/)).not.toBeInTheDocument();
  });
});
