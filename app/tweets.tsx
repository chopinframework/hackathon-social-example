import { sql } from '@vercel/postgres'
import { Tweet } from '@/lib/types'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { TweetFeed } from '@/components/TweetFeed'

async function getInitialTweets() {
  const { rows } = await sql`
    SELECT t.*
    FROM tweets t
    ORDER BY t.created_at DESC
    LIMIT ${10}
  `

  return {
    tweets: rows.map(row => ({
      id: row.id,
      content: row.content,
      userId: row.user_id,
      timestamp: row.created_at
    })),
    nextCursor: rows.length === 10 ? rows[rows.length - 1].id : null
  }
}

export default async function TweetsPage() {
  const queryClient = new QueryClient()
  const initialData = await getInitialTweets()
  
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['tweets'],
    queryFn: () => initialData,
    initialPageParam: 0
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TweetFeed />
    </HydrationBoundary>
  )
} 