"use client";

import { useState, useEffect } from "react";
import VendorHeader from "@/components/vendor/VendorHeader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Package,
  ShoppingCart,
  DollarSign,
  RefreshCw,
  Plus,
} from "lucide-react";
import vendorService from "@/services/api/vendor";

import Spinner from "@/components/Spinner";

// TypeScript interfaces for dashboard data
interface VendorStats {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingOrders: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "draft";
  category: string;
  createdAt: string;
}

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  orderDate: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: number;
}

interface DashboardData {
  stats: VendorStats;
  recentOrders: Order[];
  popularProducts: Product[];
  inventoryAlerts: Product[];
}

type MyProduct = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  moq?: number;
  category?: string;
};

import dynamic from "next/dynamic";
const VendorProductCard = dynamic(
  () => import("@/components/vendor/VendorProductCard"),
  { ssr: false }
);

function VendorProductsGrid() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<MyProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await vendorService.getMyProducts();
        if (!res.success)
          throw new Error(res.message || "Failed to load products");
        const data = res.data?.data || res.data;
        if (mounted) setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (mounted) setError(e.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-80 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <VendorProductCard
            key={p.id}
            id={p.id}
            title={p.name}
            image={p.image}
            price={`₦${p.price.toFixed(2)}`}
            quantity={p.quantity}
            moq={p.moq || 1}
            category={p.category}
          />
        ))}
      </div>
    </div>
  );
}

export default function VendorDashboard() {
  // Add custom vendor header
  // ...existing code...
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  // Fetch dashboard data from the API
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await vendorService.getDashboardStats();
      console.log(response, "Vendor Response");
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch dashboard data");
      }

      // Ensure the response data has the expected structure
      const data = response.data.data;
      if (!data || typeof data !== "object") {
        throw new Error("Invalid dashboard data structure");
      }

      // Set the dashboard data with proper type checking and defaults
      setDashboardData({
        stats: {
          totalProducts: Number(data.stats?.totalProducts) || 0,
          totalOrders: Number(data.stats?.totalOrders) || 0,
          totalSales: Number(data.stats?.totalSales) || 0,
          totalRevenue: Number(data.stats?.totalRevenue) || 0,
          lowStockProducts: Number(data.stats?.lowStockProducts) || 0,
          pendingOrders: Number(data.stats?.pendingOrders) || 0,
        },
        recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
        popularProducts: Array.isArray(data.popularProducts)
          ? data.popularProducts
          : [],
        inventoryAlerts: Array.isArray(data.inventoryAlerts)
          ? data.inventoryAlerts
          : [],
      });
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err.message || "Failed to load dashboard data. Please try again."
      );

      // Set example data for development purposes
      setDashboardData({
        stats: {
          totalProducts: 42,
          totalOrders: 128,
          totalSales: 210,
          totalRevenue: 15750.5,
          lowStockProducts: 5,
          pendingOrders: 8,
        },
        recentOrders: [
          {
            id: "ORD-1234",
            customer: {
              name: "John Doe",
              email: "john@example.com",
            },
            orderDate: "2025-06-03T10:30:00.000Z",
            status: "pending",
            total: 129.99,
            items: 3,
          },
          {
            id: "ORD-1233",
            customer: {
              name: "Jane Smith",
              email: "jane@example.com",
            },
            orderDate: "2025-06-02T14:15:00.000Z",
            status: "shipped",
            total: 79.5,
            items: 2,
          },
          {
            id: "ORD-1232",
            customer: {
              name: "Michael Johnson",
              email: "michael@example.com",
            },
            orderDate: "2025-06-01T09:45:00.000Z",
            status: "delivered",
            total: 199.99,
            items: 1,
          },
        ],
        popularProducts: [
          {
            id: "PROD-101",
            name: "Premium Headphones",
            price: 129.99,
            stock: 15,
            status: "active",
            category: "Electronics",
            createdAt: "2025-01-15T00:00:00.000Z",
          },
          {
            id: "PROD-102",
            name: "Wireless Charger",
            price: 49.99,
            stock: 28,
            status: "active",
            category: "Electronics",
            createdAt: "2025-02-10T00:00:00.000Z",
          },
        ],
        inventoryAlerts: [
          {
            id: "PROD-103",
            name: "Bluetooth Speaker",
            price: 79.99,
            stock: 2,
            status: "active",
            category: "Electronics",
            createdAt: "2025-01-20T00:00:00.000Z",
          },
          {
            id: "PROD-104",
            name: "Smart Watch",
            price: 199.99,
            stock: 3,
            status: "active",
            category: "Electronics",
            createdAt: "2025-02-05T00:00:00.000Z",
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status]);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Navigate to add product page
  const handleAddProduct = () => {
    router.push("/vendor/products/new");
  };

  // Navigate to view all orders
  const handleViewAllOrders = () => {
    router.push("/vendor/orders");
  };

  // Navigate to product inventory
  const handleViewInventory = () => {
    router.push("/vendor/products");
  };

  // Show loading state immediately
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{error}</span>
          <Button
            variant="link"
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={handleRefresh}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold">No Data Available</h2>
          <p className="text-gray-500">Please try refreshing the page</p>
          <Button variant="outline" className="mt-4" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <VendorHeader /> */}
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.stats?.totalProducts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.stats?.lowStockProducts || 0} low in stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.stats?.totalOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.stats?.pendingOrders || 0} pending orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                #{(dashboardData?.stats?.totalRevenue || 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.stats?.totalSales || 0} total sales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Vendor Products Grid */}
        <VendorProductsGrid />

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Latest orders from your customers
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.recentOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        {dashboardData?.inventoryAlerts &&
          dashboardData.inventoryAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Low Stock Alerts</CardTitle>
                    <CardDescription>
                      Products that need attention
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData?.inventoryAlerts?.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.status === "active"
                                ? "default"
                                : product.status === "inactive"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
      </div>
    </>
  );
}
