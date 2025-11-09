"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Activity {
  id: string
  type: "campaign_created" | "campaign_deleted" | "post_created" | "post_deleted"
  campaignId: string
  campaignName?: string
  postId?: string
  platform?: string
  timestamp: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "campaign_created":
        return "✨"
      case "campaign_deleted":
        return "🗑️"
      case "post_created":
        return "📝"
      case "post_deleted":
        return "❌"
      default:
        return "•"
    }
  }

  const getActivityLabel = (activity: Activity) => {
    switch (activity.type) {
      case "campaign_created":
        return `Campaign "${activity.campaignName}" created`
      case "campaign_deleted":
        return `Campaign "${activity.campaignName}" deleted`
      case "post_created":
        return `Post on ${activity.platform} added`
      case "post_deleted":
        return `${activity.platform} post removed`
      default:
        return "Activity"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)

    if (diffSecs < 60) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="sticky top-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Live Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-2 text-sm pb-2 border-b border-border last:border-0">
                <span className="text-lg flex-shrink-0">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-xs font-medium leading-tight">{getActivityLabel(activity)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
