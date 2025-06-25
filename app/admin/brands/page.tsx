"use client";
import { useQuery } from '@tanstack/react-query';
import brandService from '@/services/api/brand';
import Link from 'next/link';

export default function AdminBrandsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandService.getAllBrands(),
  });
  const brands = data?.data || [];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        <Link href="/admin/brands/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Add New Brand</Link>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Failed to load brands.</div>
      ) : brands.length === 0 ? (
        <div>No brands found.</div>
      ) : (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id} className="border-t">
                <td className="p-2">{brand.name}</td>
                <td className="p-2">{brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 