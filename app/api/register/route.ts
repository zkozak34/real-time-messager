import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;
    if (!email || !name || !password) {
      return new Response('Missing required fields', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);    
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword
      }
    })
    return NextResponse.json(user);
  } catch (error: any) {
    console.error(error, 'REGISTRATION_ERROR');
    return new NextResponse(error?.message ?? 'An error occurred', { status: 500 });
  }
}