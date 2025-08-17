export function computeDynamicPrice(product) {
  const base = Number(product.basePrice);
  const demandFactor = 1 + Math.min(product.demandScore || 0, 50) / 200; // up to +25%
  const stockFactor = product.stock <= 5 ? 1.15 : product.stock >= 100 ? 0.9 : 1.0;
  const hours = new Date().getHours();
  const timeFactor = (hours >= 18 && hours <= 22) ? 1.05 : 1.0; // evening bump
  const price = base * demandFactor * stockFactor * timeFactor;
  return Math.max(1, Math.round(price * 100) / 100);
}

export function recordSale(product, quantity) {
  product.demandScore = Math.max(0, (product.demandScore || 0) + quantity * 2);
  return product.demandScore;
}
