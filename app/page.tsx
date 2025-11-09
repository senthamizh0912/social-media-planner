"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CampaignForm from "@/components/campaign-form"
import PostForm from "@/components/post-form"
import ActivityFeed from "@/components/activity-feed"

interface Campaign {
  id: string
  name: string
  goal: string
  startDate: string
  endDate: string
  createdAt: string
}

export default function Page() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [showPostForm, setShowPostForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<any[]>([])
  const [lastActivityCount, setLastActivityCount] = useState(0)

  useEffect(() => {
    fetchCampaigns()
    fetchActivities()
    const pollInterval = setInterval(() => {
      fetchCampaigns()
      fetchActivities()
    }, 1000)

    return () => clearInterval(pollInterval)
  }, [])

  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await fetch("/api/campaigns")
      const data = await response.json()
      setCampaigns(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch campaigns:", error)
    }
  }, [])

  const fetchActivities = useCallback(async () => {
    try {
      const response = await fetch("/api/activities")
      const data = await response.json()
      setActivities(data)
      setLastActivityCount(data.length)
    } catch (error) {
      console.error("Failed to fetch activities:", error)
    }
  }, [])

  const handleCreateCampaign = async (campaignData: Omit<Campaign, "id" | "createdAt">) => {
    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      })
      const newCampaign = await response.json()
      setCampaigns([...campaigns, newCampaign])
      setShowCampaignForm(false)
      await fetchActivities()
    } catch (error) {
      console.error("Failed to create campaign:", error)
    }
  }

  const handleDeleteCampaign = async (id: string) => {
    try {
      await fetch(`/api/campaigns/${id}`, { method: "DELETE" })
      setCampaigns(campaigns.filter((c) => c.id !== id))
      if (selectedCampaign?.id === id) setSelectedCampaign(null)
    } catch (error) {
      console.error("Failed to delete campaign:", error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Campaign Planner</h1>
          <p className="text-muted-foreground">Organize and manage your social media campaigns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Sidebar - Campaigns List */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <Button
                onClick={() => setShowCampaignForm(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                + New Campaign
              </Button>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Campaigns</CardTitle>
                  <CardDescription>{campaigns.length} total</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : campaigns.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No campaigns yet</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {campaigns.map((campaign) => (
                        <button
                          key={campaign.id}
                          onClick={() => setSelectedCampaign(campaign)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedCampaign?.id === campaign.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:bg-muted border-border hover:border-input"
                          }`}
                        >
                          <p className="font-medium text-sm truncate">{campaign.name}</p>
                          <p className="text-xs opacity-75 truncate">{campaign.goal}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {showCampaignForm && (
              <CampaignForm onSubmit={handleCreateCampaign} onCancel={() => setShowCampaignForm(false)} />
            )}

            {selectedCampaign ? (
              <>
                {/* Campaign Details */}
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-2xl">{selectedCampaign.name}</CardTitle>
                      <CardDescription className="mt-1">{selectedCampaign.goal}</CardDescription>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCampaign(selectedCampaign.id)}>
                      Delete
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                        <p className="text-sm font-semibold">{selectedCampaign.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">End Date</p>
                        <p className="text-sm font-semibold">{selectedCampaign.endDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Posts</h2>
                    <Button
                      onClick={() => setShowPostForm(true)}
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      + Add Post
                    </Button>
                  </div>

                  {showPostForm && (
                    <PostForm
                      campaignId={selectedCampaign.id}
                      onCancel={() => setShowPostForm(false)}
                      onSuccess={() => {
                        setShowPostForm(false)
                        fetchCampaigns()
                        fetchActivities()
                      }}
                    />
                  )}

                  <PostList
                    campaignId={selectedCampaign.id}
                    onRefresh={() => {
                      fetchCampaigns()
                      fetchActivities()
                    }}
                  />
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="pt-12 text-center">
                  <p className="text-muted-foreground mb-4">Select a campaign to view and manage posts</p>
                  <Button
                    onClick={() => setShowCampaignForm(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Create First Campaign
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </main>
  )
}

interface PostListProps {
  campaignId: string
  onRefresh: () => void
}

function PostList({ campaignId, onRefresh }: PostListProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [campaignId])

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/posts`)
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      await fetch(`/api/campaigns/${campaignId}/posts/${postId}`, { method: "DELETE" })
      setPosts(posts.filter((p) => p.id !== postId))
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading posts...</p>

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-8 text-center">
          <p className="text-muted-foreground">No posts yet. Create one to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((post) => (
        <Card key={post.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base">{post.platform}</CardTitle>
                <CardDescription className="text-xs">{post.scheduleDate}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePost(post.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-foreground line-clamp-4">{post.caption}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
