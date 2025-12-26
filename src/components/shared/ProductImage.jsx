"use client"

import { useState } from "react"
import { Package } from "lucide-react"

export default function ProductImage({ productName, className = "", size = "md" }) {
  const [hasError, setHasError] = useState(false)

  const imagePath = `/products/${encodeURIComponent(productName)}.png`

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  }

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  if (hasError) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center rounded-lg bg-muted`}>
        <Package className={`${iconSizes[size]} text-muted-foreground`} />
      </div>
    )
  }

  return (
    <img
      src={imagePath || "/placeholder.svg"}
      alt={productName}
      className={`${sizeClasses[size]} ${className} rounded-lg object-cover bg-muted`}
      onError={() => setHasError(true)}
    />
  )
}
