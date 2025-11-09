import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/data-store"

export async function DELETE(request: NextRequest, { params }: { params: { id: string; postId: string } }) {
  const { id, postId } = params

  if (dataStore.posts[id]) {
    const post = dataStore.posts[id].find((p) => p.id === postId)
    if (post) {
      const campaign = dataStore.campaigns.find((c) => c.id === id)
      dataStore.addActivity({
        type: "post_deleted",
        campaignId: id,
        campaignName: campaign?.name,
        platform: post.platform,
      })
    }
  }

  // Existing code to delete the post
  if (dataStore.posts[id]) {
    dataStore.posts[id] = dataStore.posts[id].filter((p) => p.id !== postId)
  }

  return NextResponse.json({ success: true })
}
