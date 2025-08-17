import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login } from '../controllers/authController.js';
import { validate } from '../utils/validators.js';

const router = Router();
router.post('/signup',
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isStrongPassword({ minLength: 8 }),
  validate, signup
);
router.post('/login', 
  body('email').isEmail(),
  body('password').isString(),
  validate, login
);
export default router;
