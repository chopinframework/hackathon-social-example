"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTweets, useUsername, useInitialUser } from "@/hooks/useTweets"
import { Tweet } from "./Tweet"
import { UserProfile } from "./UserProfile"

// Helper function to generate a mock Ethereum address
function generateMockEthereumAddress() {
  return "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

function getStoredUserId() {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('userId')
  if (stored) return stored
  const newId = generateMockEthereumAddress()
  localStorage.setItem('userId', newId)
  return newId
}

export function TweetFeed() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterUserId = searchParams.get('user') || ""
  
  const [userId] = useState(() => getStoredUserId() || generateMockEthereumAddress())
  const [newTweet, setNewTweet] = useState("")

  // Initialize user and fetch data
  const { status: initStatus } = useInitialUser(userId)
  const { tweets, addTweet, updateUsername, status: tweetsStatus, hasNextPage, fetchNextPage, isFetchingNextPage } = useTweets()
  const { data: filterUser } = useUsername(filterUserId)

  // Infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null)
  const intersectionObserver = useCallback((node: HTMLDivElement) => {
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
    updateUsername(userId, newUsername)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTweet.trim()) {
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

  if (initStatus === 'pending' || tweetsStatus === 'pending') {
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