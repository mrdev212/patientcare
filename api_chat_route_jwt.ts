// Alternative: Manual JWT verification (if not using NextAuth.js)
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Your chat generation logic here
    const body = await req.json();
    const { message, userId: requestedUserId } = body;

    // Check if the requesting user matches the authenticated user
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