import pdf from 'pdf-parse';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { analyzeResume } from '../services/geminiService.js';

// @desc    Upload PDF resume and analyze details
// @route   POST /api/resume/upload
// @access  Protected
export const uploadAndAnalyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or file is not a PDF' });
    }

    const userId = req.user.id;

    // Parse the PDF buffer to raw text
    let parsedPdf;
    try {
      parsedPdf = await pdf(req.file.buffer);
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      return res.status(400).json({ message: 'Failed to extract text from the PDF file. Ensure the PDF is not corrupted.' });
    }

    const rawText = parsedPdf.text;
    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ message: 'The uploaded PDF appears to be empty or contains only images (OCR required).' });
    }

    // Call Gemini Service to analyze raw text
    console.log('Sending resume text to Gemini for structured extraction...');
    let analysisResult;
    try {
      analysisResult = await analyzeResume(rawText);
    } catch (aiError) {
      console.error('Gemini Resume Analysis Error:', aiError);
      return res.status(502).json({ message: 'Gemini AI failed to analyze the resume. Please check your API key.' });
    }

    const fileUrl = `/uploads/${Date.now()}_resume.pdf`;

    // Save or update in MySQL
    let resume = await Resume.findOne({ where: { userId } });

    if (resume) {
      resume.skills = analysisResult.skills || [];
      resume.programmingLanguages = analysisResult.programmingLanguages || [];
      resume.frameworks = analysisResult.frameworks || [];
      resume.projects = analysisResult.projects || [];
      resume.education = analysisResult.education || [];
      resume.experience = analysisResult.experience || [];
      resume.rawText = rawText;
      resume.fileUrl = fileUrl;
      await resume.save();
    } else {
      resume = await Resume.create({
        userId,
        skills: analysisResult.skills || [],
        programmingLanguages: analysisResult.programmingLanguages || [],
        frameworks: analysisResult.frameworks || [],
        projects: analysisResult.projects || [],
        education: analysisResult.education || [],
        experience: analysisResult.experience || [],
        rawText,
        fileUrl,
      });
    }

    // Proactively update user's profile skills
    const user = await User.findByPk(userId);
    if (user) {
      const mergedSkills = Array.from(
        new Set([
          ...(user.skills || []),
          ...(analysisResult.skills || []),
          ...(analysisResult.programmingLanguages || []),
          ...(analysisResult.frameworks || [])
        ])
      );
      user.skills = mergedSkills;
      await user.save();
    }

    return res.status(200).json({
      message: 'Resume analyzed and saved successfully',
      data: resume,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get currently logged-in user's parsed resume
// @route   GET /api/resume
// @access  Protected
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ where: { userId: req.user.id } });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found for this user' });
    }
    return res.json(resume);
  } catch (error) {
    console.error('Fetch resume error:', error);
    return res.status(500).json({ message: error.message });
  }
};
