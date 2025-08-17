import React, { useEffect, useState } from 'react'
import { listProducts } from '../lib/api'
import { socket } from '../lib/socket'
import CartButton from '../components/CartButton'

export default function App() {
  const [products, setProducts] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    load()
    socket.on('inventory:update', ({ productId, stock }) => {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock } : p))
    })
    socket.on('price:update', ({ productId, price }) => {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, price } : p))
    })
    return () => {
      socket.off('inventory:update')
      socket.off('price:update')
    }
  }, [])

  async function load() {
    const data = await listProducts({ q, category })
    setProducts(data)
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Beauty Shop</h1>
        <a href="#" className="text-sm underline">My Orders</a>
      </header>

      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." className="border rounded px-3 py-2 w-full" />
        <select value={category} onChange={e=>setCategory(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All</option>
          <option>Makeup</option>
          <option>Skincare</option>
        </select>
        <button onClick={load} className="px-4 py-2 bg-black text-white rounded">Search</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white border rounded-xl overflow-hidden shadow">
            <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.category}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold">${Number(p.price).toFixed(2)}</span>
                <span className={`text-xs ${p.stock>0?'text-green-600':'text-red-600'}`}>
                  {p.stock>0? `${p.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="mt-3">
                <CartButton product={p} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
