import { NextResponse } from 'next/server';
import { getTweets, createTweet } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const result = await getTweets(limit, cursor ? parseInt(cursor, 10) : undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return NextResponse.json({ error: 'Failed to fetch tweets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content, userId } = await request.json();
    
    if (!content || !userId) {
      return NextResponse.json(
        { error: 'Content and userId are required' },
        { status: 400 }
      );
    }

    const tweet = await createTweet(content, userId);
    return NextResponse.json(tweet);
  } catch (error) {
    console.error('Error creating tweet:', error);
    return NextResponse.json(
      { error: 'Failed to create tweet' },
      { status: 500 }
    );
  }
} 