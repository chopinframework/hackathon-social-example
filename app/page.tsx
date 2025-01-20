"use client"

import { useState } from "react"
import { useTweets, useUsername, useInitialUser } from "../hooks/useTweets"
import { Tweet } from "../components/Tweet"
import { UserProfile } from "../components/UserProfile"

// Helper function to generate a mock Ethereum address
function generateMockEthereumAddress() {
  return "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

export default function Home() {
  const [userId] = useState(() => generateMockEthereumAddress())
  const [newTweet, setNewTweet] = useState("")
  const [filterUserId, setFilterUserId] = useState("")
  
  // Initialize user and fetch data
  const { status: initStatus } = useInitialUser(userId)
  const { tweets, addTweet, updateUsername, status: tweetsStatus } = useTweets()
  const { data: filterUser } = useUsername(filterUserId)

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

  const handleUsernameClick = (userId: string) => {
    setFilterUserId(userId)
  }

  const clearFilter = () => {
    setFilterUserId("")
  }

  const filteredTweets = filterUserId ? tweets.filter((tweet) => tweet.userId === filterUserId) : tweets

  if (initStatus === 'pending' || tweetsStatus === 'pending') {
    return <div className="max-w-2xl mx-auto p-4">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Simple Twitter Clone</h1>
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
      </div>
    </div>
  )
}

