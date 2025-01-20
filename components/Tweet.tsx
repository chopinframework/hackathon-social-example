import { formatDistanceToNow } from "date-fns"

interface TweetProps {
  content: string
  username: string
  userId: string
  timestamp: number
  onUsernameClick: (username: string) => void
}

export function Tweet({ content, username, userId, timestamp, onUsernameClick }: TweetProps) {
  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center mb-2">
        <button onClick={() => onUsernameClick(username)} className="font-bold mr-2 hover:underline focus:outline-none">
          {username}
        </button>
        <span className="text-gray-500 text-sm">{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
      </div>
      <p>{content}</p>
      <div className="mt-2 text-xs text-gray-500">
        <span className="font-mono">{userId}</span>
      </div>
    </div>
  )
}

