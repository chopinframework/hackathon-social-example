import { useState, useEffect } from "react"

interface Tweet {
  id: string
  content: string
  userId: string // Ethereum address
  username: string
  timestamp: number
}

interface User {
  id: string // Ethereum address
  username: string
}

export function useTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const storedTweets = localStorage.getItem("tweets")
    const storedUsers = localStorage.getItem("users")
    if (storedTweets) {
      setTweets(JSON.parse(storedTweets))
    }
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tweets", JSON.stringify(tweets))
    localStorage.setItem("users", JSON.stringify(users))
  }, [tweets, users])

  const addTweet = (content: string, userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    const newTweet: Tweet = {
      id: Date.now().toString(),
      content,
      userId,
      username: user.username,
      timestamp: Date.now(),
    }
    setTweets((prevTweets) => [newTweet, ...prevTweets])
  }

  const updateUsername = (userId: string, newUsername: string) => {
    setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, username: newUsername } : user)))
    setTweets((prevTweets) =>
      prevTweets.map((tweet) => (tweet.userId === userId ? { ...tweet, username: newUsername } : tweet)),
    )
  }

  const addUser = (id: string, username: string) => {
    setUsers((prevUsers) => [...prevUsers, { id, username }])
  }

  return { tweets, users, addTweet, updateUsername, addUser }
}

