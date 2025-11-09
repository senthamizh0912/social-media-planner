import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const campaign = dataStore.campaigns.find((c) => c.id === id)
  if (campaign) {
    dataStore.addActivity({
      type: "campaign_deleted",
      campaignId: id,
      campaignName: campaign.name,
    })
  }

  dataStore.campaigns = dataStore.campaigns.filter((c) => c.id !== id)
  delete dataStore.posts[id]
  return NextResponse.json({ success: true })
}
