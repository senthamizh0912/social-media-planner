import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function GET() {
  return NextResponse.json(dataStore.campaigns)
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  const newCampaign = {
    id: String(Date.now()),
    ...data,
    createdAt: new Date().toISOString(),
  }
  dataStore.campaigns.push(newCampaign)
  dataStore.posts[newCampaign.id] = []

  dataStore.addActivity({
    type: "campaign_created",
    campaignId: newCampaign.id,
    campaignName: newCampaign.name,
  })

  return NextResponse.json(newCampaign)
}
