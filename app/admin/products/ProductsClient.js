'use client'
import { useState, useEffect, useCallback } from 'react'
import AdminNav from '../AdminNav'
import ProductForm from './ProductForm'

export default function ProductsClient() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    const res = await fetch(`/api/products?page=${page}&limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setProducts(data.products || [])
    setTotalPages(data.pagination?.pages || 1)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    const token = localStorage.getItem('admin_token')
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchProducts()
  }

  const handleEdit = (product) => {
    setEditProduct(product)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditProduct(null)
    fetchProducts()
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Products</h1>
            <button
              onClick={() => { setEditProduct(null); setShowForm(true) }}
              className="btn-gold px-4 py-2 rounded-lg text-sm"
            >
              + Add Product
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-[#111] border border-[#c9a84c]/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <ProductForm product={editProduct} onClose={handleFormClose} />
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-gray-400">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌹</div>
              <p className="text-gray-400 mb-4">No products yet</p>
              <button onClick={() => setShowForm(true)} className="btn-gold px-6 py-2 rounded-lg">
                Add First Product
              </button>
            </div>
          ) : (
            <>
              <div className="card-dark rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#c9a84c]/20">
                      <th className="text-left p-4 text-gray-400 font-medium">Product</th>
                      <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Category</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Price</th>
                      <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Status</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b border-[#c9a84c]/10 hover:bg-white/2">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center overflow-hidden flex-shrink-0">
                              {product.images?.[0] ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              ) : '🌹'}
                            </div>
                            <div>
                              <p className="text-white font-medium">{product.name}</p>
                              <p className="text-gray-500 text-xs">{product.salesCount} sold</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-400 hidden md:table-cell capitalize">
                          {product.category?.replace('-', ' ')}
                        </td>
                        <td className="p-4 text-[#c9a84c] font-semibold">
                          PKR {product.price?.toLocaleString()}
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {product.isFeatured && (
                              <span className="text-xs bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-0.5 rounded-full">Featured</span>
                            )}
                            {product.isHeroSlide && (
                              <span className="text-xs bg-purple-900/40 text-purple-400 px-2 py-0.5 rounded-full">Hero</span>
                            )}
                            {!product.inStock && (
                              <span className="text-xs bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full">Out of Stock</span>
                            )}
                            {product.inStock && !product.isFeatured && (
                              <span className="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">Active</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-xs btn-outline-gold px-3 py-1 rounded-lg"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-xs border border-red-500/40 text-red-400 hover:bg-red-900/20 px-3 py-1 rounded-lg transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${p === page ? 'btn-gold' : 'btn-outline-gold'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
