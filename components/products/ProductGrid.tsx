import ProductCard, { type ProductCardProduct } from './ProductCard'

type Props = {
  products: ProductCardProduct[]
  columns?: 3 | 4
}

export default function ProductGrid({ products, columns = 3 }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">Ürün bulunamadı.</p>
      </div>
    )
  }

  const gridCols =
    columns === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid ${gridCols} gap-5`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
