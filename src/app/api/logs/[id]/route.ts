import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Log from '@/models/Log';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const log = await Log.findById(id).populate('food');
  if (!log) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(log);
}

export async function PUT(req: NextRequest, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const log = await Log.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate('food');
  if (!log) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(log);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  await connectDB();
  const { id } = await params;
  const log = await Log.findByIdAndDelete(id);
  if (!log) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
