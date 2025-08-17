import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../db.js';
import { JWT_SECRET } from '../config.js';

export async function signup(req, res) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: 'user' });
  return res.status(201).json({ id: user.id });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
