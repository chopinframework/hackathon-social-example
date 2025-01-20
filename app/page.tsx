"use client"

import { useState, useEffect } from "react"
import { useTweets } from "../hooks/useTweets"
import { Tweet } from "../components/Tweet"
import { UserProfile } from "../components/UserProfile"

// Helper function to generate a mock Ethereum address
function generateMockEthereumAddress() {
  return "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
}

export default function Home() {
  const [userId, setUserId] = useState("")
  const [username, setUsername] = useState("Anonymous")
  const [newTweet, setNewTweet] = useState("")
  const [filter, setFilter] = useState("")
  const { tweets, users, addTweet, updateUsername, addUser } = useTweets()

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    const storedUsername = localStorage.getItem("username")
    if (storedUserId && storedUsername) {
      setUserId(storedUserId)
      setUsername(storedUsername)
    } else {
      const newUserId = generateMockEthereumAddress()
      setUserId(newUserId)
      localStorage.setItem("userId", newUserId)
      localStorage.setItem("username", "Anonymous")
      addUser(newUserId, "Anonymous")
    }
  }, [])

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername)
    localStorage.setItem("username", newUsername)
    updateUsername(userId, newUsername)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTweet.trim()) {
      addTweet(newTweet, userId)
      setNewTweet("")
    }
  }

  const handleUsernameClick = (clickedUsername: string) => {
    setFilter(clickedUsername)
  }

  const clearFilter = () => {
    setFilter("")
  }

  const filteredTweets = filter ? tweets.filter((tweet) => tweet.username === filter) : tweets

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Simple Twitter Clone</h1>
      <UserProfile userId={userId} username={username} onUsernameChange={handleUsernameChange} />
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
      {filter && (
        <div className="mb-4 flex items-center">
          <p className="mr-2">
            Showing tweets by: <strong>{filter}</strong>
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
            username={tweet.username}
            userId={tweet.userId}
            timestamp={tweet.timestamp}
            onUsernameClick={handleUsernameClick}
          />
        ))}
      </div>
    </div>
  )
}

