import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

// Import data storage functions
const campaigns: any[] = [
  {
    id: "1",
    name: "Summer Product Launch",
    goal: "Increase brand awareness for new summer collection",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    createdAt: new Date().toISOString(),
  },
]

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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  dataStore.campaigns = dataStore.campaigns.filter((c) => c.id !== id)
  delete dataStore.posts[id]
  return NextResponse.json({ success: true })
}
