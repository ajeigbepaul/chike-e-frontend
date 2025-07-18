import { Category } from "@/app/admin/categories/types";

export interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: string;
}

export interface Weight {
  value?: number;
  unit?: string;
}

export interface Brand {
  _id: string;
  name: string;
  createdAt?: string;
}

export interface Vendor {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
}

export interface Product {
  updatedAt: any;
  _id: string;
  name: string;
  description: string;
  summary?: string;
  price: number;
  priceUnit: string;
  priceDiscount?: number;
  category: Category | string;
  categoryName?: string;
  subCategories?: string[];
  brand?: Brand | string;
  vendor?: Vendor | string;
  vendorName?: string;
  quantity: number;
  imageCover: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  serialNumber?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  features?: string[];
  specifications?: Array<{
    key: string;
    value: string;
  }>;
  isActive: boolean;
  isBulk: boolean;
  minBulkQuantity?: number;
  bulkDiscountPercentage?: number;
  stockQuantity?: number;
  lowStockThreshold?: number;
  weight?: {
    value: number;
    unit: string;
  };
  tags?: string[];
  attributes?: Array<{
    name: string;
    values: string[];
  }>;
  variants?: Array<{
    attributes: Array<{
      name: string;
      value: string;
    }>;
    price: number;
    quantity: number;
  }>;
  rating?: number;
  reviews?: any[];
  isFavorite?: boolean;
  createdAt: string;
}

export type CategoryType = Category;

export interface ProductFormData {
  _id?: string;
  name: string;
  description: string;
  summary?: string;
  price: number;
  priceDiscount?: number;
  priceUnit: string;
  category: string;
  brand?: string;
  images: string[];
  imageCover: string;
  quantity: number;
  serialNumber?: string;
  dimensions?: Dimensions;
  weight?: Weight;
  colors?: string[];
  sizes?: string[];
  features?: string[];
  specifications?: Array<{ key: string; value: string }>;
  isBulk?: boolean;
  minBulkQuantity?: number;
  bulkDiscountPercentage?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  variants?: Array<{
    attributes: Array<{
      name: string;
      value: string;
    }>;
    price: number;
    quantity: number;
  }>;
  vendor?: string;
}

export interface AttributeType {
  _id: string;
  name: string;
  type: string;
  options?: string[];
  required: boolean;
  order: number;
}
