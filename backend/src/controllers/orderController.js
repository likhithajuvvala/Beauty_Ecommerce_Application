import { Product, Order, OrderItem } from '../db.js';
import { recordSale, computeDynamicPrice } from '../services/pricingService.js';
import { broadcastInventory, broadcastPrice } from '../services/socket.js';

export async function checkout(req, res) {
  const { items } = req.body; // [{productId, quantity}]
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Cart is empty' });

  const ids = items.map(i => i.productId);
  const products = await Product.findAll({ where: { id: ids } });
  const byId = Object.fromEntries(products.map(p => [String(p.id), p]));
  let total = 0;
  const order = await Order.create({ userId: req.user.sub, total: 0, status: 'paid' });

  for (const { productId, quantity } of items) {
    const p = byId[productId];
    if (!p || p.stock < quantity) return res.status(400).json({ message: `Insufficient stock for ${p?.name || productId}` });
    p.price = computeDynamicPrice(p);
    total += Number(p.price) * quantity;
    await OrderItem.create({ orderId: order.id, productId: p.id, name: p.name, quantity, pricePaid: p.price });
  }

  // adjust stock and demand
  for (const { productId, quantity } of items) {
    const p = byId[productId];
    p.stock -= quantity;
    recordSale(p, quantity);
    p.price = computeDynamicPrice(p);
    await p.save();
    broadcastInventory(p);
    broadcastPrice(p);
  }

  order.total = total;
  await order.save();
  res.status(201).json({ orderId: order.id, total: Math.round(total * 100) / 100 });
}

export async function myOrders(req, res) {
  const orders = await Order.findAll({ where: { userId: req.user.sub }, order: [['createdAt','DESC']] });
  res.json(orders);
}
