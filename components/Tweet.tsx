import { formatDistanceToNow } from "date-fns"
import { useUsername } from "@/hooks/useTweets"

interface TweetProps {
  content: string
  userId: string
  timestamp: Date
  onUsernameClick: (userId: string) => void
}

export function Tweet({ content, userId, timestamp, onUsernameClick }: TweetProps) {
  const { data: user, isLoading } = useUsername(userId)
  const username = isLoading ? "Loading..." : user?.username || "Unknown"

  return (
    <div className="border-b p-4">
      <div className="flex items-center mb-2">
        <button
          onClick={() => onUsernameClick(userId)}
          className="font-bold hover:underline"
        >
          {username}
        </button>
        <span className="text-gray-500 text-sm ml-2">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </span>
      </div>
      <p className="whitespace-pre-wrap">{content}</p>
    </div>
  )
}

