import { useUsername } from "@/hooks/useTweets"
import { useState, useEffect } from "react"

interface UserProfileProps {
  userId: string
  onUsernameChange: (username: string) => void
}

export function UserProfile({ userId, onUsernameChange }: UserProfileProps) {
  const { data: user, isLoading } = useUsername(userId)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (user?.username && !isLoading) {
      setInputValue(user.username)
    }
  }, [user?.username, isLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = () => {
    if (inputValue.trim() && inputValue !== user?.username) {
      onUsernameChange(inputValue.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  return (
    <div className="mb-4 p-4 border rounded">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold">Profile</h2>
          <p className="text-sm text-gray-500 font-mono">{userId}</p>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="border rounded px-2 py-1 mr-2"
            placeholder="Username"
          />
        </div>
      </div>
    </div>
  )
}

