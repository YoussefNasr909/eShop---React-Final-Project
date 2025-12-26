# eShop Admin Dashboard - Complete Documentation

---

## 1) Project Overview

### What the App Is
eShop Admin Dashboard is a **full-featured e-commerce administration panel** built with React. It provides a centralized interface for managing products, orders, customer wallets, and financial transactions.

### Who It Is For
- **Store administrators** managing inventory and orders
- **Finance teams** handling wallet operations and transactions
- **Developers** learning React CRUD patterns and state management

### What Problems It Solves
- Centralized product inventory management
- Order tracking with automatic stock updates
- Wallet-based payment system with transaction history
- Visual analytics for business insights

### Main Modules

| Module | Purpose |
|--------|---------|
| **Overview** | Dashboard with KPIs and charts |
| **Products** | CRUD inventory management |
| **Orders** | Create and track customer orders |
| **Wallets** | Manage user wallets, deposit/withdraw |
| **Transactions** | Global transaction history across all wallets |

---

## 2) Features

### CRUD Coverage

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Products | ✅ | ✅ | ✅ | ✅ |
| Orders | ✅ | ✅ | ❌ | ✅ |
| Wallets | ✅ | ✅ | ✅ (balance) | ❌ |
| Transactions | ✅ (auto) | ✅ | ❌ | ❌ |

### Routing & Protected Routes
- All `/dashboard/*` routes require authentication
- Unauthenticated users redirect to `/login`
- 404 page for unknown routes

### Validation Rules

**Products:**
- SKU: Required
- Name: Required
- Price: Must be ≥ 0
- Quantity: Must be ≥ 0

**Orders:**
- Customer email: Required, valid email format
- Items: At least one item required
- Quantity: Must be > 0 for each item

**Wallet:**
- Deposit amount: Must be > 0
- Withdraw amount: Must be > 0 AND ≤ current balance

### Real-World Logic
- **Wallet balance protection**: Cannot withdraw more than available
- **Transaction logging**: Every deposit/withdraw creates a transaction record
- **Stock reduction**: Creating an order reduces product quantities

### Creative Features
- 🌓 **Dark/Light Mode**: Toggle with localStorage persistence
- 🔍 **Search & Filter**: Debounced search, multi-filter support on Products, Orders, Transactions
- 📊 **Charts**: 3 Recharts visualizations on Overview

### UX Features
- Toast notifications (Sonner)
- Confirm delete dialogs
- Loading, empty, and error states
- Hover animations and transitions

---

## 3) Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI component library |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP requests to API |
| **JSON Server** | Mock REST API backend |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Pre-built UI components |
| **Sonner** | Toast notifications |
| **Recharts** | Data visualization charts |
| **Lucide React** | Icon library |

---

## 4) Project Structure

```
e-commerce-admin-dashboard/
├── src/
│   ├── components/
│   │   ├── layout/        # Sidebar, Topbar, DashboardLayout
│   │   ├── shared/        # Reusable components (DataTable, etc.)
│   │   └── ui/            # shadcn/ui primitives (Button, Card, etc.)
│   ├── pages/
│   │   ├── Login.jsx      # Authentication page
│   │   ├── NotFound.jsx   # 404 page
│   │   └── dashboard/     # All dashboard pages
│   ├── services/          # API service layers (Axios calls)
│   ├── context/           # React Context providers
│   ├── lib/               # Utility functions
│   └── index.css          # Global styles and design system
├── mock/
│   └── db.json            # JSON Server database
├── public/
│   └── products/          # Product images (optional)
└── .env                   # Environment variables
```

### Folder Explanations

| Folder | Purpose |
|--------|---------|
| `components/layout` | Page structure components (sidebar, topbar) |
| `components/shared` | Reusable components used across pages |
| `components/ui` | Base UI primitives from shadcn/ui |
| `pages/dashboard` | All authenticated dashboard pages |
| `services` | API calls organized by resource |
| `context` | Global state (Auth, Theme, Sidebar) |
| `mock/db.json` | Database for JSON Server |

---

## 5) Setup & Run Guide

### Requirements
- Node.js 18+ (recommended: 20.x)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd e-commerce-admin-dashboard

# Install dependencies
npm install
```

### Running the Application

**Terminal 1: Start JSON Server (API)**
```bash
npm run api
```
API runs at: `http://localhost:3001`

**Terminal 2: Start React Dev Server**
```bash
npm run dev
```
App runs at: `http://localhost:5173`

### Environment Variables

Create `.env` file in project root:
```env
VITE_API_BASE_URL=http://localhost:3001
```

### Common Startup Errors

| Error | Fix |
|-------|-----|
| `Port 3001 in use` | Kill the process: `npx kill-port 3001` |
| `Port 5173 in use` | Kill the process: `npx kill-port 5173` |
| `Cannot find module` | Run `npm install` again |
| `ENOENT db.json` | Ensure `mock/db.json` exists |

---

## 6) API Documentation

### Base URL
```
http://localhost:3001
```

### Products Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Create new product |
| PATCH | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

**Create Product Request:**
```json
{
  "sku": "SKU-001",
  "name": "Product Name",
  "description": "Description",
  "price": 99.99,
  "quantity": 50,
  "category": "Electronics"
}
```

### Orders Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get all orders |
| GET | `/orders/:id` | Get order by ID |
| POST | `/orders` | Create new order |
| DELETE | `/orders/:id` | Delete order |

**Create Order Request:**
```json
{
  "customerEmail": "customer@example.com",
  "items": [
    { "productId": "1", "productName": "Product", "quantity": 2, "price": 99.99 }
  ],
  "totalAmount": 199.98
}
```

### Wallets Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallets` | Get all wallets |
| GET | `/wallets/:id` | Get wallet by ID |
| POST | `/wallets` | Create new wallet |
| PATCH | `/wallets/:id` | Update wallet balance |

### Wallet Transactions Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/walletTransactions` | Get all transactions |
| GET | `/walletTransactions?walletId=1` | Get by wallet |
| POST | `/walletTransactions` | Create transaction |

**Transaction Request:**
```json
{
  "walletId": "1",
  "type": "deposit",
  "amount": 500,
  "description": "Payment received"
}
```

---

## 7) Routing Documentation

### All Routes

| Route | Component | Auth Required |
|-------|-----------|--------------|
| `/` | Redirects to `/login` | No |
| `/login` | Login page | No |
| `/dashboard` | Redirects to overview | Yes |
| `/dashboard/overview` | Overview | Yes |
| `/dashboard/products` | Products list | Yes |
| `/dashboard/products/new` | Create product | Yes |
| `/dashboard/products/:id` | Edit product | Yes |
| `/dashboard/orders` | Orders list | Yes |
| `/dashboard/orders/new` | Create order | Yes |
| `/dashboard/orders/:id` | Order details | Yes |
| `/dashboard/wallets` | Wallets management | Yes |
| `/dashboard/wallets/:id` | Wallet details | Yes |
| `/dashboard/transactions` | Transaction history | Yes |
| `*` | 404 Not Found | No |

### Nested Routing with Outlet
`DashboardLayout` uses `<Outlet />` to render child routes:
```jsx
<div>
  <Sidebar />
  <Topbar />
  <main>
    <Outlet />  {/* Child routes render here */}
  </main>
</div>
```

### ProtectedRoute Behavior
```jsx
if (!isAuthenticated) {
  return <Navigate to="/login" />
}
return children
```

### Login Redirection
- Already logged in → Redirect to `/dashboard/overview`
- Not logged in + accessing protected route → Redirect to `/login`

---

## 8) State Management Explanation

### How State Is Handled
Uses **React hooks** (`useState`, `useEffect`) for local state and **React Context** for global state.

### Global State (Context)
| Context | Purpose |
|---------|---------|
| `AuthContext` | User authentication status |
| `ThemeContext` | Dark/light mode |
| `SidebarContext` | Sidebar collapsed state |

### Page-Level State Example (Products)
```jsx
const [products, setProducts] = useState([])      // Product list
const [isLoading, setIsLoading] = useState(true)  // Loading state
const [search, setSearch] = useState("")          // Search query
const [deleteTarget, setDeleteTarget] = useState(null)  // Delete modal
```

### useEffect for Fetching
```jsx
useEffect(() => {
  fetchProducts()  // Runs once on mount
}, [])
```

### Re-fetching After CRUD
After create/update/delete, update local state directly:
```jsx
// After delete
setProducts(prev => prev.filter(p => p.id !== deletedId))

// After create
navigate("/dashboard/products")  // Navigate away, fetch on mount
```

---

## 9) UI Components Reusability

### Reusable Components

| Component | Location | Used In |
|-----------|----------|---------|
| `DataTable` | `shared/DataTable.jsx` | Products, Wallets, Transactions |
| `PageHeader` | `shared/PageHeader.jsx` | All dashboard pages |
| `ConfirmDeleteDialog` | `shared/ConfirmDeleteDialog.jsx` | Products, Orders |
| `LoadingState` | `shared/LoadingState.jsx` | All pages with data |
| `EmptyState` | `shared/EmptyState.jsx` | Tables, Charts |
| `SearchFilter` | `shared/SearchFilter.jsx` | Products |
| `ProductImage` | `shared/ProductImage.jsx` | Products, Orders |

### Benefits
- **DRY code**: Write once, use everywhere
- **Consistency**: Same UI patterns across pages
- **Maintainability**: Fix bugs in one place

### Example Usage
```jsx
<DataTable
  columns={columns}
  data={products}
  isLoading={isLoading}
  emptyTitle="No products found"
/>
```

---

## 10) Charts & Analytics

### Charts on Overview Page

| Chart | Type | Data Source |
|-------|------|-------------|
| Top Products by Stock | Horizontal Bar | Products sorted by quantity |
| Wallet Activity | Line Chart | Deposits vs Withdrawals over time |
| Top Wallets by Balance | Bar Chart | Wallets sorted by balance |

### Empty Data Handling
Each chart shows `EmptyState` component when data is empty:
```jsx
{data.length === 0 ? (
  <EmptyState title="No data yet" />
) : (
  <BarChart data={data} />
)}
```

### Aggregation Logic
**Wallet Activity Chart:**
```javascript
// Group transactions by date
transactions.forEach(txn => {
  const date = formatShortDate(txn.createdAt)
  if (txn.type === "deposit") {
    grouped[date].deposits += txn.amount
  } else {
    grouped[date].withdrawals += txn.amount
  }
})
```

---

## 11) Product Images Guide

### Where to Place Images
```
public/
└── products/
    ├── product-1.jpg
    ├── product-2.jpg
    └── ...
```

### Naming Rules
- Use lowercase
- Use hyphens, not spaces
- Match product name or ID
- Example: `wireless-headphones.jpg`

### Fallback Behavior
If image not found, `ProductImage` component shows a placeholder icon.

### Suggested Specs
- **Format**: JPG or PNG
- **Size**: 200x200px minimum
- **Aspect ratio**: 1:1 (square)

---

## 12) Testing Checklist (Manual)

### Login Flow
- [ ] Login page loads at `/login`
- [ ] Invalid credentials show error toast
- [ ] Valid login redirects to dashboard
- [ ] Logout clears session

### Products CRUD
- [ ] Products list loads with data
- [ ] Search filters products by name/SKU
- [ ] Price/stock filters work
- [ ] Create product with valid data
- [ ] Edit product updates correctly
- [ ] Delete shows confirmation, then removes

### Orders
- [ ] Orders list with pagination
- [ ] Create order with valid email
- [ ] Cannot create with 0 items
- [ ] Order details show items
- [ ] Delete order works

### Wallet Operations
- [ ] Deposit with amount > 0
- [ ] Withdraw fails if amount > balance
- [ ] Withdraw succeeds if amount ≤ balance
- [ ] Transaction appears in history

### Transactions
- [ ] Global history shows all wallets
- [ ] Filter by type (deposit/withdraw)
- [ ] Filter by wallet
- [ ] Search by email/description

### Theme
- [ ] Toggle dark/light mode
- [ ] Preference persists on refresh

### Charts
- [ ] All 3 charts render with data
- [ ] Empty state shows when no data

### Edge Cases
- [ ] 404 page for invalid URLs
- [ ] Loading states display
- [ ] Error toasts on API failure

---

## 13) 3-Minute Demo Script

### 0:00 - 0:20 | Login + Overview
1. Open `http://localhost:5173`
2. Show login form, enter credentials
3. Land on Overview dashboard
4. Point out KPI cards and charts

### 0:20 - 1:20 | Products CRUD + Search/Filter
1. Navigate to Products
2. Use search bar to filter
3. Apply stock filter
4. Click "Add Product" → fill form → save
5. Edit an existing product
6. Delete a product (show confirmation)

### 1:20 - 2:10 | Orders
1. Navigate to Orders
2. Show filtering and pagination
3. Click "Create Order"
4. Select products, set quantities
5. Show live total calculation
6. Submit order
7. View order details

### 2:10 - 2:40 | Wallet + Transactions
1. Navigate to Wallets
2. Show wallet balance
3. Deposit funds
4. Attempt withdrawal > balance (show error)
5. Successful withdrawal
6. Navigate to Transactions
7. Show global history with filters

### 2:40 - 3:00 | Charts + Dark Mode
1. Return to Overview
2. Highlight all 3 charts
3. Toggle dark mode
4. Show theme persists on refresh
5. End with dashboard view

---

## 14) Troubleshooting & FAQ

### JSON Server Port Issues
**Problem:** `Port 3001 already in use`

**Fix:**
```bash
# Windows
npx kill-port 3001

# Or change port in package.json
"api": "json-server --watch mock/db.json --port 3002"
```

### CORS Issues
JSON Server allows all origins by default. If issues occur:
- Ensure API URL matches `.env`
- Check browser console for errors

### Missing Images
**Problem:** Product images not showing

**Fix:**
- Place images in `public/products/`
- Use correct filename format
- Check browser DevTools → Network tab

### Empty db.json
**Problem:** No data loading

**Fix:**
- Ensure `mock/db.json` has valid JSON structure
- Must have `{}` at minimum
- Check for syntax errors

### "Cannot find module" Error
**Fix:**
```bash
rm -rf node_modules
npm install
```

### Vite Not Starting
**Fix:**
```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Login Not Working
- Credentials: `admin@eshop.com` / `admin123`
- Check browser console for errors
- Verify no typos in email/password

---

## Quick Reference

### Demo Credentials
```
Email: admin@eshop.com
Password: admin123
```

### Run Commands
```bash
npm run dev    # Start React app
npm run api    # Start JSON Server
npm run build  # Production build
```

### Key Files
- `src/App.jsx` - Routes
- `src/services/` - API calls
- `src/context/` - Global state
- `mock/db.json` - Database

---

*Documentation created for Final React Project submission.*
