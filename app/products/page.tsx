import { Header } from '@/components/storefront/Header'
import ProductsAdCard from '@/components/storefront/ProductsAdCard'
import ProductsGallerySection from '@/components/storefront/ProductsGallerySection'
import React from 'react'

const Products = () => {
  return (
    <main className='w-full'>
       <ProductsAdCard/>
       <ProductsGallerySection/>
    </main>
  )
}

export default Products