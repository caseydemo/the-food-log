import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Food from '@/models/Food';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Food.deleteMany({});
});

describe('Food model', () => {
  it('creates a valid food with required fields', async () => {
    const food = await Food.create({ name: 'Chicken Breast' });
    expect(food._id).toBeDefined();
    expect(food.name).toBe('Chicken Breast');
    expect(food.createdAt).toBeDefined();
    expect(food.updatedAt).toBeDefined();
  });

  it('creates a food with all optional fields', async () => {
    const food = await Food.create({
      name: 'Oats',
      description: 'Rolled oats',
      calories: 389,
      protein: 17,
      carbs: 66,
      fat: 7,
      servingSize: '100g',
      category: 'grain',
    });
    expect(food.calories).toBe(389);
    expect(food.protein).toBe(17);
    expect(food.category).toBe('grain');
  });

  it('fails validation when name is missing', async () => {
    await expect(Food.create({ calories: 100 })).rejects.toThrow(/name/);
  });

  it('rejects negative calories', async () => {
    await expect(Food.create({ name: 'Bad Food', calories: -1 })).rejects.toThrow();
  });

  it('rejects negative macros', async () => {
    await expect(Food.create({ name: 'Bad Food', protein: -5 })).rejects.toThrow();
  });

  it('trims whitespace from name', async () => {
    const food = await Food.create({ name: '  Apple  ' });
    expect(food.name).toBe('Apple');
  });
});
