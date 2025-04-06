// app/api/set-role/route.ts
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json();
    
    if (!userId || !['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Role Update Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}