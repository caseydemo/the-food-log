import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/logs/route';
import { GET as GET_ONE, PUT, DELETE } from '@/app/api/logs/[id]/route';
import Food from '@/models/Food';
import Log from '@/models/Log';

jest.mock('@/lib/db', () => ({ connectDB: jest.fn() }));

let mongod: MongoMemoryServer;
let foodId: string;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  const food = await Food.create({ name: 'Rice' });
  foodId = food._id.toString();
});

afterEach(async () => {
  await Log.deleteMany({});
  await Food.deleteMany({});
});

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('GET /api/logs', () => {
  it('returns an empty array when no logs exist', async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('returns logs with populated food', async () => {
    await Log.create({ food: foodId, quantity: 1 });
    const res = await GET();
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].food.name).toBe('Rice');
  });
});

describe('POST /api/logs', () => {
  it('creates a log and returns 201 with populated food', async () => {
    const req = new NextRequest('http://localhost/api/logs', {
      method: 'POST',
      body: JSON.stringify({ food: foodId, quantity: 2, unit: 'cups' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.quantity).toBe(2);
    expect(data.food.name).toBe('Rice');
  });
});

describe('GET /api/logs/[id]', () => {
  it('returns a log by id with populated food', async () => {
    const log = await Log.create({ food: foodId, quantity: 1 });
    const res = await GET_ONE(new NextRequest('http://localhost'), makeParams(log._id.toString()));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.food.name).toBe('Rice');
  });

  it('returns 404 for unknown id', async () => {
    const res = await GET_ONE(
      new NextRequest('http://localhost'),
      makeParams(new mongoose.Types.ObjectId().toString())
    );
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/logs/[id]', () => {
  it('updates a log and returns the updated doc', async () => {
    const log = await Log.create({ food: foodId, quantity: 1 });
    const req = new NextRequest('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({ quantity: 3, notes: 'big portion' }),
    });
    const res = await PUT(req, makeParams(log._id.toString()));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.quantity).toBe(3);
    expect(data.notes).toBe('big portion');
  });
});

describe('DELETE /api/logs/[id]', () => {
  it('deletes a log and returns success', async () => {
    const log = await Log.create({ food: foodId, quantity: 1 });
    const res = await DELETE(new NextRequest('http://localhost'), makeParams(log._id.toString()));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(await Log.findById(log._id)).toBeNull();
  });
});
