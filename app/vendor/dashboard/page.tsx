"use client";

import { useState, useEffect } from "react";
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
  BarChart,
  Package,
  ShoppingCart,
  DollarSign,
  Layers,
  AlertTriangle,
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

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Fetch dashboard data from the API
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await vendorService.getDashboardStats();
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      setDashboardData(response.data);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data. Please try again.");
      
      // Set example data for development purposes
      setDashboardData({
        stats: {
          totalProducts: 42,
          totalOrders: 128,
          totalSales: 210,
          totalRevenue: 15750.50,
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
            total: 79.50,
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

  // Handle pending orders view
  const handleViewPendingOrders = () => {
    router.push("/vendor/orders?status=pending");
  };

  // Navigate to product inventory
  const handleViewInventory = () => {
    router.push("/vendor/products");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Error state
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.stats.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total products in your inventory
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.stats.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Orders received to date
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.stats.totalSales || 0}</div>
            <p className="text-xs text-muted-foreground">
              Products sold to date
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardData?.stats.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Total revenue generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={dashboardData?.stats.lowStockProducts ? "border-yellow-300" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${dashboardData?.stats.lowStockProducts ? "text-yellow-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.stats.lowStockProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Products with low inventory
            </p>
            {dashboardData?.stats.lowStockProducts ? (
              <Button variant="link" className="p-0 h-auto mt-2" onClick={handleViewInventory}>
                View inventory
              </Button>
            ) : null}
          </CardContent>
        </Card>
        
        <Card className={dashboardData?.stats.pendingOrders ? "border-blue-300" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className={`h-4 w-4 ${dashboardData?.stats.pendingOrders ? "text-blue-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.stats.pendingOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              Orders awaiting processing
            </p>
            {dashboardData?.stats.pendingOrders ? (
              <Button variant="link" className="p-0 h-auto mt-2" onClick={handleViewPendingOrders}>
                View pending orders
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" onClick={handleViewAllOrders}>
              View All
            </Button>
          </div>
          <CardDescription>
            Latest customer orders for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData?.recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No recent orders found</TableCell>
                </TableRow>
              ) : (
                dashboardData?.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{format(new Date(order.orderDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "delivered" 
                            ? "default" 
                            : order.status === "shipped" 
                              ? "secondary" 
                              : order.status === "pending"
                                ? "outline"
                                : order.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="text-right">
                      ${order.total.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inventory Alerts */}
      {dashboardData?.inventoryAlerts && dashboardData.inventoryAlerts.length > 0 && (
        <Card className="border-yellow-300">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Inventory Alerts
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleViewInventory}>
                Manage Inventory
              </Button>
            </div>
            <CardDescription>
              Products with low stock levels that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.inventoryAlerts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-red-500 font-bold">{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "active" 
                            ? "default" 
                            : product.status === "inactive" 
                              ? "secondary" 
                              : "outline"
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

      {/* Popular Products */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Popular Products</CardTitle>
            <Button variant="outline" size="sm" onClick={handleViewInventory}>
              View All Products
            </Button>
          </div>
          <CardDescription>
            Your best-selling products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData?.popularProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">No products found</TableCell>
                </TableRow>
              ) : (
                dashboardData?.popularProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "active" 
                            ? "default" 
                            : product.status === "inactive" 
                              ? "secondary" 
                              : "outline"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

