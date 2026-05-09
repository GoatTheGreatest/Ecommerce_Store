import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Inquiry from '../../../../models/Inquiry';

export async function PATCH(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  try {
    await dbConnect();
    const body = await request.json();
    const inquiry = await Inquiry.findByIdAndUpdate(params.id, body, { new: true });
    if (!inquiry) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
