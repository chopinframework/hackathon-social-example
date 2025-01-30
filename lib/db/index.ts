import { sql } from '@vercel/postgres';
import { Tweet, User } from '../types';
import { Oracle } from '@chopinframework/next';

export async function getTweets(limit: number, cursor?: number): Promise<{ tweets: Tweet[], nextCursor: number | null }> {
  const { rows } = cursor
    ? await sql`
        SELECT t.*
        FROM tweets t
        WHERE t.id < ${cursor}
        ORDER BY t.created_at DESC
        LIMIT ${limit + 1}
      `
    : await sql`
        SELECT t.*
        FROM tweets t
        ORDER BY t.created_at DESC
        LIMIT ${limit + 1}
      `;

  const hasMore = rows.length === limit + 1;
  const tweets = rows.slice(0, limit).map(row => ({
    id: row.id,
    content: row.content,
    userId: row.user_id,
    timestamp: row.created_at
  }));

  return {
    tweets,
    nextCursor: hasMore ? tweets[tweets.length - 1].id : null
  };
}

export async function createTweet(content: string, userId: string): Promise<Tweet> {
  const now = await Oracle.now();
  const { rows } = await sql`
    INSERT INTO tweets (content, user_id, created_at)
    VALUES (${content}, ${userId}, ${new Date(now).toISOString()})
    RETURNING *
  `;
  const tweet = rows[0];
  return {
    id: tweet.id,
    content: tweet.content,
    userId: tweet.user_id,
    timestamp: tweet.created_at
  };
}

export async function getUser(userId: string): Promise<User | null> {
  const { rows } = await sql`
    SELECT * FROM users WHERE id = ${userId}
  `;
  return rows[0] ? {
    id: rows[0].id,
    username: rows[0].username
  } : null;
}

export async function createUser(userId: string, username: string): Promise<User> {
  const { rows } = await sql`
    INSERT INTO users (id, username)
    VALUES (${userId}, ${username})
    RETURNING *
  `;
  return {
    id: rows[0].id,
    username: rows[0].username
  };
}

export async function updateUsername(userId: string, username: string): Promise<User> {
  const { rows } = await sql`
    UPDATE users
    SET username = ${username}
    WHERE id = ${userId}
    RETURNING *
  `;
  return {
    id: rows[0].id,
    username: rows[0].username
  };
} 