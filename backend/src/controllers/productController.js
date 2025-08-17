import { Product } from '../db.js';
import { computeDynamicPrice } from '../services/pricingService.js';
import { broadcastInventory, broadcastPrice } from '../services/socket.js';
import { Op } from 'sequelize';

export async function listProducts(req, res) {
  const { q, category, minPrice, maxPrice } = req.query;
  const where = {};
  if (q) where.name = { [Op.like]: `%${q}%` };
  if (category) where.category = category;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice);
    if (maxPrice) where.price[Op.lte] = Number(maxPrice);
  }
  const products = await Product.findAll({ where, order: [['createdAt','DESC']], limit: 100 });
  res.json(products);
}

export async function getProduct(req, res) {
  const p = await Product.findByPk(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
}

export async function createProduct(req, res) {
  const body = req.body;
  const basePrice = Number(body.basePrice || body.price || 10);
  const product = await Product.create({
    name: body.name, description: body.description, category: body.category,
    price: basePrice, basePrice, stock: body.stock ?? 0, imageUrl: body.imageUrl
  });
  broadcastInventory(product);
  broadcastPrice(product);
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  const updates = req.body;
  Object.assign(product, updates);
  product.price = computeDynamicPrice(product);
  await product.save();
  broadcastInventory(product);
  broadcastPrice(product);
  res.json(product);
}
