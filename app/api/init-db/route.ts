import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(42) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create tweets table
    await sql`
      CREATE TABLE IF NOT EXISTS tweets (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        user_id VARCHAR(42) REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
} 