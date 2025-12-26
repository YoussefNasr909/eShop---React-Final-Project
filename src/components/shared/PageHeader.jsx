import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function PageHeader({ title, description, actionLabel, actionLink, icon: Icon }) {
  return (
    <div className="flex items-center justify-between app-section">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="h-10 w-10 rounded-xl app-gradient-primary flex items-center justify-center shadow-md">
            <Icon className="h-5 w-5 text-white" />
          </div>
        )}
        <div>
          <h1 className="app-title">{title}</h1>
          {description && <p className="app-subtitle">{description}</p>}
        </div>
      </div>
      {actionLabel && actionLink && (
        <Button
          asChild
          className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] gap-2"
        >
          <Link to={actionLink}>
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  )
}
