import { Product } from '../db.js';
import { computeDynamicPrice } from '../services/pricingService.js';

export async function previewPrice(req, res) {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  const price = computeDynamicPrice(product);
  res.json({ productId: product.id, previewPrice: price });
}
