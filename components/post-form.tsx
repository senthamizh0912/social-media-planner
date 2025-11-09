"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PostFormProps {
  campaignId: string
  onCancel: () => void
  onSuccess: () => void
}

export default function PostForm({ campaignId, onCancel, onSuccess }: PostFormProps) {
  const [formData, setFormData] = useState({
    platform: "Twitter",
    caption: "",
    scheduleDate: "",
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "caption":
        if (!value.trim()) {
          newErrors.caption = "Caption is required"
        } else if (value.length < 5) {
          newErrors.caption = "Caption must be at least 5 characters"
        } else {
          delete newErrors.caption
        }
        break
      case "scheduleDate":
        if (!value) {
          newErrors.scheduleDate = "Schedule date is required"
        } else {
          delete newErrors.scheduleDate
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (touched[name]) {
      validateField(name, value)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
    validateField(name, formData[name as keyof typeof formData])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const allFieldsValid =
      validateField("caption", formData.caption) && validateField("scheduleDate", formData.scheduleDate)

    if (allFieldsValid) {
      setLoading(true)
      try {
        await fetch(`/api/campaigns/${campaignId}/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        onSuccess()
      } catch (error) {
        console.error("Failed to create post:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add Post</CardTitle>
        <CardDescription>Schedule a post for this campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Platform *</label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Twitter</option>
              <option>Instagram</option>
              <option>LinkedIn</option>
              <option>Facebook</option>
              <option>TikTok</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Caption *</label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Write your post caption..."
              rows={4}
              className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
                touched.caption && errors.caption
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary"
              }`}
            />
            {touched.caption && errors.caption && <p className="text-xs text-destructive mt-1">{errors.caption}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Schedule Date *</label>
            <input
              type="datetime-local"
              name="scheduleDate"
              value={formData.scheduleDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
                touched.scheduleDate && errors.scheduleDate
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary"
              }`}
            />
            {touched.scheduleDate && errors.scheduleDate && (
              <p className="text-xs text-destructive mt-1">{errors.scheduleDate}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Post"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
