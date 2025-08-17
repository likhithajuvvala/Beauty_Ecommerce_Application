import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const DB_URI = process.env.DB_URI || 'mysql://root:root@localhost:3306/beauty_ecom';
export const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
export const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';
