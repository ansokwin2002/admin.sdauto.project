import { MembershipTier } from "@/types/loyalty";

export interface OrganizationEntity {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  image: string;
}

export const organization: OrganizationEntity[] = [
  {
    id: "hq",
    name: "Headquarters (HQ)",
    address: "123 Main St, Los Angeles, CA 90038",
    phone: "123-456-7890",
    email: "hq@example.com",
    website: "https://www.hq.com",
    hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm, Sun: Closed",
    image: ""
  },
  {
    id: "br-1",
    name: "Los Angeles Branch",
    address: "123 Main St, Los Angeles, CA 90038",
    phone: "123-456-7890",
    email: "losangeles@example.com",
    website: "https://www.losangelesbranch.com",
    hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm, Sun: Closed",
    image: ""
  },
  {
    id: "br-2",
    name: "Avenue Mall Branch",
    address: "456 Main St, Los Angeles, CA 90038",
    phone: "123-456-7890",
    email: "avenuebranch@example.com",
    website: "https://www.avenuebranch.com",
    hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm, Sun: Closed",
    image: ""
  },
  {
    id: "br-3",
    name: "San Francisco Branch",
    address: "789 Main St, Los Angeles, CA 90038",
    phone: "123-456-7890",
    email: "sanfrancisco@example.com",
    website: "https://www.sanfranciscobranch.com",
    hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm, Sun: Closed",
    image: ""
  }
];

export const ingredientItemCategories = [
  'Vegetables',
  'Meat',
  'Dairy',
  'Beverages',
  'Dry Goods',
  'Spices',
  'Seafood',
  'Bakery',
  'Fruits',
  'Nuts',
  'Legumes',
  'Grains',
  'Herbs',
  'Mushrooms',
  'Oils',
  'Other'
];

export const unitOfMeasures = [
  'kg',
  'g',
  'l',
  'ml',
  'pcs'
];

export const recipeCategories = ["Main Course", "Dessert", "Appetizer"];

