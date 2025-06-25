import { Header } from '@/components/storefront/Header'
import ProductsAdCard from '@/components/storefront/ProductsAdCard'
import ProductsGallerySection from '@/components/storefront/ProductsGallerySection'
import React from 'react'
import { getProducts } from '@/services/api/products';

export default async function Products() {
  // SSR: Fetch first page of products
  const { products: initialProducts, pagination } = await getProducts(1, 20);

  return (
    <main className='w-full'>
       <ProductsAdCard/>
       <ProductsGallerySection initialProducts={initialProducts} />
    </main>
  )
}