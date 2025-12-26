"use client"

import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmptyState({ icon: Icon = Package, title = "No data", description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-dashed border-primary/30">
        <Icon className="h-10 w-10 text-primary/60" />
      </div>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-5 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
