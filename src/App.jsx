import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import Overview from "@/pages/dashboard/Overview"
import Products from "@/pages/dashboard/Products"
import ProductForm from "@/pages/dashboard/ProductForm"
import Orders from "@/pages/dashboard/Orders"
import OrderForm from "@/pages/dashboard/OrderForm"
import OrderDetails from "@/pages/dashboard/OrderDetails"
import Wallets from "@/pages/dashboard/Wallets"
import WalletDetails from "@/pages/dashboard/WalletDetails"
import Transactions from "@/pages/dashboard/Transactions"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/new" element={<OrderForm />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="wallets" element={<Wallets />} />
        <Route path="wallets/:id" element={<WalletDetails />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
