"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTweets, useUsername, useInitialUser, useAddress } from "@/hooks/useTweets"
import { Tweet } from "./Tweet"
import { UserProfile } from "./UserProfile"

interface TweetFeedProps {
  initialAddress: string | null
}

export function TweetFeed({ initialAddress }: TweetFeedProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterUserId = searchParams.get('user') || ""
  
  const { data: userId } = useAddress(initialAddress)
  const [newTweet, setNewTweet] = useState("")

  // Initialize user and fetch data
  const { status: initStatus } = useInitialUser(userId || "")
  const { tweets, addTweet, updateUsername, status: tweetsStatus, hasNextPage, fetchNextPage, isFetchingNextPage } = useTweets()
  const { data: filterUser } = useUsername(filterUserId)

  // Infinite scroll
  const intersectionObserver = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleUsernameChange = (newUsername: string) => {
    if (userId) {
      updateUsername(userId, newUsername)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTweet.trim() && userId) {
      addTweet(newTweet, userId)
      setNewTweet("")
    }
  }

  const handleUsernameClick = (clickedUserId: string) => {
    const params = new URLSearchParams(searchParams)
    if (clickedUserId === filterUserId) {
      params.delete('user')
    } else {
      params.set('user', clickedUserId)
    }
    router.push(`/?${params.toString()}`)
  }

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('user')
    router.push(`/?${params.toString()}`)
  }

  const filteredTweets = filterUserId ? tweets.filter((tweet) => tweet.userId === filterUserId) : tweets

  if (!userId || initStatus === 'pending' || tweetsStatus === 'pending') {
    return <div>Loading...</div>
  }

  return (
    <>
      <UserProfile userId={userId} onUsernameChange={handleUsernameChange} />
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
          placeholder="What's happening?"
          className="w-full border rounded p-2 mb-2"
          rows={3}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Tweet
        </button>
      </form>
      {filterUserId && (
        <div className="mb-4 flex items-center">
          <p className="mr-2">
            Showing tweets by: <strong>{filterUser?.username || 'Loading...'}</strong>
          </p>
          <button onClick={clearFilter} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">
            Clear filter
          </button>
        </div>
      )}
      <div>
        {filteredTweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            content={tweet.content}
            userId={tweet.userId}
            timestamp={tweet.timestamp}
            onUsernameClick={handleUsernameClick}
          />
        ))}
        <div ref={intersectionObserver} className="h-4" />
        {isFetchingNextPage && (
          <div className="text-center py-4 text-gray-500">Loading more tweets...</div>
        )}
      </div>
    </>
  )
} 