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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; postId: string }> }) {
  const { id, postId } = await params

  if (dataStore.posts[id]) {
    dataStore.posts[id] = dataStore.posts[id].filter((p) => p.id !== postId)
  }

  return NextResponse.json({ success: true })
}
