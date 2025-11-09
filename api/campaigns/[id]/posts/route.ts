import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

const posts: { [campaignId: string]: any[] } = {
  "1": [
    {
      id: "1-1",
      campaignId: "1",
      platform: "Twitter",
      caption: "Excited to announce our new summer collection! 🌞 Check it out now.",
      scheduleDate: "2025-06-01T10:00",
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json(dataStore.posts[id] || [])
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await request.json()

  const newPost = {
    id: `${id}-${Date.now()}`,
    campaignId: id,
    ...data,
  }

  if (!dataStore.posts[id]) dataStore.posts[id] = []
  dataStore.posts[id].push(newPost)

  return NextResponse.json(newPost)
}
