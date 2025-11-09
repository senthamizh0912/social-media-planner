import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

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

  const campaign = dataStore.campaigns.find((c) => c.id === id)
  dataStore.addActivity({
    type: "post_created",
    campaignId: id,
    campaignName: campaign?.name,
    platform: data.platform,
  })

  return NextResponse.json(newPost)
}
