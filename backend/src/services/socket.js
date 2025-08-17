import { ORIGIN } from '../config.js';
import { Server } from 'socket.io';

let ioInstance;

export function initSocket(server) {
  const io = new Server(server, { cors: { origin: ORIGIN, methods: ['GET','POST'] } });
  ioInstance = io;
  io.on('connection', (socket) => {
    socket.emit('hello', { message: 'connected' });
  });
  return io;
}

export function broadcastInventory(product) {
  if (ioInstance) ioInstance.emit('inventory:update', { productId: product.id, stock: product.stock });
}

export function broadcastPrice(product) {
  if (ioInstance) ioInstance.emit('price:update', { productId: product.id, price: Number(product.price) });
}
