import { Router } from 'express';
import { checkout, myOrders } from '../controllers/orderController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.post('/checkout', auth(true), checkout);
router.get('/my', auth(true), myOrders);
export default router;
