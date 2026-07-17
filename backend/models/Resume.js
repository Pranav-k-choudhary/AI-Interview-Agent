import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // unique constraint handle karne ka sahi tarika indexes ke through hota hai, sync issues se bachne ke liye ise abhi hata rahe hain
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true // Default [] ki jagah isey nullable banana MySQL ke liye sabse best hota hai
  },
  programmingLanguages: {
    type: DataTypes.JSON,
    allowNull: true
  },
  frameworks: {
    type: DataTypes.JSON,
    allowNull: true
  },
  projects: {
    type: DataTypes.JSON,
    allowNull: true
  },
  education: {
    type: DataTypes.JSON,
    allowNull: true
  },
  experience: {
    type: DataTypes.JSON,
    allowNull: true
  },
  rawText: {
    type: DataTypes.TEXT('long'),
    allowNull: true // TEXT column se defaultValue: '' ko poori tarah hata diya hai
  },
  fileUrl: {
    type: DataTypes.STRING,
    defaultValue: '', // STRING par defaultValue kaam karta hai, toh ise rehne de sakte hain
  },
});

export default Resume;
