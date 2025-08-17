import { Router } from 'express';
import { listProducts, getProduct, createProduct, updateProduct } from '../controllers/productController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();
router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', auth(true), adminOnly, createProduct);
router.put('/:id', auth(true), adminOnly, updateProduct);
export default router;
