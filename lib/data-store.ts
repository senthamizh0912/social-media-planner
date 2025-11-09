// Shared in-memory data store for all API routes

interface Activity {
  id: string
  type: "campaign_created" | "campaign_deleted" | "post_created" | "post_deleted"
  campaignId: string
  campaignName?: string
  postId?: string
  platform?: string
  timestamp: string
}

export const dataStore = {
  campaigns: [
    {
      id: "1",
      name: "Summer Product Launch",
      goal: "Increase brand awareness for new summer collection",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      createdAt: new Date().toISOString(),
    },
  ],

  posts: {
    "1": [
      {
        id: "1-1",
        campaignId: "1",
        platform: "Twitter",
        caption: "Excited to announce our new summer collection! Check it out now.",
        scheduleDate: "2025-06-01T10:00",
      },
    ],
  } as { [campaignId: string]: any[] },

  activities: [] as Activity[],

  addActivity(activity: Omit<Activity, "id" | "timestamp">) {
    const newActivity: Activity = {
      id: String(Date.now()) + Math.random(),
      timestamp: new Date().toISOString(),
      ...activity,
    }
    this.activities.unshift(newActivity)
    // Keep only last 50 activities
    if (this.activities.length > 50) {
      this.activities = this.activities.slice(0, 50)
    }
  },

  getActivities() {
    return this.activities
  },
}
