import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactSchema } from '@/lib/validations/contact';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please provide a valid name, email, and message.' },
      { status: 400 },
    );
  }

  await prisma.contactSubmission.create({ data: parsed.data });

  return NextResponse.json({
    message: 'Thanks for reaching out. Your message has been saved for review.',
  });
}
