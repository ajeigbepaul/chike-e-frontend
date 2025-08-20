export interface Promotion {
  _id: string;
  name: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableTo:'all_products';
  // applicableTo: 'all_products' | 'specific_products' | 'specific_categories';
  products?: string[]; // Array of product IDs
  categories?: string[]; // Array of category IDs
  minimumOrderAmount?: number;
  // maximumDiscountAmount?: number;
  usageLimit?: number;
  usedCount?: number;
  createdAt: string;
  updatedAt: string;
}
