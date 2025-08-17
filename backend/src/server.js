import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { PORT, ORIGIN } from './config.js';
import { sequelize } from './db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import pricingRoutes from './routes/pricing.js';
import { initSocket } from './services/socket.js';

const app = express();
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/pricing', pricingRoutes);

const server = http.createServer(app);
initSocket(server);

sequelize.authenticate().then(() => {
  console.log('DB connected');
  server.listen(PORT, () => console.log(`Backend listening on :${PORT}`));
}).catch(err => {
  console.error('DB error', err);
  process.exit(1);
});
