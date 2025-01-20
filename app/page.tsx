import { Suspense } from "react"
import TweetsPage from "./tweets"

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Simple Twitter Clone</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TweetsPage />
      </Suspense>
    </div>
  )
}

