import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Log from '@/models/Log';

export async function GET() {
  await connectDB();
  const logs = await Log.find().populate('food').sort({ loggedAt: -1 });
  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const log = await Log.create(body);
  await log.populate('food');
  return NextResponse.json(log, { status: 201 });
}
