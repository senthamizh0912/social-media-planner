"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CampaignFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function CampaignForm({ onSubmit, onCancel }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    startDate: "",
    endDate: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Campaign name is required"
        } else if (value.length < 3) {
          newErrors.name = "Name must be at least 3 characters"
        } else {
          delete newErrors.name
        }
        break
      case "goal":
        if (!value.trim()) {
          newErrors.goal = "Campaign goal is required"
        } else if (value.length < 10) {
          newErrors.goal = "Goal must be at least 10 characters"
        } else {
          delete newErrors.goal
        }
        break
      case "startDate":
        if (!value) {
          newErrors.startDate = "Start date is required"
        } else {
          delete newErrors.startDate
        }
        break
      case "endDate":
        if (!value) {
          newErrors.endDate = "End date is required"
        } else if (formData.startDate && value < formData.startDate) {
          newErrors.endDate = "End date must be after start date"
        } else {
          delete newErrors.endDate
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (touched[name]) {
      validateField(name, value)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
    validateField(name, formData[name as keyof typeof formData])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const allFieldsValid =
      validateField("name", formData.name) &&
      validateField("goal", formData.goal) &&
      validateField("startDate", formData.startDate) &&
      validateField("endDate", formData.endDate)

    if (allFieldsValid) {
      onSubmit(formData)
      setFormData({ name: "", goal: "", startDate: "", endDate: "" })
      setErrors({})
      setTouched({})
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>Plan your social media campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Campaign Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Summer Product Launch"
              className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
                touched.name && errors.name
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary"
              }`}
            />
            {touched.name && errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Campaign Goal *</label>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="What do you want to achieve?"
              rows={3}
              className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
                touched.goal && errors.goal
                  ? "border-destructive focus:ring-destructive"
                  : "border-input focus:ring-primary"
              }`}
            />
            {touched.goal && errors.goal && <p className="text-xs text-destructive mt-1">{errors.goal}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
                  touched.startDate && errors.startDate
                    ? "border-destructive focus:ring-destructive"
                    : "border-input focus:ring-primary"
                }`}
              />
              {touched.startDate && errors.startDate && (
                <p className="text-xs text-destructive mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 ${
                  touched.endDate && errors.endDate
                    ? "border-destructive focus:ring-destructive"
                    : "border-input focus:ring-primary"
                }`}
              />
              {touched.endDate && errors.endDate && <p className="text-xs text-destructive mt-1">{errors.endDate}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={Object.keys(errors).length > 0}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Create Campaign
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
