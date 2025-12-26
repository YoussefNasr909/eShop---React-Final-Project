"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export default function SearchFilter({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-9 h-9 border-2 transition-all duration-200 focus:border-primary"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 hover:bg-muted transition-colors"
          onClick={() => onChange("")}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
