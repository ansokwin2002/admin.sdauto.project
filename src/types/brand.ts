export interface Brand {
  id: number;
  brand_name: string;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BrandFormData {
  brand_name: string;
}

export interface BrandWithProducts extends Brand {
  products?: Array<{
    id: number;
    name: string;
    price: number;
    is_active: boolean;
  }>;
}
