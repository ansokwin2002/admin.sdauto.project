'use client';

import { PageHeading } from "@/components/common/PageHeading"
import { CategoryDashboard } from "@/components/menu-management/categories/CategoryDashboard"
import { CategoryList } from "@/components/menu-management/categories/CategoryList"
import { usePageTitle } from "@/hooks/usePageTitle"

export default function CategoriesPage() {
  usePageTitle('Categories');
  
  return (
    <div className="space-y-8">
      <PageHeading title="Categories" description="Create and manage menu categories" />
      <CategoryDashboard />
      <CategoryList />
    </div>
  )
} 