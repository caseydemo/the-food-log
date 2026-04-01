import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Food from '@/models/Food';
import Log from '@/models/Log';

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
  await Log.deleteMany({});
  await Food.deleteMany({});
});

describe('Log model', () => {
  it('creates a valid log entry', async () => {
    const food = await Food.create({ name: 'Rice' });
    const log = await Log.create({ food: food._id, quantity: 1 });
    expect(log._id).toBeDefined();
    expect(log.food.toString()).toBe(food._id.toString());
    expect(log.quantity).toBe(1);
    expect(log.loggedAt).toBeDefined();
  });

  it('defaults loggedAt to now', async () => {
    const food = await Food.create({ name: 'Rice' });
    const before = Date.now();
    const log = await Log.create({ food: food._id, quantity: 1 });
    const after = Date.now();
    expect(log.loggedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(log.loggedAt.getTime()).toBeLessThanOrEqual(after);
  });

  it('creates a log with all optional fields', async () => {
    const food = await Food.create({ name: 'Rice' });
    const log = await Log.create({
      food: food._id,
      quantity: 2,
      unit: 'cups',
      notes: 'with dinner',
    });
    expect(log.unit).toBe('cups');
    expect(log.notes).toBe('with dinner');
  });

  it('fails validation when food is missing', async () => {
    await expect(Log.create({ quantity: 1 })).rejects.toThrow(/food/);
  });

  it('fails validation when quantity is missing', async () => {
    const food = await Food.create({ name: 'Rice' });
    await expect(Log.create({ food: food._id })).rejects.toThrow(/quantity/);
  });

  it('rejects negative quantity', async () => {
    const food = await Food.create({ name: 'Rice' });
    await expect(Log.create({ food: food._id, quantity: -1 })).rejects.toThrow();
  });

  it('populates food reference', async () => {
    const food = await Food.create({ name: 'Salmon' });
    await Log.create({ food: food._id, quantity: 1 });
    const log = await Log.findOne().populate('food');
    expect((log!.food as InstanceType<typeof Food>).name).toBe('Salmon');
  });
});
