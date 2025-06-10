export interface Category {
  _id: string;
  name: string;
  parent?: string;
  isActive: boolean;
  level: number;
  ancestors: { _id: string; name: string }[];
  path: string;
  order: number;
  subcategories?: Category[];
} 