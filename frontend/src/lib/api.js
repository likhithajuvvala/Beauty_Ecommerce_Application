const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function token() {
  return localStorage.getItem('token');
}

export async function listProducts({ q, category }) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  const res = await fetch(`${API}/api/products?${params}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}

export async function myOrders() {
  const res = await fetch(`${API}/api/cart/my`, { headers: { Authorization: `Bearer ${token()}` } });
  if (!res.ok) throw new Error('Not logged in');
  return res.json();
}

export async function checkout(items) {
  const res = await fetch(`${API}/api/cart/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    body: JSON.stringify({ items })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function socketUrl() { return API; }
