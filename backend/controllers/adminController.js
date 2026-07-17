import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Interview from '../models/Interview.js';

// @desc    Get dashboard metrics for system administrator
// @route   GET /api/admin/metrics
// @access  Protected (Admin only)
export const getAdminMetrics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalInterviews = await Interview.count({ where: { status: 'completed' } });

    // Fetch resumes to aggregate skill details
    const resumes = await Resume.findAll({
      attributes: ['skills', 'programmingLanguages', 'frameworks'],
    });

    const skillCounts = {};
    resumes.forEach((resume) => {
      const allSkills = [
        ...(resume.skills || []),
        ...(resume.programmingLanguages || []),
        ...(resume.frameworks || []),
      ];

      allSkills.forEach((skill) => {
        if (skill) {
          const cleanSkill = skill.trim();
          if (cleanSkill) {
            skillCounts[cleanSkill] = (skillCounts[cleanSkill] || 0) + 1;
          }
        }
      });
    });

    const mostCommonSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Fetch completed interviews to aggregate weak areas
    const completedInterviews = await Interview.findAll({
      where: { status: 'completed' },
      attributes: ['overallReport'],
    });

    const weakAreaCounts = {};
    completedInterviews.forEach((interview) => {
      const weakAreas = interview.overallReport?.weakAreas || [];
      weakAreas.forEach((area) => {
        if (area) {
          const cleanArea = area.trim();
          if (cleanArea) {
            weakAreaCounts[cleanArea] = (weakAreaCounts[cleanArea] || 0) + 1;
          }
        }
      });
    });

    const mostCommonWeakAreas = Object.entries(weakAreaCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.json({
      totalUsers,
      totalInterviews,
      mostCommonSkills,
      mostCommonWeakAreas,
    });
  } catch (error) {
    console.error('Admin metrics error:', error);
    return res.status(500).json({ message: error.message });
  }
};
