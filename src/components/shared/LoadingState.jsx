export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse"></div>
        </div>
      </div>
      <p className="mt-5 text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  )
}
