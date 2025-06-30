// import { ProductForm } from '@/components/admin/ProductForm'
// // import { getProductById } from '@/lib/api/products'

// export default async function ProductDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const { id } = await params;
// //   const product = await getProductById(id)

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">
//         {/* {product ? 'Edit Product' : 'Product Not Found'} */}
//       </h1>
//       {/* {product && <ProductForm product={product} />} */}
//       <ProductForm product={{
//         _id: '1',
//         name: 'Product 1',
//         description: 'Description 1',
//         price: 100,
//         quantity: 10,
//         category: 'Category 1',
//         imageCover: 'https://via.placeholder.com/150',
//         priceUnit: 'piece',
//         images: [],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }}/>
//     </div>
//   )
// }

import React from 'react'

function ProductDetails() {
  return (
    <div>page</div>
  )
}

export default ProductDetails