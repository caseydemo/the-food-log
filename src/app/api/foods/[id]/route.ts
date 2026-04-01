import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Food from '@/models/Food';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const food = await Food.findById(id);
  if (!food) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(food);
}

export async function PUT(req: NextRequest, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const food = await Food.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!food) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(food);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const food = await Food.findByIdAndDelete(id);
  if (!food) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
