import { createContext, useContext, useState, ReactNode } from "react";
import {
  Product,
  Supplier,
  Order,
  StockMovement,
  Category,
  Alert,
} from "../types";
import {
  products as initialProducts,
  suppliers as initialSuppliers,
  orders as initialOrders,
  stockMovements as initialMovements,
  categories as initialCategories,
  alerts as initialAlerts,
} from "../data/mockData";

interface InventoryContextType {
  // Data
  products: Product[];
  suppliers: Supplier[];
  orders: Order[];
  stockMovements: StockMovement[];
  categories: Category[];
  alerts: Alert[];

  // Product Actions
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Supplier Actions
  addSupplier: (
    supplier: Omit<Supplier, "id" | "createdAt" | "totalOrders">,
  ) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Order Actions
  addOrder: (
    order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">,
  ) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;

  // Stock Actions
  addStockMovement: (movement: Omit<StockMovement, "id" | "createdAt">) => void;

  // Alert Actions
  markAlertAsRead: (id: string) => void;

  // Stats
  getStats: () => {
    totalProducts: number;
    totalCategories: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalValue: number;
    pendingOrders: number;
  };
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined,
);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [stockMovements, setStockMovements] =
    useState<StockMovement[]>(initialMovements);
  const [categories] = useState<Category[]>(initialCategories);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const generateId = () => Math.random().toString(36).substr(2, 9);
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  // Product Actions
  const addProduct = (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: getCurrentDate() } : p,
      ),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Supplier Actions
  const addSupplier = (
    supplier: Omit<Supplier, "id" | "createdAt" | "totalOrders">,
  ) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: generateId(),
      createdAt: getCurrentDate(),
      totalOrders: 0,
    };
    setSuppliers((prev) => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // Order Actions
  const addOrder = (
    order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">,
  ) => {
    const prefix = order.type === "purchase" ? "PO" : "SO";
    const orderNumber = `${prefix}-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, "0")}`;

    const newOrder: Order = {
      ...order,
      id: generateId(),
      orderNumber,
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    };
    setOrders((prev) => [...prev, newOrder]);

    // Update stock based on order
    if (order.status === "completed") {
      order.items.forEach((item) => {
        const quantityChange =
          order.type === "purchase" ? item.quantity : -item.quantity;
        updateProduct(item.productId, {
          quantity:
            (products.find((p) => p.id === item.productId)?.quantity || 0) +
            quantityChange,
        });
      });
    }
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status, updatedAt: getCurrentDate() } : o,
      ),
    );
  };

  // Stock Movement Actions
  const addStockMovement = (
    movement: Omit<StockMovement, "id" | "createdAt">,
  ) => {
    const newMovement: StockMovement = {
      ...movement,
      id: generateId(),
      createdAt: getCurrentDate(),
    };
    setStockMovements((prev) => [...prev, newMovement]);

    // Update product quantity
    const product = products.find((p) => p.id === movement.productId);
    if (product) {
      const quantityChange =
        movement.type === "in"
          ? movement.quantity
          : movement.type === "out"
            ? -movement.quantity
            : movement.quantity;
      updateProduct(movement.productId, {
        quantity: Math.max(0, product.quantity + quantityChange),
      });
    }
  };

  // Alert Actions
  const markAlertAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a)),
    );
  };

  // Stats
  const getStats = () => {
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const lowStockItems = products.filter(
      (p) => p.quantity > 0 && p.quantity <= p.minStock,
    ).length;
    const outOfStockItems = products.filter((p) => p.quantity === 0).length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.quantity * p.costPrice,
      0,
    );
    const pendingOrders = orders.filter((o) => o.status === "pending").length;

    return {
      totalProducts,
      totalCategories,
      lowStockItems,
      outOfStockItems,
      totalValue,
      pendingOrders,
    };
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        suppliers,
        orders,
        stockMovements,
        categories,
        alerts,
        addProduct,
        updateProduct,
        deleteProduct,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addOrder,
        updateOrderStatus,
        addStockMovement,
        markAlertAsRead,
        getStats,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
