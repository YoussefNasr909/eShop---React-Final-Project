/**
 * ============================================================
 * APP.JSX - Main Application with Route Definitions
 * ============================================================
 * 
 * PURPOSE:
 * This is the root component that defines all routes in the application.
 * It uses React Router for client-side navigation.
 * 
 * ROUTING STRUCTURE:
 * 
 * PUBLIC ROUTES (no auth required):
 * - /login        → Login page
 * - /             → Redirects to /login
 * - /*            → 404 Not Found page
 * 
 * PROTECTED ROUTES (auth required):
 * - /dashboard/*  → All dashboard pages (wrapped in ProtectedRoute)
 * 
 * KEY CONCEPTS:
 * 
 * 1. NESTED ROUTES:
 *    Routes inside /dashboard share the same layout (DashboardLayout).
 *    Child routes render inside the <Outlet /> component.
 * 
 * 2. PROTECTED ROUTE:
 *    The ProtectedRoute component wraps DashboardLayout.
 *    If user is not authenticated, they get redirected to /login.
 * 
 * 3. DYNAMIC ROUTES:
 *    Routes like /products/:id use URL parameters.
 *    The :id part becomes available via useParams() hook.
 * 
 * 4. CATCH-ALL ROUTE:
 *    The path="*" route matches any URL not matched above.
 *    This shows the 404 Not Found page.
 * ============================================================
 */

import { Routes, Route, Navigate } from "react-router-dom"

// Layout and Auth Components
import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardLayout from "@/components/layout/DashboardLayout"

// Public Pages
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"

// Dashboard Pages (Protected)
import Overview from "@/pages/dashboard/Overview"
import Products from "@/pages/dashboard/Products"
import ProductForm from "@/pages/dashboard/ProductForm"
import Orders from "@/pages/dashboard/Orders"
import OrderForm from "@/pages/dashboard/OrderForm"
import OrderDetails from "@/pages/dashboard/OrderDetails"
import Wallets from "@/pages/dashboard/Wallets"
import WalletDetails from "@/pages/dashboard/WalletDetails"
import Transactions from "@/pages/dashboard/Transactions"

/**
 * MAIN APP COMPONENT
 * Defines the routing structure of the application.
 */
export default function App() {
  return (
    <Routes>
      {/* ================================================
          PUBLIC ROUTE: LOGIN
          Accessible without authentication
          ================================================ */}
      <Route path="/login" element={<Login />} />

      {/* ================================================
          PROTECTED ROUTES: DASHBOARD
          All routes under /dashboard require authentication.
          ProtectedRoute checks auth and redirects if needed.
          DashboardLayout provides the sidebar and topbar.
          ================================================ */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Index route: /dashboard → redirect to /dashboard/overview */}
        <Route index element={<Navigate to="/dashboard/overview" replace />} />

        {/* OVERVIEW - Dashboard home with KPIs and charts */}
        <Route path="overview" element={<Overview />} />

        {/* ============================================
            PRODUCTS MODULE - Full CRUD
            ============================================ */}
        {/* List all products */}
        <Route path="products" element={<Products />} />
        {/* Create new product */}
        <Route path="products/new" element={<ProductForm />} />
        {/* Edit existing product (uses :id parameter) */}
        <Route path="products/:id" element={<ProductForm />} />

        {/* ============================================
            ORDERS MODULE - Create, Read, Delete
            ============================================ */}
        {/* List all orders */}
        <Route path="orders" element={<Orders />} />
        {/* Create new order */}
        <Route path="orders/new" element={<OrderForm />} />
        {/* View order details (uses :id parameter) */}
        <Route path="orders/:id" element={<OrderDetails />} />

        {/* ============================================
            WALLETS MODULE - Balance Operations
            ============================================ */}
        {/* Main wallet management page */}
        <Route path="wallets" element={<Wallets />} />
        {/* View specific wallet details */}
        <Route path="wallets/:id" element={<WalletDetails />} />

        {/* ============================================
            TRANSACTIONS - Global Transaction History
            ============================================ */}
        <Route path="transactions" element={<Transactions />} />
      </Route>

      {/* ================================================
          ROOT REDIRECT
          When user visits /, redirect to login
          ================================================ */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ================================================
          404 NOT FOUND - CATCH-ALL ROUTE
          Matches any URL not handled above.
          Must be the LAST route in the list.
          ================================================ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
