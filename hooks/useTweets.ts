import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Tweet, User } from "@/lib/types"

const TWEETS_PER_PAGE = 10

async function fetchTweets({ pageParam = 0 }) {
  const response = await fetch(`/api/tweets?cursor=${pageParam}&limit=${TWEETS_PER_PAGE}`)
  if (!response.ok) throw new Error('Failed to fetch tweets')
  return response.json()
}

async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/api/users?userId=${userId}`)
  if (!response.ok) throw new Error('Failed to fetch user')
  return response.json()
}

export function useInitialUser(userId: string) {
  const queryClient = useQueryClient()
  
  return useQuery({
    queryKey: ['initialUser', userId],
    queryFn: async () => {
      // First check if user exists
      const checkResponse = await fetch(`/api/users?userId=${userId}`)
      if (checkResponse.ok) {
        const existingUser = await checkResponse.json()
        if (existingUser) {
          return existingUser
        }
      }

      // If user doesn't exist, create them
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username: 'Anonymous' })
      })
      if (!response.ok) throw new Error('Failed to create user')
      const newUser = await response.json()
      
      // Update the user cache
      queryClient.setQueryData(['user', userId], newUser)
      return newUser
    }
  })
}

export function useTweets(initialData?: { tweets: Tweet[], nextCursor: number | null }) {
  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['tweets'],
    queryFn: fetchTweets,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    ...(initialData && {
      initialData: {
        pages: [initialData],
        pageParams: [0]
      }
    })
  })

  const tweets = data?.pages.flatMap(page => page.tweets) ?? []

  const addTweetMutation = useMutation({
    mutationFn: async ({ content, userId }: { content: string, userId: string }) => {
      const response = await fetch('/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId })
      })
      if (!response.ok) throw new Error('Failed to create tweet')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tweets'] })
    }
  })

  const updateUsernameMutation = useMutation({
    mutationFn: async ({ userId, username }: { userId: string, username: string }) => {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username })
      })
      if (!response.ok) throw new Error('Failed to update username')
      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.id] })
    }
  })

  return {
    tweets,
    status,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    addTweet: (content: string, userId: string) => 
      addTweetMutation.mutate({ content, userId }),
    updateUsername: (userId: string, username: string) =>
      updateUsernameMutation.mutate({ userId, username })
  }
}

export function useUsername(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId
  })
}

