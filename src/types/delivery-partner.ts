export interface DeliveryPartner {
  id: number;
  title: string;
  description?: string | null;
  image?: string | null;
  url_link?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryPartnerFormData {
  title: string;
  description?: string;
  image?: File | null;
  url_link?: string;
}

export interface DeliveryPartnerUrlFormData {
  title: string;
  description?: string;
  image_url?: string;
  url_link?: string;
}
