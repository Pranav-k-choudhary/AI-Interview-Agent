import User from './User.js';
import Resume from './Resume.js';
import Interview from './Interview.js';
import Question from './Question.js';

// User <-> Resume (One-to-One)
User.hasOne(Resume, { foreignKey: 'userId', as: 'resume', onDelete: 'CASCADE' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Interview (One-to-Many)
User.hasMany(Interview, { foreignKey: 'userId', as: 'interviews', onDelete: 'CASCADE' });
Interview.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Interview <-> Question (One-to-Many)
Interview.hasMany(Question, { foreignKey: 'interviewId', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Interview, { foreignKey: 'interviewId', as: 'interview' });

export { User, Resume, Interview, Question };
export default { User, Resume, Interview, Question };
