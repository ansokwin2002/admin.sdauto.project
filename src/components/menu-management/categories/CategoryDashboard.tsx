"use client"

import { Box, ReceiptText, TrendingDown, TrendingUp, Utensils } from "lucide-react"
import MetricCard from "@/components/common/MetricCard"
import { Heading } from "@radix-ui/themes"
import { useState, useEffect } from "react"
import axios from "axios"
import { API_BASE_URL } from "@/utilities/constants"
import { toast } from "sonner"

interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  status: boolean;
  items_count: number; // Assuming API provides this
}

interface MenuItem {
  id: string;
  name: string;
  category_id: string; // Assuming menu items link to categories by category_id
  // ... other menu item properties
}

export function CategoryDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const categoriesResponse = await axios.get(`${API_BASE_URL}/api/admin/categories`, { headers });
        setCategories(categoriesResponse.data.data || categoriesResponse.data);

        // Assuming an API endpoint for menu items exists
        const menuItemsResponse = await axios.get(`${API_BASE_URL}/api/admin/menu-items`, { headers });
        setMenuItems(menuItemsResponse.data.data || menuItemsResponse.data);
      } catch (error) {
        toast.error('Failed to load dashboard data.');
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Loading..."
          value=""
          description="Fetching data"
          icon={<Utensils size={16} />}
        />
      </div>
    );
  }

  // Calculate statistics
  const totalCategories = categories.length;

  // Calculate items per category
  const itemsPerCategory = categories.map(category => ({
    id: category.id,
    name: category.name,
    count: menuItems.filter(item => item.category_id === category.id).length
  }));

  // Find category with most items
  const categoryWithMostItems = itemsPerCategory.reduce((prev, current) => 
    (prev.count > current.count) ? prev : current, { id: '', name: 'N/A', count: 0 }
  );

  // Find category with least items
  const categoryWithLeastItems = itemsPerCategory.reduce((prev, current) => 
    (prev.count < current.count) ? prev : current, { id: '', name: 'N/A', count: Infinity }
  );

  // Mock data for top and least selling categories (since we don't have actual sales data)
  // These would ideally come from a sales API
  const topSellingCategory = { name: "Main Course", sales: 1250 };
  const leastSellingCategory = { name: "Beverages", sales: 450 };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Categories"
        value={totalCategories}
        description="Total number of menu categories"
        icon={<ReceiptText size={16} />}
      />
      <MetricCard
        title="Top Selling Category"
        value={topSellingCategory.name}
        description={`${topSellingCategory.sales} sales`}
        icon={<TrendingUp size={16} color="green" />}
        trend="up"
        trendValue="+12%"
      />
      <MetricCard
        title="Least Selling Category"
        value={leastSellingCategory.name}
        description={`${leastSellingCategory.sales} sales`}
        icon={<TrendingDown size={16} color="red" />}
        trend="down"
        trendValue="-5%"
      />
      <MetricCard
        title="Category with Most Items"
        value={categoryWithMostItems.name}
        description={`${categoryWithMostItems.count} items`}
        icon={<Utensils size={16} color="blue" />}
      />
    </div>
  )
}