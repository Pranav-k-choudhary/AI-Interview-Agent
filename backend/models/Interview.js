import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  targetRole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('Entry', 'Mid', 'Senior'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'completed'),
    defaultValue: 'pending',
  },
  overallReport: {
    type: DataTypes.JSON,
    allowNull: true // JSON column se direct object defaultValue ko hata kar allowNull: true kar diya hai taaki MySQL bina atke sync ho sake
  },
});

export default Interview;
