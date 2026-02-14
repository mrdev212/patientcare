// pages/api/chat/route.ts (Next.js 13+ App Router)
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; // Adjust path as needed

export async function POST(req: NextRequest) {
  try {
    // Get session using NextAuth.js
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Your chat generation logic here
    const body = await req.json();
    const { message, userId: requestedUserId } = body;

    // Check if the requesting user matches the session user
    if (requestedUserId && requestedUserId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate chat response
    const chatResponse = {
      message: `Hello! This is a response to: ${message}`,
      userId: userId,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(chatResponse);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}