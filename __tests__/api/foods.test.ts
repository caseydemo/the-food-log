import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/foods/route';
import { GET as GET_ONE, PUT, DELETE } from '@/app/api/foods/[id]/route';
import Food from '@/models/Food';

jest.mock('@/lib/db', () => ({ connectDB: jest.fn() }));

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

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('GET /api/foods', () => {
  it('returns an empty array when no foods exist', async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('returns all foods sorted by createdAt desc', async () => {
    await Food.create({ name: 'Apple' });
    await Food.create({ name: 'Banana' });
    const res = await GET();
    const data = await res.json();
    expect(data).toHaveLength(2);
    expect(data[0].name).toBe('Banana');
  });
});

describe('POST /api/foods', () => {
  it('creates a new food and returns 201', async () => {
    const req = new NextRequest('http://localhost/api/foods', {
      method: 'POST',
      body: JSON.stringify({ name: 'Salmon', calories: 208 }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.name).toBe('Salmon');
    expect(data.calories).toBe(208);
  });

  it('returns 500 on invalid data', async () => {
    const req = new NextRequest('http://localhost/api/foods', {
      method: 'POST',
      body: JSON.stringify({ calories: 100 }), // missing name
    });
    await expect(POST(req)).rejects.toThrow();
  });
});

describe('GET /api/foods/[id]', () => {
  it('returns a food by id', async () => {
    const food = await Food.create({ name: 'Egg' });
    const res = await GET_ONE(new NextRequest('http://localhost'), makeParams(food._id.toString()));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.name).toBe('Egg');
  });

  it('returns 404 for unknown id', async () => {
    const res = await GET_ONE(
      new NextRequest('http://localhost'),
      makeParams(new mongoose.Types.ObjectId().toString())
    );
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/foods/[id]', () => {
  it('updates a food and returns the updated doc', async () => {
    const food = await Food.create({ name: 'Oats', calories: 380 });
    const req = new NextRequest('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({ calories: 389 }),
    });
    const res = await PUT(req, makeParams(food._id.toString()));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.calories).toBe(389);
  });

  it('returns 404 for unknown id', async () => {
    const req = new NextRequest('http://localhost', {
      method: 'PUT',
      body: JSON.stringify({ name: 'X' }),
    });
    const res = await PUT(req, makeParams(new mongoose.Types.ObjectId().toString()));
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/foods/[id]', () => {
  it('deletes a food and returns success', async () => {
    const food = await Food.create({ name: 'Broccoli' });
    const res = await DELETE(new NextRequest('http://localhost'), makeParams(food._id.toString()));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(await Food.findById(food._id)).toBeNull();
  });

  it('returns 404 for unknown id', async () => {
    const res = await DELETE(
      new NextRequest('http://localhost'),
      makeParams(new mongoose.Types.ObjectId().toString())
    );
    expect(res.status).toBe(404);
  });
});
