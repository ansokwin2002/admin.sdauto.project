import { Box, ReceiptText, TrendingDown, TrendingUp, Utensils } from "lucide-react"
import { menuCategories, menuItems } from "@/data/MenuData"
import MetricCard from "@/components/common/MetricCard"
import { Heading } from "@radix-ui/themes"

export function CategoryDashboard() {
  // Calculate statistics
  const totalCategories = menuCategories.length

  // Calculate items per category
  const itemsPerCategory = menuCategories.map(category => ({
    id: category.id,
    name: category.name,
    count: menuItems.filter(item => item.category === category.id).length
  }))

  // Find category with most items
  const categoryWithMostItems = itemsPerCategory.reduce((prev, current) => 
    (prev.count > current.count) ? prev : current
  )

  // Find category with least items
  const categoryWithLeastItems = itemsPerCategory.reduce((prev, current) => 
    (prev.count < current.count) ? prev : current
  )

  // Mock data for top and least selling categories (since we don't have actual sales data)
  const topSellingCategory = { name: "Main Course", sales: 1250 }
  const leastSellingCategory = { name: "Beverages", sales: 450 }

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