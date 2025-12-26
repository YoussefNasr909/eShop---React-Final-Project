"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ErrorState({
    title = "Something went wrong",
    description = "An error occurred while loading data.",
    onRetry,
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 border-2 border-dashed border-destructive/30">
                <AlertTriangle className="h-10 w-10 text-destructive/70" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-destructive">{title}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="mt-5 gap-2 border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-transparent"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    )
}
