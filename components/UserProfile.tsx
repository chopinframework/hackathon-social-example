import { useState } from "react"

interface UserProfileProps {
  userId: string
  username: string
  onUsernameChange: (newUsername: string) => void
}

export function UserProfile({ userId, username, onUsernameChange }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newUsername, setNewUsername] = useState(username)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUsernameChange(newUsername)
    setIsEditing(false)
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <div className="mb-2">
        <span className="font-bold">Wallet Address: </span>
        <span className="font-mono">{userId}</span>
      </div>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
            Save
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between">
          <span className="font-bold">{username}</span>
          <button onClick={() => setIsEditing(true)} className="text-blue-500 underline">
            Edit username
          </button>
        </div>
      )}
    </div>
  )
}

