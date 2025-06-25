"use client";
import { useState } from 'react';
import brandService from '@/services/api/brand';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewBrandPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const response = await brandService.createBrand({ name });
    setLoading(false);
    if (response.success) {
      setSuccess(true);
      setName('');
      setTimeout(() => router.push('/admin/brands'), 1200);
    } else {
      setError(response.message || 'Failed to create brand');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Brand</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Brand Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            minLength={2}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Brand'}
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Brand created!</div>}
      </form>
      <div className="mt-6">
        <Link href="/admin/brands" className="text-blue-600 hover:underline">Back to Brands</Link>
      </div>
    </div>
  );
} 