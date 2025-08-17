import { Sequelize, DataTypes } from 'sequelize';
import { DB_URI } from './config.js';

export const sequelize = new Sequelize(DB_URI, { logging: false });

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' }
}, { timestamps: true });

export const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  basePrice: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  imageUrl: { type: DataTypes.STRING },
  demandScore: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: true });

export const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'paid' }
}, { timestamps: true });

export const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  pricePaid: { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, { timestamps: true });

// Relations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
