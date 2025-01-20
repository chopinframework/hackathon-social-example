import { NextResponse } from 'next/server';
import { getUser, createUser, updateUsername } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const user = await getUser(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, username } = await request.json();
    
    if (!userId || !username) {
      return NextResponse.json(
        { error: 'userId and username are required' },
        { status: 400 }
      );
    }

    const user = await createUser(userId, username);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, username } = await request.json();
    
    if (!userId || !username) {
      return NextResponse.json(
        { error: 'userId and username are required' },
        { status: 400 }
      );
    }

    const user = await updateUsername(userId, username);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating username:', error);
    return NextResponse.json(
      { error: 'Failed to update username' },
      { status: 500 }
    );
  }
} 