# eShop Admin Dashboard - Interview Q&A Pack

> Complete preparation guide for project defense and technical interviews.

---

## 1) Project Overview & Requirements

### Q: What is this project about?
**Short Answer:** It's a React-based admin dashboard for managing an e-commerce store's products, orders, wallets, and transactions.

**Deeper Explanation:**
- Single-page application built with Vite + React
- Provides CRUD operations for inventory management
- Includes a wallet system with deposit/withdraw functionality
- Features data visualization with charts

**Evidence in My Project:** `README.md`, `src/App.jsx` (routes), `src/pages/dashboard/`

**Best Practice Tip:** Start your demo by explaining the business problem: "Admins need a centralized place to manage inventory and track finances."

**Possible Follow-up & Answer:**
- *Q: Why not use a real backend?*
- A: JSON Server provides a realistic REST API for development. The architecture is backend-agnostic—swapping to a real API only requires changing the base URL.

---

### Q: What resources does your app manage?
**Short Answer:** Products, Orders, Wallets, and Transactions—each with its own CRUD operations.

**Deeper Explanation:**
- **Products**: Full CRUD (create, read, update, delete)
- **Orders**: Create, list, view details, delete
- **Wallets**: Create wallets, deposit/withdraw funds
- **Transactions**: Read-only history of all wallet activity

**Evidence in My Project:** `src/services/products.js`, `src/services/orders.js`, `src/services/wallet.js`

**Best Practice Tip:** When explaining, show how resources relate: "Orders reference products, transactions belong to wallets."

**Possible Follow-up & Answer:**
- *Q: How do these resources relate to each other?*
- A: Orders contain product references. Transactions belong to wallets. This mimics real-world e-commerce relationships.

---

### Q: How does your project match the rubric requirements?
**Short Answer:** It implements all mandatory features: React Router, Axios with external API, forms with validation, and three creative features.

**Deeper Explanation:**
- ✅ React functional components with hooks
- ✅ React Router with protected routes
- ✅ Axios for HTTP calls to JSON Server
- ✅ Form validation with error handling
- ✅ Creative: Dark mode, Search/Filter, Charts

**Evidence in My Project:** See `DOCUMENTATION.md` for full checklist

**Best Practice Tip:** Have the rubric checklist ready and point to specific files for each requirement.

**Possible Follow-up & Answer:**
- *Q: Show me the three creative features.*
- A: Dark mode toggle in Topbar, search/filter on Products/Orders pages, and three Recharts visualizations on Overview.

---

### Q: Why did you choose this project idea?
**Short Answer:** E-commerce admin panels are common real-world applications that demonstrate CRUD, authentication, and data visualization.

**Deeper Explanation:**
- Covers all rubric requirements naturally
- Has real business logic (stock management, balance protection)
- Allows creative features that make sense (analytics, themes)
- Extensible for future features

**Evidence in My Project:** The project structure mirrors industry patterns

**Best Practice Tip:** Relate to real-world applications: "This is similar to Shopify's admin or WooCommerce dashboard."

**Possible Follow-up & Answer:**
- *Q: What would you add if you had more time?*
- A: User management, role-based access, order status workflows, and export to CSV/PDF.

---

### Q: What is the main user flow?
**Short Answer:** Login → View Dashboard → Manage Products/Orders/Wallets → Logout.

**Deeper Explanation:**
1. User logs in (mock auth)
2. Sees Overview with KPIs and charts
3. Can navigate to Products, Orders, Wallets, Transactions
4. Performs CRUD operations with validation
5. Logout clears session

**Evidence in My Project:** `src/App.jsx` (route definitions), `src/context/AuthContext.jsx`

**Best Practice Tip:** Walk through this flow in your 3-minute demo—it covers all major features.

**Possible Follow-up & Answer:**
- *Q: What happens if an unauthenticated user tries to access /dashboard?*
- A: ProtectedRoute redirects them to /login using `<Navigate to="/login" />`.

---

## 2) Architecture & Folder Structure

### Q: Explain your project's folder structure.
**Short Answer:** It follows a feature-based structure with clear separation: pages, components, services, and context.

**Deeper Explanation:**
```
src/
├── components/     # Reusable UI pieces
│   ├── layout/     # Sidebar, Topbar, DashboardLayout
│   ├── shared/     # DataTable, PageHeader, dialogs
│   └── ui/         # shadcn/ui primitives
├── pages/          # Route-level components
├── services/       # API call functions
├── context/        # Global state providers
└── lib/            # Utilities (formatCurrency, etc.)
```

**Evidence in My Project:** See folder structure in VS Code

**Best Practice Tip:** Explain the reasoning: "Components are reusable, pages are route-specific, services handle API."

**Possible Follow-up & Answer:**
- *Q: Why separate services from components?*
- A: Separation of concerns—components handle UI, services handle data fetching. This makes testing and refactoring easier.

---

### Q: Why use a feature-based structure?
**Short Answer:** It groups related code together, making it easier to navigate and maintain as the project grows.

**Deeper Explanation:**
- All product-related pages are in `/pages/dashboard/`
- All shared components are in `/components/shared/`
- API logic is centralized in `/services/`
- Avoids "file hunting" across folders

**Evidence in My Project:** `src/pages/dashboard/Products.jsx`, `src/pages/dashboard/ProductForm.jsx` are together

**Best Practice Tip:** Mention scalability: "Adding a new feature means adding files in predictable locations."

**Possible Follow-up & Answer:**
- *Q: How would you add a new resource like "Customers"?*
- A: Create `src/services/customers.js`, add pages in `src/pages/dashboard/`, and add routes in `App.jsx`.

---

### Q: What is the purpose of the services folder?
**Short Answer:** It contains API call functions that abstract away HTTP details from components.

**Deeper Explanation:**
- Each resource has its own service file
- Services use the shared Axios instance
- Components call `productsService.getAll()` instead of `axios.get('/products')`
- Keeps components focused on UI

**Evidence in My Project:** `src/services/products.js`, `src/services/orders.js`, `src/services/wallet.js`

**Best Practice Tip:** Show the api.js file: "This is the single Axios instance all services use."

**Possible Follow-up & Answer:**
- *Q: Why not call axios directly in components?*
- A: Duplicates URL strings, hard to change base URL, no central error handling, violates DRY principle.

---

### Q: What does the context folder contain?
**Short Answer:** React Context providers for global state: AuthContext, ThemeContext, and SidebarContext.

**Deeper Explanation:**
- `AuthContext`: User login state, `isAuthenticated` flag
- `ThemeContext`: Dark/light mode with localStorage persistence
- `SidebarContext`: Sidebar collapsed state

**Evidence in My Project:** `src/context/AuthContext.jsx`, `src/context/ThemeContext.jsx`

**Best Practice Tip:** Explain why Context over props: "These values are needed by many components at different levels."

**Possible Follow-up & Answer:**
- *Q: Why not use Redux?*
- A: For this project size, Context is sufficient. Redux adds boilerplate that isn't justified for simple global state.

---

## 3) React Concepts (Hooks, Components, State)

### Q: Why use functional components instead of class components?
**Short Answer:** Functional components with hooks are the modern React standard—simpler syntax, easier to test, and better performance.

**Deeper Explanation:**
- Hooks provide all lifecycle functionality
- Less boilerplate than `this.state` and `this.setState`
- Easier to share logic with custom hooks
- React team recommends functional components

**Evidence in My Project:** All components in `src/pages/` and `src/components/` are functional

**Best Practice Tip:** If asked about class components, say: "I understand them but prefer hooks for new projects."

**Possible Follow-up & Answer:**
- *Q: Can you convert a class component to functional?*
- A: Yes—replace `this.state` with `useState`, `componentDidMount` with `useEffect`, and remove `this`.

---

### Q: Explain useState and when you use it.
**Short Answer:** `useState` creates local state variables that trigger re-renders when updated.

**Deeper Explanation:**
```javascript
const [products, setProducts] = useState([])
const [isLoading, setIsLoading] = useState(true)
const [search, setSearch] = useState("")
```
- First value is current state
- Second value is setter function
- Calling setter triggers re-render

**Evidence in My Project:** `src/pages/dashboard/Products.jsx` lines 23-30

**Best Practice Tip:** Group related state or use objects: "I keep form fields in one state object for cleaner code."

**Possible Follow-up & Answer:**
- *Q: When would you use useReducer instead?*
- A: For complex state with multiple sub-values or when next state depends on previous state in complex ways.

---

### Q: Explain useEffect and when it runs.
**Short Answer:** `useEffect` runs side effects after render—like fetching data, subscriptions, or DOM manipulation.

**Deeper Explanation:**
```javascript
useEffect(() => {
  fetchProducts()  // Runs after render
}, [])             // Empty array = runs once on mount

useEffect(() => {
  filterProducts()
}, [search])       // Runs when 'search' changes
```

**Evidence in My Project:** `src/pages/dashboard/Products.jsx` lines 32-35

**Best Practice Tip:** Always explain the dependency array: "Empty array means mount only, values mean run when those change."

**Possible Follow-up & Answer:**
- *Q: What if you forget the dependency array?*
- A: It runs after every render, which can cause performance issues or infinite loops.

---

### Q: How do you prevent infinite loops in useEffect?
**Short Answer:** Use the dependency array correctly and avoid setting state that triggers the same effect.

**Deeper Explanation:**
- Empty `[]` = run once only
- Include only values that should trigger re-run
- Don't update state that's in the dependency array without conditions
- Use `useCallback` for function dependencies

**Evidence in My Project:** All my useEffects have proper dependency arrays

**Best Practice Tip:** If ESLint warns about dependencies, understand why before ignoring.

**Possible Follow-up & Answer:**
- *Q: Show me a case where you had to be careful.*
- A: In Orders.jsx, I use `debouncedSearch` in dependencies, not `searchQuery`, to avoid excessive API calls.

---

### Q: What is the difference between props and state?
**Short Answer:** Props come from parent components (read-only), state is internal to the component (mutable).

**Deeper Explanation:**
- **Props**: Passed down, immutable, used for configuration
- **State**: Owned by component, mutable via setter, triggers re-render

```jsx
// Props
<DataTable columns={columns} data={products} />

// State
const [products, setProducts] = useState([])
```

**Evidence in My Project:** `DataTable` receives props, `Products.jsx` manages state

**Best Practice Tip:** "State goes in the component that needs to change it; props pass data down."

**Possible Follow-up & Answer:**
- *Q: What is prop drilling and how do you avoid it?*
- A: Passing props through many levels. I use Context for global state to avoid this.

---

### Q: How do you handle conditional rendering?
**Short Answer:** Use JavaScript expressions inside JSX: ternary operators, && operator, or early returns.

**Deeper Explanation:**
```jsx
// Loading state
if (isLoading) return <LoadingState />

// Conditional content
{products.length === 0 ? (
  <EmptyState />
) : (
  <DataTable data={products} />
)}

// Optional element
{hasFilters && <Badge>Active</Badge>}
```

**Evidence in My Project:** `src/pages/dashboard/Products.jsx`, `src/pages/dashboard/Overview.jsx`

**Best Practice Tip:** Use early returns for major states (loading, error), ternary for inline decisions.

**Possible Follow-up & Answer:**
- *Q: Why early return instead of wrapping everything in conditionals?*
- A: Cleaner code, easier to read, avoids deep nesting.

---

## 4) Routing (React Router v6)

### Q: Why did you choose React Router?
**Short Answer:** It's the standard routing library for React SPAs, providing declarative route definitions and navigation.

**Deeper Explanation:**
- Declarative routes in JSX
- Nested routing with `<Outlet />`
- Built-in hooks: `useNavigate`, `useParams`, `useLocation`
- Supports protected routes

**Evidence in My Project:** `src/App.jsx` contains all route definitions

**Best Practice Tip:** Show the routes file first when explaining navigation.

**Possible Follow-up & Answer:**
- *Q: What version are you using?*
- A: React Router v7 (latest), which has the same API as v6 with improvements.

---

### Q: Explain nested routing and Outlet.
**Short Answer:** Nested routes render child components inside parent layouts using `<Outlet />`.

**Deeper Explanation:**
```jsx
// App.jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="overview" element={<Overview />} />
  <Route path="products" element={<Products />} />
</Route>

// DashboardLayout.jsx
<div>
  <Sidebar />
  <main>
    <Outlet />  {/* Child routes render here */}
  </main>
</div>
```

**Evidence in My Project:** `src/App.jsx` lines 20-39, `src/components/layout/DashboardLayout.jsx`

**Best Practice Tip:** Draw a diagram: "DashboardLayout wraps all dashboard pages, Outlet is where they appear."

**Possible Follow-up & Answer:**
- *Q: What happens if you forget the Outlet?*
- A: Child routes won't render—you'll just see the parent component.

---

### Q: How does ProtectedRoute work?
**Short Answer:** It checks authentication status and redirects to login if not authenticated.

**Deeper Explanation:**
```jsx
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <LoadingSpinner />
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}
```

**Evidence in My Project:** `src/components/ProtectedRoute.jsx`

**Best Practice Tip:** Explain the loading check: "We wait for auth status to prevent flash of login page."

**Possible Follow-up & Answer:**
- *Q: What does the `replace` prop do?*
- A: It replaces the history entry so the back button doesn't return to the protected page.

---

### Q: How do you handle 404 Not Found?
**Short Answer:** A catch-all route at the end with `path="*"` renders the NotFound component.

**Deeper Explanation:**
```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard/*" element={...} />
  <Route path="*" element={<NotFound />} />  {/* Catch all */}
</Routes>
```

**Evidence in My Project:** `src/App.jsx` line 41, `src/pages/NotFound.jsx`

**Best Practice Tip:** "The order matters—specific routes first, catch-all last."

**Possible Follow-up & Answer:**
- *Q: What does your NotFound page show?*
- A: A friendly message with a link back to the dashboard or login.

---

### Q: How do you navigate programmatically?
**Short Answer:** Use the `useNavigate` hook to navigate after actions like form submission.

**Deeper Explanation:**
```jsx
const navigate = useNavigate()

const handleSubmit = async () => {
  await productsService.create(product)
  toast.success("Created!")
  navigate("/dashboard/products")  // Redirect
}
```

**Evidence in My Project:** `src/pages/dashboard/ProductForm.jsx` line 120

**Best Practice Tip:** Use `navigate(-1)` for "go back" functionality.

**Possible Follow-up & Answer:**
- *Q: What's the difference between navigate and Link?*
- A: `Link` is for declarative navigation in JSX, `navigate` is for imperative navigation in code.

---

### Q: How do you get URL parameters?
**Short Answer:** Use the `useParams` hook to access dynamic route segments.

**Deeper Explanation:**
```jsx
// Route: /dashboard/products/:id
const { id } = useParams()

// Now id contains the value from the URL
const product = await productsService.getById(id)
```

**Evidence in My Project:** `src/pages/dashboard/ProductForm.jsx` line 19

**Best Practice Tip:** Check if the param exists to differentiate create vs edit modes.

**Possible Follow-up & Answer:**
- *Q: How do you handle query parameters?*
- A: Use `useSearchParams` hook or `useLocation().search`.

---

## 5) API Integration (Axios + JSON Server)

### Q: Why use Axios instead of fetch?
**Short Answer:** Axios has a cleaner API, automatic JSON parsing, better error handling, and supports interceptors.

**Deeper Explanation:**
- Automatic `JSON.stringify` for request body
- Automatic JSON parsing for response
- Request/response interceptors
- Better browser compatibility
- Simpler syntax

**Evidence in My Project:** `src/services/api.js`

**Best Practice Tip:** Show the single axios instance: "One config, used everywhere."

**Possible Follow-up & Answer:**
- *Q: Could you use fetch instead?*
- A: Yes, but I'd need more code for JSON parsing and error handling.

---

### Q: Why create a single Axios instance?
**Short Answer:** Centralized configuration—base URL, headers, and interceptors in one place.

**Deeper Explanation:**
```javascript
// src/services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  headers: { "Content-Type": "application/json" }
})

export default api
```

**Evidence in My Project:** `src/services/api.js`

**Best Practice Tip:** "Changing the API URL is one line, not hunting through files."

**Possible Follow-up & Answer:**
- *Q: How would you add authentication headers?*
- A: Use an interceptor to add the token from context/storage to every request.

---

### Q: How do you handle API errors?
**Short Answer:** Try-catch blocks with user-friendly toast notifications.

**Deeper Explanation:**
```javascript
try {
  const data = await productsService.getAll()
  setProducts(data)
} catch (error) {
  toast.error("Failed to load products")
} finally {
  setIsLoading(false)
}
```

**Evidence in My Project:** Every page that fetches data has try-catch

**Best Practice Tip:** "I show user-friendly messages, not raw error text."

**Possible Follow-up & Answer:**
- *Q: How would you handle specific HTTP errors differently?*
- A: Check `error.response.status`—401 for unauthorized, 404 for not found, etc.

---

### Q: What HTTP methods do you use for CRUD?
**Short Answer:** GET for read, POST for create, PATCH for update, DELETE for delete.

**Deeper Explanation:**
| Operation | HTTP Method | Example |
|-----------|-------------|---------|
| Read all | GET | `GET /products` |
| Read one | GET | `GET /products/1` |
| Create | POST | `POST /products` |
| Update | PATCH | `PATCH /products/1` |
| Delete | DELETE | `DELETE /products/1` |

**Evidence in My Project:** `src/services/products.js`

**Best Practice Tip:** Explain PATCH vs PUT: "PATCH updates partial data, PUT replaces the entire resource."

**Possible Follow-up & Answer:**
- *Q: Why PATCH instead of PUT?*
- A: PATCH only sends changed fields, PUT requires sending the entire object.

---

### Q: How do you keep the UI in sync after CRUD operations?
**Short Answer:** Update local state directly after successful API calls instead of re-fetching.

**Deeper Explanation:**
```javascript
// After delete
await productsService.delete(id)
setProducts(prev => prev.filter(p => p.id !== id))

// After create/update
navigate("/dashboard/products")  // Page re-fetches on mount
```

**Evidence in My Project:** `src/pages/dashboard/Products.jsx` lines 64-78

**Best Practice Tip:** "Optimistic update for instant feedback, or refetch for simplicity."

**Possible Follow-up & Answer:**
- *Q: What is optimistic updating?*
- A: Update UI before API confirms success, rollback if it fails. I don't use it here for simplicity.

---

### Q: Why use JSON Server?
**Short Answer:** It provides a full REST API from a JSON file—perfect for frontend development without a real backend.

**Deeper Explanation:**
- Zero setup—just a JSON file
- Full CRUD endpoints automatically
- Supports filtering, sorting, pagination
- Realistic HTTP responses

**Evidence in My Project:** `mock/db.json`, `package.json` script: `json-server --watch mock/db.json`

**Best Practice Tip:** "The architecture is backend-agnostic—changing to a real API is just changing the URL."

**Possible Follow-up & Answer:**
- *Q: What are JSON Server's limitations?*
- A: No real authentication, no complex queries, limited to the JSON file structure.

---

## 6) Forms & Validation

### Q: How do you validate form inputs?
**Short Answer:** Custom validation function that sets error state for each invalid field.

**Deeper Explanation:**
```javascript
const validate = () => {
  const newErrors = {}
  
  if (!formData.sku.trim()) {
    newErrors.sku = "SKU is required"
  }
  
  if (price < 0) {
    newErrors.price = "Price must be 0 or greater"
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

**Evidence in My Project:** `src/pages/dashboard/ProductForm.jsx` lines 67-90

**Best Practice Tip:** "I validate on submit, then show errors next to fields."

**Possible Follow-up & Answer:**
- *Q: Why not use a form library like React Hook Form?*
- A: For forms this size, custom validation is simpler. I'd use a library for larger forms.

---

### Q: How do you show validation errors to users?
**Short Answer:** Inline error messages below fields for specific errors, toast for general failures.

**Deeper Explanation:**
```jsx
<Input 
  className={errors.sku ? "border-destructive" : ""}
  value={formData.sku}
  onChange={handleChange}
/>
{errors.sku && <p className="text-destructive">{errors.sku}</p>}
```

**Evidence in My Project:** `src/pages/dashboard/ProductForm.jsx` lines 166-168

**Best Practice Tip:** "Red border + message = clear feedback. Toast for API errors."

**Possible Follow-up & Answer:**
- *Q: Do you clear errors when the user starts typing?*
- A: Yes, I clear the specific field error in the onChange handler.

---

### Q: How do you validate email format?
**Short Answer:** Regular expression that checks for valid email structure.

**Deeper Explanation:**
```javascript
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

**Evidence in My Project:** `src/pages/dashboard/OrderForm.jsx` lines 78-81

**Best Practice Tip:** "This regex covers most cases. For production, I'd use a library."

**Possible Follow-up & Answer:**
- *Q: Is this regex perfect?*
- A: No, email validation is complex. This handles common cases. Real apps confirm via email.

---

### Q: How do you handle number inputs?
**Short Answer:** Input type="number" with min/max attributes, plus JavaScript validation.

**Deeper Explanation:**
```jsx
<Input
  type="number"
  min="0"
  step="0.01"
  value={formData.price}
/>

// Validation
const price = Number.parseFloat(formData.price)
if (isNaN(price) || price < 0) {
  newErrors.price = "Price must be 0 or greater"
}
```

**Evidence in My Project:** `src/pages/dashboard/ProductForm.jsx` lines 221-232

**Best Practice Tip:** "HTML attributes prevent bad input, JS validation catches edge cases."

**Possible Follow-up & Answer:**
- *Q: Why use parseFloat instead of parseInt?*
- A: Prices have decimals. parseFloat preserves them.

---

## 7) UI/UX and Reusability

### Q: What reusable components did you build?
**Short Answer:** DataTable, PageHeader, ConfirmDeleteDialog, LoadingState, EmptyState, SearchFilter, and more.

**Deeper Explanation:**
| Component | Purpose | Used In |
|-----------|---------|---------|
| `DataTable` | Generic data table | Products, Wallets, Transactions |
| `PageHeader` | Consistent page titles | All dashboard pages |
| `ConfirmDeleteDialog` | Delete confirmation | Products, Orders |
| `LoadingState` | Loading spinner | All data pages |
| `EmptyState` | Empty data message | Tables, Charts |

**Evidence in My Project:** `src/components/shared/`

**Best Practice Tip:** "Reusable components = consistent UI + less code duplication."

**Possible Follow-up & Answer:**
- *Q: Show me DataTable being used in two places.*
- A: Products.jsx and Transactions.jsx both use it with different column configs.

---

### Q: How do you ensure UI consistency?
**Short Answer:** Design system in CSS with utility classes, plus shadcn/ui component library.

**Deeper Explanation:**
- Tailwind CSS for utility classes
- shadcn/ui for consistent button/input/card styles
- Custom CSS classes in `index.css` (e.g., `app-card`, `app-badge`)
- Same spacing, colors, transitions everywhere

**Evidence in My Project:** `src/index.css`, `src/components/ui/`

**Best Practice Tip:** "I follow the design system—if I need a button, I use the Button component, not custom styles."

**Possible Follow-up & Answer:**
- *Q: What is shadcn/ui?*
- A: A component library built on Radix UI primitives, styled with Tailwind. Copy-paste components, fully customizable.

---

### Q: How do you handle loading states?
**Short Answer:** Boolean `isLoading` state, render LoadingState component while true.

**Deeper Explanation:**
```jsx
const [isLoading, setIsLoading] = useState(true)

if (isLoading) {
  return <LoadingState message="Loading products..." />
}
```

**Evidence in My Project:** Every page in `src/pages/dashboard/`

**Best Practice Tip:** "Always show loading—never leave users staring at a blank screen."

**Possible Follow-up & Answer:**
- *Q: What does LoadingState look like?*
- A: A centered spinner with optional message.

---

### Q: How do you handle empty states?
**Short Answer:** EmptyState component with icon, title, and description when data array is empty.

**Deeper Explanation:**
```jsx
{products.length === 0 ? (
  <EmptyState
    icon={Package}
    title="No products found"
    description="Get started by adding your first product."
  />
) : (
  <DataTable data={products} />
)}
```

**Evidence in My Project:** `src/components/shared/EmptyState.jsx`, used in tables and charts

**Best Practice Tip:** "Empty states guide users—they're not errors, they're opportunities."

**Possible Follow-up & Answer:**
- *Q: Why have a separate EmptyState component?*
- A: Consistency. Every empty state looks the same and is easy to customize.

---

### Q: How do you handle error states?
**Short Answer:** Try-catch with toast notification for user feedback.

**Deeper Explanation:**
```jsx
try {
  await productsService.delete(id)
  toast.success("Deleted!")
} catch (error) {
  toast.error("Failed to delete product")
}
```

**Evidence in My Project:** All CRUD operations have error handling

**Best Practice Tip:** "Errors should be actionable—tell users what went wrong and what to do."

**Possible Follow-up & Answer:**
- *Q: Do you log errors for debugging?*
- A: In production, I'd add error logging. For this project, console.error in development.

---

## 8) Real-world Logic

### Q: How is wallet balance protected from going negative?
**Short Answer:** Validation in the service layer checks if withdrawal amount exceeds balance before processing.

**Deeper Explanation:**
```javascript
// src/services/wallet.js
withdraw: async (walletId, amount) => {
  const wallet = await api.get(`/wallets/${walletId}`)
  
  if (wallet.data.balance < amount) {
    throw new Error("Insufficient balance")
  }
  
  // Proceed with withdrawal...
}
```

**Evidence in My Project:** `src/services/wallet.js` lines 50-54

**Best Practice Tip:** "Business rules belong in services, not just UI validation."

**Possible Follow-up & Answer:**
- *Q: What if two withdrawals happen simultaneously?*
- A: JSON Server doesn't handle this. Real APIs use database transactions for atomicity.

---

### Q: How do transactions get recorded?
**Short Answer:** Every deposit/withdraw creates a transaction record with type, amount, and timestamp.

**Deeper Explanation:**
```javascript
deposit: async (walletId, amount, description) => {
  // 1. Update wallet balance
  const newBalance = wallet.balance + amount
  await api.patch(`/wallets/${walletId}`, { balance: newBalance })
  
  // 2. Create transaction record
  const transaction = await api.post("/walletTransactions", {
    walletId,
    type: "deposit",
    amount,
    description,
    createdAt: new Date().toISOString()
  })
}
```

**Evidence in My Project:** `src/services/wallet.js` lines 28-45

**Best Practice Tip:** "Transactions are immutable audit logs—never delete or modify them."

**Possible Follow-up & Answer:**
- *Q: What happens if the transaction POST fails after the balance update?*
- A: Data inconsistency. Real systems use database transactions. This is a JSON Server limitation.

---

### Q: How do orders compute totals?
**Short Answer:** Frontend calculates total by summing (price × quantity) for all items.

**Deeper Explanation:**
```javascript
const calculateTotal = () => {
  return items.reduce((total, item) => {
    const product = getProductById(item.productId)
    return total + (product.price * item.quantity)
  }, 0)
}
```

**Evidence in My Project:** `src/pages/dashboard/OrderForm.jsx` lines 48-56

**Best Practice Tip:** "Show the total updating in real-time as users add items."

**Possible Follow-up & Answer:**
- *Q: Should the backend recalculate the total?*
- A: Yes, for security. Clients can't be trusted. Backend should verify.

---

### Q: Do orders reduce stock? How?
**Short Answer:** Yes, the order creation service reduces product quantities before saving the order.

**Deeper Explanation:**
```javascript
// src/services/orders.js
create: async (order) => {
  // Check stock availability
  for (const item of order.items) {
    const product = await productsService.getById(item.productId)
    if (product.quantity < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`)
    }
  }
  
  // Reduce stock
  for (const item of order.items) {
    const product = await productsService.getById(item.productId)
    await productsService.update(item.productId, {
      quantity: product.quantity - item.quantity
    })
  }
  
  // Create order
  return await api.post("/orders", order)
}
```

**Evidence in My Project:** `src/services/orders.js` lines 10-35

**Best Practice Tip:** "Show low stock warnings and prevent ordering more than available."

**Possible Follow-up & Answer:**
- *Q: What if deletion restores stock?*
- A: I don't restore stock on delete—that would be a separate "cancel order" feature.

---

## 9) Creative Features

### Q: How does dark mode work?
**Short Answer:** ThemeContext tracks current theme, toggles the `dark` class on document root, persists in localStorage.

**Deeper Explanation:**
```javascript
// ThemeContext.jsx
const [theme, setTheme] = useState(() => {
  return localStorage.getItem("eshop_theme") || "light"
})

useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark")
  localStorage.setItem("eshop_theme", theme)
}, [theme])
```

**Evidence in My Project:** `src/context/ThemeContext.jsx`

**Best Practice Tip:** "Toggle in Topbar, preference survives refresh."

**Possible Follow-up & Answer:**
- *Q: Why localStorage instead of API?*
- A: Theme is user preference, not business data. localStorage is simpler and faster.

---

### Q: How does search and filtering work?
**Short Answer:** Client-side filtering with useMemo for performance, debounce for search input.

**Deeper Explanation:**
```javascript
const debouncedSearch = useDebounce(searchQuery, 300)

const filteredProducts = useMemo(() => {
  return products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearch)
    const matchesPrice = product.price >= minPrice
    // ... more filters
    return matchesSearch && matchesPrice
  })
}, [products, debouncedSearch, minPrice, ...])
```

**Evidence in My Project:** `src/pages/dashboard/Products.jsx`, `src/pages/dashboard/Orders.jsx`

**Best Practice Tip:** "Client-side for small datasets, server-side for large ones."

**Possible Follow-up & Answer:**
- *Q: Why debounce the search?*
- A: Prevents filtering on every keystroke, which is wasteful.

---

### Q: What charts do you have and what data do they show?
**Short Answer:** Three Recharts visualizations: top products by stock, wallet activity over time, top wallets by balance.

**Deeper Explanation:**
| Chart | Type | Data |
|-------|------|------|
| Top Products | Horizontal Bar | Products sorted by quantity |
| Wallet Activity | Line Chart | Deposits vs withdrawals by date |
| Top Wallets | Bar Chart | Wallets sorted by balance |

**Evidence in My Project:** `src/pages/dashboard/Overview.jsx` lines 190-330

**Best Practice Tip:** "Each chart has empty state handling—no data, no errors."

**Possible Follow-up & Answer:**
- *Q: How do you aggregate data for charts?*
- A: Group transactions by date, sum deposits and withdrawals separately.

---

### Q: How do you handle empty chart data?
**Short Answer:** Check data length, show EmptyState component if empty.

**Deeper Explanation:**
```jsx
{topProducts.length === 0 ? (
  <EmptyState icon={BarChart3} title="No products yet" />
) : (
  <ResponsiveContainer>
    <BarChart data={topProducts}>...</BarChart>
  </ResponsiveContainer>
)}
```

**Evidence in My Project:** `src/pages/dashboard/Overview.jsx` lines 202-235

**Best Practice Tip:** "Empty charts look broken. Always show a message instead."

**Possible Follow-up & Answer:**
- *Q: What if the API fails?*
- A: Toast error + empty chart. I could add an error retry option.

---

## 10) Performance & Best Practices

### Q: What is debouncing and why use it for search?
**Short Answer:** Debouncing delays execution until user stops typing, reducing unnecessary operations.

**Deeper Explanation:**
```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

**Evidence in My Project:** `src/pages/dashboard/Orders.jsx` lines 37-49

**Best Practice Tip:** "300ms delay feels instant to users but saves many filter calls."

**Possible Follow-up & Answer:**
- *Q: What's the difference between debounce and throttle?*
- A: Debounce waits for pause, throttle limits calls per time period.

---

### Q: How do you avoid unnecessary re-renders?
**Short Answer:** useMemo for expensive calculations, proper dependency arrays, state structure.

**Deeper Explanation:**
```javascript
const filteredProducts = useMemo(() => {
  return products.filter(...)  // Only recalculates when dependencies change
}, [products, search, filters])
```

**Evidence in My Project:** `useMemo` in Products.jsx, Orders.jsx, Overview.jsx

**Best Practice Tip:** "Measure first. useMemo has overhead—use it for expensive operations."

**Possible Follow-up & Answer:**
- *Q: How would you use React.memo?*
- A: Wrap components that receive the same props to prevent re-renders.

---

### Q: Why split code into services and components?
**Short Answer:** Separation of concerns—services handle data, components handle UI.

**Deeper Explanation:**
- **Services**: Know about API, HTTP, data transformation
- **Components**: Know about rendering, user interaction
- Makes testing easier (mock services, test UI separately)
- Changes to API don't affect UI code

**Evidence in My Project:** `src/services/` vs `src/components/`

**Best Practice Tip:** "Components shouldn't know about axios or URLs."

**Possible Follow-up & Answer:**
- *Q: How would you test a service?*
- A: Mock axios, call service functions, assert on responses.

---

### Q: What accessibility considerations did you make?
**Short Answer:** Semantic HTML, proper labels, focus states, color contrast.

**Deeper Explanation:**
- `<label htmlFor="email">` linked to inputs
- Button focus rings visible
- Loading states announced
- Color contrast checked for dark/light modes

**Evidence in My Project:** Form labels in all form pages, focus styles in `index.css`

**Best Practice Tip:** "I use the base components from shadcn/ui which have accessibility built in."

**Possible Follow-up & Answer:**
- *Q: How would you test accessibility?*
- A: Lighthouse audit, keyboard navigation test, screen reader test.

---

## 11) Common Bugs & How You Solved Them

### Q: How did you handle dropdown z-index issues?
**Short Answer:** Ensured dropdowns have high z-index and parent containers don't have overflow:hidden.

**Deeper Explanation:**
- Problem: Dropdowns clipped by parent card overflow
- Solution: shadcn/ui uses portal to render outside parent
- Verified all dropdown menus appear above other content

**Evidence in My Project:** Select components work correctly in filter panels

**Best Practice Tip:** "Test dropdowns in every context—modals, cards, tables."

**Possible Follow-up & Answer:**
- *Q: What is a portal in React?*
- A: Renders children outside the parent DOM tree, useful for modals and dropdowns.

---

### Q: How did you handle dark mode contrast issues?
**Short Answer:** CSS variables that change based on dark class, verified contrast ratios.

**Deeper Explanation:**
```css
:root {
  --foreground: #1a1a1a;
  --background: #ffffff;
}

.dark {
  --foreground: #fafafa;
  --background: #0a0a0a;
}
```

**Evidence in My Project:** `src/index.css` theme section

**Best Practice Tip:** "Always test both themes—easy to miss issues in one."

**Possible Follow-up & Answer:**
- *Q: How do you check contrast ratios?*
- A: Browser DevTools, WebAIM Contrast Checker, or Lighthouse.

---

### Q: How do you handle missing product images?
**Short Answer:** ProductImage component shows fallback placeholder icon if image fails to load.

**Deeper Explanation:**
```jsx
<div className="bg-muted rounded-lg flex items-center justify-center">
  {imageError ? (
    <Package className="text-muted-foreground" />
  ) : (
    <img 
      src={`/products/${productName}.png`}
      onError={() => setImageError(true)}
    />
  )}
</div>
```

**Evidence in My Project:** `src/components/shared/ProductImage.jsx`

**Best Practice Tip:** "Never show broken image icons—always have a fallback."

**Possible Follow-up & Answer:**
- *Q: How are image paths generated?*
- A: Product name encoded and looked up in `public/products/`.

---

### Q: What JSON Server limitations did you encounter?
**Short Answer:** No transactions, no complex queries, no real auth—worked around with frontend logic.

**Deeper Explanation:**
- **No transactions**: Stock reduction and transaction logging are separate calls
- **No auth**: Mock auth in frontend with sessionStorage
- **No joins**: Enriched data by fetching related resources

**Evidence in My Project:** `src/services/orders.js` makes multiple calls

**Best Practice Tip:** "I acknowledge limitations and explain production solutions."

**Possible Follow-up & Answer:**
- *Q: Would these workarounds work in production?*
- A: No, production needs proper backend with transactions and auth.

---

## 12) Demo & Defense Strategy

### Q: What should I show first in my demo?
**Short Answer:** Login flow → Overview dashboard → One complete CRUD flow → Creative features.

**Deeper Explanation:**
1. **Login** (shows auth)
2. **Overview** (shows charts, KPIs)
3. **Products CRUD** (shows full create/edit/delete)
4. **Orders** (shows relationships)
5. **Wallets** (shows real-world logic)
6. **Dark mode toggle** (shows creative feature)

**Evidence in My Project:** See demo script in DOCUMENTATION.md

**Best Practice Tip:** "Practice the flow until you can do it in 3 minutes without rushing."

**Possible Follow-up & Answer:**
- *Q: What if you run out of time?*
- A: Prioritize: Login, Products CRUD, one creative feature. Skip nice-to-haves.

---

### Q: What should I highlight as "best practice"?
**Short Answer:** Service layer abstraction, reusable components, form validation, error handling, responsive design.

**Deeper Explanation:**
- "I centralized API calls in services"
- "I built reusable components for consistency"
- "I validate on frontend AND explain backend would validate too"
- "I handle loading, empty, and error states"
- "The app works on mobile"

**Evidence in My Project:** Services folder, shared components, form validation

**Best Practice Tip:** Mention what you would do differently with more time.

**Possible Follow-up & Answer:**
- *Q: What would you improve?*
- A: "Add tests, better error handling, optimistic updates, real auth."

---

### Q: What if something breaks during the demo?
**Short Answer:** Stay calm, explain what should happen, show the code, offer to debug.

**Deeper Explanation:**
- Check if JSON Server is running
- Check browser console for errors
- Explain: "This works in development, let me check…"
- Show the relevant code and explain the logic

**Evidence in My Project:** Have troubleshooting section in DOCUMENTATION.md ready

**Best Practice Tip:** "Bugs in demos show problem-solving skills. Don't panic."

**Possible Follow-up & Answer:**
- *Q: The API isn't responding.*
- A: "JSON Server might have stopped. Let me restart it with `npm run api`."

---

### Q: How do I explain my code structure quickly?
**Short Answer:** "Pages render routes, components are reusable UI, services handle API, context handles global state."

**Deeper Explanation:**
- Point to folder structure
- Open one example of each: a page, a service, a context
- Show how they connect: "Page calls service, displays with components"

**Evidence in My Project:** Start with `App.jsx` → one page → its service

**Best Practice Tip:** "Keep a browser tab open to each key file for quick access."

**Possible Follow-up & Answer:**
- *Q: Walk me through the data flow.*
- A: "App routes to page, page calls service on mount, service uses axios, response updates state, React re-renders UI."

---

### Q: What questions might catch me off guard?
**Short Answer:** Deep React concepts, performance optimization, security considerations.

**Deeper Explanation:**
- "What are React reconciliation and virtual DOM?"
- "How would you handle large datasets?"
- "How would you secure this for production?"

Practice these answers:
- Reconciliation: "React compares virtual DOM to find minimal changes"
- Large data: "Pagination, virtualization, server-side filtering"
- Security: "Real auth, HTTPS, input sanitization, CORS"

**Best Practice Tip:** "It's okay to say 'I haven't implemented that, but I would…'"

**Possible Follow-up & Answer:**
- *Q: What about testing?*
- A: "I'd add Jest for services, React Testing Library for components. Time constraint limited this."

---

## Confidence Tips for Your Interview

1. **Know your code** – Be able to explain any file you point to
2. **Speak in patterns** – "I used the service layer pattern", "This follows component composition"
3. **Admit limitations** – "JSON Server doesn't support X, production would need Y"
4. **Show enthusiasm** – "I really enjoyed implementing the wallet logic"
5. **Have questions ready** – "What patterns does your team use?"

---

*Good luck with your interview! Remember: you built this, you know it best.*
