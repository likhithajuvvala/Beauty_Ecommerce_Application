import React, { useState } from 'react'
import { checkout } from '../lib/api'

export default function CartButton({ product }) {
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleBuy() {
    setLoading(true); setMessage('')
    try {
      const res = await checkout([{ productId: product.id, quantity: Number(qty) }])
      setMessage(`Order placed! Total $${res.total.toFixed(2)}`)
    } catch (e) {
      setMessage(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} className="border rounded px-2 py-1 w-16" />
      <button disabled={loading} onClick={handleBuy} className="px-3 py-2 bg-pink-600 text-white rounded">
        {loading? 'Processing...' : 'Buy'}
      </button>
      {message && <span className="text-xs ml-2">{message}</span>}
    </div>
  )
}
