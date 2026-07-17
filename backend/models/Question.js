import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  interviewId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  questionType: {
    type: DataTypes.ENUM('technical', 'behavioral', 'hr', 'project', 'problem-solving', 'scenario', 'system-design'),
    allowNull: false,
  },
  userAnswer: {
    type: DataTypes.TEXT,
    allowNull: true // TEXT column se defaultValue: '' ko hata diya hai
  },
  evaluation: {
    type: DataTypes.JSON,
    allowNull: true // JSON column se direct object defaultValue ko hata diya hai, ab yeh bina atke sync ho jayega
  },
});

export default Question;
