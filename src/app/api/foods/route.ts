import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Food from '@/models/Food';

export async function GET() {
  await connectDB();
  const foods = await Food.find().sort({ createdAt: -1 });
  return NextResponse.json(foods);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const food = await Food.create(body);
  return NextResponse.json(food, { status: 201 });
}
