import { Router } from 'express';
import { previewPrice } from '../controllers/pricingController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();
router.get('/preview/:id', auth(true), adminOnly, previewPrice);
export default router;
