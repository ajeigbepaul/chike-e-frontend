export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string;
  isActive: boolean;
  level: number;
  ancestors: { _id: string; name: string }[];
  path: string;
  order: number;
  image?: string; // Optional image field
  subcategories?: Category[];
}
