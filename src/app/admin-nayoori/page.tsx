"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  X,
  ChevronDown,
  Lock,
  Eye,
  Package,
  LayoutGrid,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import ProductManager from "@/components/admin/ProductManager";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";
import CategoryManager from "@/components/admin/CategoryManager";
import BannerManager from "@/components/admin/BannerManager";

// ─── Types ────────────────────────────────────────────
interface CartItem {
  title: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  mainImageUrl?: string;
}

interface Order {
  id: string;
  full_name: string;
  phone_number: string;
  delivery_area: string;
  full_address: string;
  cart_items: CartItem[];
  total_amount: number;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
};

type AdminTab = "orders" | "products" | "categories" | "banners" | "settings";

// ─── Main Component ───────────────────────────────────
export default function AdminDashboard() {
  // Auth gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");

  // Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Admin secret — in production use env vars / proper auth
  const ADMIN_SECRET = "nayoori2026";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid access key. Please try again.");
    }
  };

  // ─── Fetch orders ─────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.warn("Failed to fetch orders (table might not exist yet):", err.message);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Realtime subscription ────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new as Order, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === (payload.new as Order).id
                  ? (payload.new as Order)
                  : o
              )
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) =>
              prev.filter((o) => o.id !== (payload.old as Order).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, fetchOrders]);

  // ─── Update status ────────────────────────────────
  const updateStatus = async (orderId: string, newStatus: string) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchOrders(); // Revert on failure
    }
  };

  // ─── Analytics ────────────────────────────────────
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  // ═══════════════════════════════════════════════════
  // LOGIN GATE
  // ═══════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[80vh] px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white border border-warm-beige rounded-2xl p-10 shadow-xl shadow-warm-beige/30">
            <div className="w-16 h-16 bg-warm-beige/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-7 h-7 text-gray-500" />
            </div>
            <h1 className="font-serif text-3xl text-center text-gray-900 mb-2">
              Admin Access
            </h1>
            <p className="font-sans text-sm text-gray-500 text-center mb-8">
              Enter the secret key to access the Nayoori dashboard.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin key"
                className="w-full p-4 bg-white border border-gray-200 rounded-none shadow-sm focus:border-gray-900 focus:ring-0 outline-none transition-colors font-sans text-center tracking-widest"
              />
              {authError && (
                <p className="font-sans text-sm text-red-500 text-center">
                  {authError}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-4 bg-gray-900 text-white font-sans uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
              >
                Enter Dashboard
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // MAIN DASHBOARD
  // ═══════════════════════════════════════════════════
  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-1">
          Dashboard
        </h1>
        <p className="font-sans text-sm text-gray-500 tracking-widest uppercase">
          Nayoori Management Console
        </p>
      </motion.div>

      {/* ── Tab Bar ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-10"
      >
        <div className="flex gap-1 bg-warm-beige/30 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-3 font-sans text-xs uppercase tracking-widest rounded-lg transition-all duration-300 ${
              activeTab === "orders"
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-3 font-sans text-xs uppercase tracking-widest rounded-lg transition-all duration-300 ${
              activeTab === "products"
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="w-4 h-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-6 py-3 font-sans text-xs uppercase tracking-widest rounded-lg transition-all duration-300 ${
              activeTab === "categories"
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Categories
          </button>
          <button
            onClick={() => setActiveTab("banners")}
            className={`flex items-center gap-2 px-6 py-3 font-sans text-xs uppercase tracking-widest rounded-lg transition-all duration-300 ${
              activeTab === "banners"
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Banners
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-6 py-3 font-sans text-xs uppercase tracking-widest rounded-lg transition-all duration-300 ${
              activeTab === "settings"
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Settings className="w-4 h-4" />
            Site Settings
          </button>
        </div>
      </motion.div>

      {/* ── Tab Content ────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === "orders" ? (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── Summary Cards ─────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="bg-white border border-warm-beige rounded-2xl p-6 flex items-center gap-5">
                <div className="w-12 h-12 bg-warm-beige/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-gray-500">
                    Total Orders
                  </p>
                  <p className="font-serif text-3xl text-gray-900">{totalOrders}</p>
                </div>
              </div>

              <div className="bg-white border border-warm-beige rounded-2xl p-6 flex items-center gap-5">
                <div className="w-12 h-12 bg-warm-beige/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-gray-500">
                    Total Revenue
                  </p>
                  <p className="font-serif text-3xl text-gray-900">
                    ৳{totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-warm-beige rounded-2xl p-6 flex items-center gap-5">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-gray-500">
                    Pending
                  </p>
                  <p className="font-serif text-3xl text-gray-900">{pendingOrders}</p>
                </div>
              </div>
            </div>

            {/* ── Orders Table ──────────────────────────── */}
            <div className="bg-white border border-warm-beige rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-warm-beige flex items-center justify-between">
                <h2 className="font-serif text-xl text-gray-900">Recent Orders</h2>
                <button
                  onClick={fetchOrders}
                  className="font-sans text-xs tracking-widest uppercase text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Refresh
                </button>
              </div>

              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                  <p className="font-sans text-sm text-gray-500 mt-4">
                    Loading orders...
                  </p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-16 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="font-serif text-xl text-gray-900 mb-2">
                    No orders yet
                  </p>
                  <p className="font-sans text-sm text-gray-500">
                    Orders will appear here in real-time as customers place them.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-warm-beige/50">
                        <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500">
                          Order ID
                        </th>
                        <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500">
                          Customer
                        </th>
                        <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500 hidden md:table-cell">
                          Mobile
                        </th>
                        <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500">
                          Amount
                        </th>
                        <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500 hidden lg:table-cell">
                          Date
                        </th>
                        <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500">
                          Status
                        </th>
                        <th className="px-6 py-4 font-sans text-[10px] tracking-widest uppercase text-gray-500">
                          View
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="border-b border-warm-beige/30 hover:bg-warm-beige/10 transition-colors"
                        >
                          <td className="px-6 py-5 font-mono text-xs text-gray-500 max-w-[100px] truncate">
                            {order.id.slice(0, 8)}…
                          </td>
                          <td className="px-6 py-5 font-sans text-sm text-gray-900 font-medium">
                            {order.full_name}
                          </td>
                          <td className="px-6 py-5 font-sans text-sm text-gray-600 hidden md:table-cell">
                            {order.phone_number}
                          </td>
                          <td className="px-6 py-5 font-sans text-sm text-gray-900 font-medium">
                            ৳{order.total_amount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-5 font-sans text-xs text-gray-500 hidden lg:table-cell">
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-5">
                            <div className="relative inline-block">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateStatus(order.id, e.target.value)
                                }
                                className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-sans font-medium rounded-full border cursor-pointer focus:outline-none ${
                                  STATUS_COLORS[order.status] ||
                                  "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60" />
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 hover:bg-warm-beige/30 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        ) : activeTab === "products" ? (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ProductManager />
          </motion.div>
        ) : activeTab === "categories" ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <CategoryManager />
          </motion.div>
        ) : activeTab === "banners" ? (
          <motion.div
            key="banners"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <BannerManager />
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SiteSettingsManager />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Order Detail Modal ────────────────────── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-warm-beige flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="font-serif text-2xl text-gray-900">
                    Order Details
                  </h3>
                  <p className="font-mono text-xs text-gray-500 mt-1">
                    {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-warm-beige/30 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-1">
                      Customer Name
                    </p>
                    <p className="font-sans text-sm text-gray-900 font-medium">
                      {selectedOrder.full_name}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-1">
                      Mobile Number
                    </p>
                    <p className="font-sans text-sm text-gray-900 font-medium">
                      {selectedOrder.phone_number}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-1">
                      Delivery Area
                    </p>
                    <p className="font-sans text-sm text-gray-900 font-medium">
                      {selectedOrder.delivery_area}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-sans font-medium rounded-full border ${
                        STATUS_COLORS[selectedOrder.status] ||
                        "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-1">
                    Shipping Address
                  </p>
                  <p className="font-sans text-sm text-gray-900 bg-warm-beige/10 p-4 rounded-xl border border-warm-beige/30">
                    {selectedOrder.full_address}
                  </p>
                </div>

                {/* Ordered Products */}
                <div>
                  <p className="font-sans text-[10px] tracking-widest uppercase text-gray-500 mb-3">
                    Products Ordered
                  </p>
                  <div className="space-y-4">
                    {(selectedOrder.cart_items || []).map(
                      (item: CartItem, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 bg-warm-beige/10 rounded-xl border border-warm-beige/30"
                        >
                          <div className="flex-1">
                            <p className="font-serif text-gray-900">
                              {item.title}
                            </p>
                            <p className="font-sans text-xs text-gray-500 capitalize mt-1">
                              {item.color} • {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-sans text-sm font-medium text-gray-900">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Order Total */}
                <div className="pt-4 border-t border-warm-beige flex justify-between items-center">
                  <span className="font-sans text-sm tracking-widest uppercase text-gray-500">
                    Total Amount
                  </span>
                  <span className="font-serif text-2xl text-gray-900">
                    ৳{selectedOrder.total_amount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
