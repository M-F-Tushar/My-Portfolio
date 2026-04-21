import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactSchema } from '@/lib/validations/contact';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (body && typeof body === 'object' && 'company' in body && body.company) {
    return NextResponse.json({
      message: 'Thanks for reaching out. Your message has been saved for review.',
    });
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please provide a valid name, email, and message.' },
      { status: 400 },
    );
  }

  try {
    await prisma.contactSubmission.create({ data: parsed.data });
  } catch (error) {
    console.error('Contact submission save failed:', error);
    return NextResponse.json(
      { error: 'Message could not be saved right now. Please try again soon.' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: 'Thanks for reaching out. Your message has been saved for review.',
  });
}
