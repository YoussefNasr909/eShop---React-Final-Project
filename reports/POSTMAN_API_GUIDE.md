# Postman API Guide — eShop Admin Dashboard

> **Complete guide for testing the E-Commerce Admin Dashboard API using Postman**

---

## 1) Overview

### What This Collection Is For
The **E-Commerce Admin Dashboard API** Postman collection provides a complete set of endpoints for managing an e-commerce platform. It covers:

| Service | Description |
|---------|-------------|
| **Products** | Inventory management (CRUD operations) |
| **Orders** | Order management and tracking |
| **Wallets** | User wallet balance management |
| **Wallet Transactions** | Deposit/withdrawal transaction history |
| **Utilities** | Health checks, pagination, search, and filtering |

### Base URL
```
http://localhost:3001
```

The API runs on **JSON Server**, a lightweight mock REST API perfect for prototyping and development.

---

## 2) Setup

### Step 1: Import the Collection

1. Open **Postman**
2. Click **Import** (top-left)
3. Drag and drop `postman_collection.json` OR click **Upload Files** and select it
4. The collection **"E-Commerce Admin Dashboard API"** will appear in your sidebar

### Step 2: Configure Environment Variables

The collection uses the variable `{{baseUrl}}`. You have two options:

**Option A: Use Collection Variables (Recommended)**
- The collection comes with `baseUrl` pre-configured as `http://localhost:3001`
- No additional setup needed!

**Option B: Create an Environment**
1. Click the **gear icon** (top-right) → **Manage Environments**
2. Click **Add** to create a new environment
3. Name it `eShop Local`
4. Add variable:
   | Variable | Initial Value | Current Value |
   |----------|---------------|---------------|
   | `baseUrl` | `http://localhost:3001` | `http://localhost:3001` |
5. Click **Save**
6. Select `eShop Local` from the environment dropdown

### Step 3: Start the API Server

Before testing, ensure the JSON Server is running:

```bash
npm run api
```

This starts the server at `http://localhost:3001`. You should see:
```
Resources
  http://localhost:3001/products
  http://localhost:3001/orders
  http://localhost:3001/wallets
  http://localhost:3001/walletTransactions
```

---

## 3) General Rules & Constraints

### Content-Type Header
All **POST**, **PUT**, and **PATCH** requests require:
```
Content-Type: application/json
```
The collection has this pre-configured.

### JSON Formatting Rules
- Request bodies must be **valid JSON**
- Use **double quotes** for strings (not single quotes)
- No trailing commas allowed
- Numbers should NOT be quoted (e.g., `"price": 99.99` not `"price": "99.99"`)

### ID Path Parameter Rules
When using endpoints with `/:id`:
- Replace `:id` with an actual ID value
- In Postman, click on the request → **Params** tab → set the `id` value
- Example: `/products/:id` becomes `/products/5`

### Safe Testing Rules
> ⚠️ **WARNING**: DELETE operations are permanent!

- Always test CREATE before DELETE
- Use test data, not production IDs
- The first product ID in the database is typically `"2"` (not `"1"`)

### Naming Conventions
| Field | Format | Example |
|-------|--------|---------|
| `sku` | `SKU-XXXX` | `SKU-2000` |
| `email` | Valid email format | `user@example.com` |
| `type` (transactions) | `deposit` or `withdraw` | `deposit` |

### HTTP Methods Usage
| Method | Purpose | Idempotent? |
|--------|---------|-------------|
| `GET` | Retrieve data | Yes |
| `POST` | Create new resource | No |
| `PATCH` | Partial update | Yes |
| `PUT` | Full replacement | Yes |
| `DELETE` | Remove resource | Yes |

---

## 4) Endpoints Reference

### 4.1 Products (Inventory)

#### Get All Products
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/products` |
| **Purpose** | Retrieve all products from inventory |

**Success Response (200):**
```json
[
  {
    "id": "2",
    "sku": "SKU-1000",
    "name": "USB-C Fast Charger 65W",
    "description": "Universal fast charger",
    "price": 39.99,
    "quantity": 120,
    "category": "Accessories",
    "createdAt": "2025-12-20T14:00:00Z"
  }
]
```

---

#### Get Product by ID
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/products/:id` |
| **Path Param** | `id` - Product ID |

**Success Response (200):** Single product object  
**Error (404):** Product not found

---

#### Create Product
| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/products` |
| **Content-Type** | `application/json` |

**Request Body:**
```json
{
  "sku": "SKU-2000",
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "quantity": 100,
  "category": "Electronics"
}
```

**Success Response (201):** Created product with auto-generated `id` and `createdAt`

---

#### Update Product (PATCH)
| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **URL** | `{{baseUrl}}/products/:id` |
| **Path Param** | `id` - Product ID |

**Request Body (partial update):**
```json
{
  "name": "Updated Product Name",
  "price": 129.99,
  "quantity": 150
}
```

**Success Response (200):** Updated product object

---

#### Delete Product
| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **URL** | `{{baseUrl}}/products/:id` |
| **Path Param** | `id` - Product ID |

**Success Response (200):** Empty object `{}`

---

#### Get Products by Category
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/products?category=Audio` |
| **Query Param** | `category` - Category name (case-sensitive) |

---

#### Search Products
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/products?q=wireless` |
| **Query Param** | `q` - Search term (searches all fields) |

---

### 4.2 Orders

#### Get All Orders
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/orders` |

---

#### Get Order by ID
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/orders/:id` |

---

#### Create Order
| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/orders` |

**Request Body:**
```json
{
  "customerEmail": "customer@example.com",
  "items": [
    {
      "productId": "1",
      "productName": "Wireless Bluetooth Headphones",
      "quantity": 2,
      "price": 149.99
    },
    {
      "productId": "2",
      "productName": "USB-C Fast Charger 65W",
      "quantity": 1,
      "price": 39.99
    }
  ],
  "totalAmount": 339.97
}
```

---

#### Delete Order
| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **URL** | `{{baseUrl}}/orders/:id` |

---

#### Get Orders by Customer
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/orders?customerEmail=john.doe@example.com` |

---

#### Sort Orders by Date
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/orders?_sort=createdAt&_order=desc` |

---

### 4.3 Wallets

#### Get All Wallets
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/wallets` |

---

#### Get Wallet by ID
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/wallets/:id` |

---

#### Create Wallet
| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/wallets` |

**Request Body:**
```json
{
  "ownerEmail": "user@example.com",
  "balance": 0
}
```

---

#### Update Wallet Balance
| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **URL** | `{{baseUrl}}/wallets/:id` |

**Request Body:**
```json
{
  "balance": 1000
}
```

---

#### Get Wallets by Owner
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/wallets?ownerEmail=admin@eshop.com` |

---

### 4.4 Wallet Transactions

#### Get All Transactions
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/walletTransactions` |

---

#### Get Transactions by Wallet ID
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/walletTransactions?walletId=1` |

---

#### Get Transaction by ID
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/walletTransactions/:id` |

---

#### Create Transaction (Deposit)
| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/walletTransactions` |

**Request Body:**
```json
{
  "walletId": "1",
  "type": "deposit",
  "amount": 500,
  "description": "Deposit from bank transfer"
}
```

---

#### Create Transaction (Withdraw)
| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `{{baseUrl}}/walletTransactions` |

**Request Body:**
```json
{
  "walletId": "1",
  "type": "withdraw",
  "amount": 200,
  "description": "Withdrawal to bank account"
}
```

---

#### Get Transactions by Type
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/walletTransactions?type=deposit` |
| **Values** | `deposit` or `withdraw` |

---

#### Sort Transactions by Date
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/walletTransactions?_sort=createdAt&_order=desc` |

---

### 4.5 JSON Server Utilities

#### Health Check
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/health` |

**Success Response (200):**
```json
{
  "status": "ok"
}
```

---

#### Pagination
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/products?_page=1&_limit=10` |
| **Query Params** | `_page` (page number), `_limit` (items per page) |

---

#### Full-text Search
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/products?q=gaming` |
| **Query Param** | `q` - searches across ALL fields |

---

#### Range Filter
| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `{{baseUrl}}/products?price_gte=100&price_lte=500` |
| **Query Params** | `_gte` (>=), `_lte` (<=), `_gt` (>), `_lt` (<) |

---

## 5) Most Important Request Bodies

### 5.1 Create Product
```json
{
  "sku": "SKU-2000",
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "quantity": 100,
  "category": "Electronics"
}
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `sku` | string | ✅ | Format: `SKU-XXXX` |
| `name` | string | ✅ | Product display name |
| `description` | string | ✅ | Product details |
| `price` | number | ✅ | **No quotes**, decimals OK |
| `quantity` | number | ✅ | Integer, >= 0 |
| `category` | string | ✅ | Category name |

---

### 5.2 Update Product
```json
{
  "name": "Updated Name",
  "price": 129.99,
  "quantity": 50
}
```
> **Note:** Only include fields you want to update (PATCH = partial)

---

### 5.3 Create Order
```json
{
  "customerEmail": "customer@example.com",
  "items": [
    {
      "productId": "1",
      "productName": "Product Name",
      "quantity": 2,
      "price": 149.99
    }
  ],
  "totalAmount": 299.98
}
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `customerEmail` | string | ✅ | Valid email format |
| `items` | array | ✅ | At least 1 item |
| `items[].productId` | string | ✅ | Must exist |
| `items[].productName` | string | ✅ | Display name |
| `items[].quantity` | number | ✅ | Integer > 0 |
| `items[].price` | number | ✅ | Unit price |
| `totalAmount` | number | ✅ | Sum of (qty × price) |

---

### 5.4 Create Wallet
```json
{
  "ownerEmail": "user@example.com",
  "balance": 0
}
```
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `ownerEmail` | string | ✅ | Unique email per wallet |
| `balance` | number | ✅ | Starting balance (usually 0) |

---

### 5.5 Deposit Transaction
```json
{
  "walletId": "1",
  "type": "deposit",
  "amount": 500,
  "description": "Deposit description"
}
```

---

### 5.6 Withdraw Transaction
```json
{
  "walletId": "1",
  "type": "withdraw",
  "amount": 200,
  "description": "Withdrawal description"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `walletId` | string | ✅ | Must exist |
| `type` | string | ✅ | `deposit` or `withdraw` only |
| `amount` | number | ✅ | **Positive number only** |
| `description` | string | ⚪ | Optional notes |

---

### ❌ Common Mistakes to Avoid

| Mistake | Problem | Correct |
|---------|---------|---------|
| `"price": "99.99"` | Price as string | `"price": 99.99` |
| `"quantity": -5` | Negative quantity | `"quantity": 5` |
| `"amount": -100` | Negative amount | `"amount": 100` |
| `"type": "Deposit"` | Wrong case | `"type": "deposit"` |
| Missing `items` array | Empty order | Include at least 1 item |
| Trailing comma | JSON parse error | Remove trailing commas |

---

## 6) Testing Workflow

Follow this recommended order when testing the API:

### Step-by-Step Testing Checklist

```
✅ 1. Health Check        → GET /health
✅ 2. List Products       → GET /products
✅ 3. Create Product      → POST /products
✅ 4. Get Product by ID   → GET /products/:id
✅ 5. Update Product      → PATCH /products/:id
✅ 6. List Wallets        → GET /wallets
✅ 7. Create Wallet       → POST /wallets
✅ 8. Deposit to Wallet   → POST /walletTransactions (type: deposit)
✅ 9. Withdraw from Wallet → POST /walletTransactions (type: withdraw)
✅ 10. Check Transactions → GET /walletTransactions?walletId=X
✅ 11. Create Order       → POST /orders
✅ 12. Get Order          → GET /orders/:id
✅ 13. List All Orders    → GET /orders
```

### Quick Validation Commands

| Test | Expected Result |
|------|-----------------|
| Health check returns `{"status": "ok"}` | Server is running |
| Products list returns array | Database connected |
| Create returns object with `id` | Write operations working |
| Delete returns `{}` | Delete operations working |

---

## 7) Troubleshooting & FAQ

### Common Errors

| Status | Meaning | Likely Cause | Solution |
|--------|---------|--------------|----------|
| **404** | Not Found | Wrong URL or ID doesn't exist | Check endpoint spelling, verify ID exists |
| **500** | Server Error | JSON parse error or server crash | Check request body JSON syntax |
| **Connection Refused** | Server down | API not running | Run `npm run api` |
| **400** | Bad Request | Invalid request body | Check JSON format |

### Specific Issues

#### "Cannot GET /db"
The `/db` endpoint doesn't exist in JSON Server v1.x. Use `/health` instead.

#### "Connection Refused" or "Could Not Send Request"
```bash
# Make sure the server is running:
npm run api

# Verify it's on the correct port (3001):
curl http://localhost:3001/health
```

#### "JSON Parse Error" or "Unexpected token"
Check your request body for:
- Missing or extra commas
- Single quotes instead of double quotes
- Unquoted strings
- Missing closing braces

#### CORS Errors (Browser Testing)
JSON Server allows all origins by default. If you see CORS errors:
- Ensure you're hitting `localhost`, not `127.0.0.1` (or vice versa)
- Clear browser cache

#### "ID Not Found" when resource exists
- IDs are **strings** in this API (`"1"` not `1`)
- Check if you're using the correct ID value
- Use GET all first to see available IDs

---

## 8) Notes for Frontend Integration (Axios)

### Base URL Configuration
```javascript
// src/lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### Example Service Functions
```javascript
// Products
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.patch(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Wallets
export const getWallets = () => api.get('/wallets');
export const createWallet = (data) => api.post('/wallets', data);

// Transactions
export const deposit = (walletId, amount, description) => 
  api.post('/walletTransactions', {
    walletId,
    type: 'deposit',
    amount,
    description,
  });

export const withdraw = (walletId, amount, description) => 
  api.post('/walletTransactions', {
    walletId,
    type: 'withdraw',
    amount,
    description,
  });
```

### Error Handling Pattern
```javascript
try {
  const response = await createProduct(productData);
  console.log('Created:', response.data);
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  } else if (error.request) {
    // No response received (server down?)
    console.error('No response - is the API running?');
  } else {
    console.error('Error:', error.message);
  }
}
```

### Keep Request Bodies Consistent
Always match your frontend request bodies with Postman templates:

```javascript
// ✅ Correct - matches Postman collection
const orderData = {
  customerEmail: 'user@example.com',
  items: [
    { productId: '1', productName: 'Item', quantity: 1, price: 99.99 }
  ],
  totalAmount: 99.99
};

// ❌ Wrong - different field names
const orderData = {
  customer: 'user@example.com',  // Wrong: should be customerEmail
  products: [...]                 // Wrong: should be items
};
```

---

## Quick Reference Card

| Action | Method | Endpoint |
|--------|--------|----------|
| Health check | GET | `/health` |
| List products | GET | `/products` |
| Get product | GET | `/products/:id` |
| Create product | POST | `/products` |
| Update product | PATCH | `/products/:id` |
| Delete product | DELETE | `/products/:id` |
| Search products | GET | `/products?q=term` |
| List orders | GET | `/orders` |
| Create order | POST | `/orders` |
| List wallets | GET | `/wallets` |
| Create wallet | POST | `/wallets` |
| Deposit | POST | `/walletTransactions` |
| Withdraw | POST | `/walletTransactions` |
| Wallet history | GET | `/walletTransactions?walletId=X` |

---

*Last updated: December 27, 2025*
