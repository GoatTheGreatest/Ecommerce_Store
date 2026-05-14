import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Inquiry from '../../../../models/Inquiry';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  try {
    await dbConnect();
    const body = await request.json();
    const inquiry = await Inquiry.findByIdAndUpdate(params.id, body, { returnDocument: 'after' });
    if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  try {
    await dbConnect();
    const body = await request.json();
    const { sender, text, senderName } = body;

    if (!sender || !text || !senderName) {
      return NextResponse.json({ error: 'sender, text, and senderName are required' }, { status: 400 });
    }

    const updateFields = {
      $push: { replies: { sender, text, senderName } }
    };
    if (sender === 'admin') {
      updateFields.isUserRead = false;
    } else {
      updateFields.isRead = false;
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      params.id,
      updateFields,
      { returnDocument: 'after' }
    );

    if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  try {
    await dbConnect();
    const inquiry = await Inquiry.findById(params.id);
    if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
