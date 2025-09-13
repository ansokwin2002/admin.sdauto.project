
export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  part_number: string;
  condition: string;
  quantity: number;
  original_price: string;
  price: string;
  formatted_original_price: string;
  formatted_price: string;
  discount_percentage: number;
  discount_amount: number;
  has_discount: boolean;
  is_on_sale: boolean;
  description: string;
  images: string[];
  videos: string[];
  primary_image: string;
  is_active: boolean;
  in_stock: boolean;
  stock_status: string;
  is_low_stock: boolean;
  total_value: number;
  total_original_value: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProductsResponse {
  data: Product[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
