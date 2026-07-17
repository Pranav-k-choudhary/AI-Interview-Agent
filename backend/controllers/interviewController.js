import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import User from '../models/User.js';
import Question from '../models/Question.js';
import * as geminiService from '../services/geminiService.js';

const INTERVIEW_LENGTH = 5;

// @desc    Start a new interview session and get the first question
// @route   POST /api/interview/start
// @access  Protected
export const startInterview = async (req, res) => {
  const { targetRole, difficulty } = req.body;

  if (!targetRole || !difficulty) {
    return res.status(400).json({ message: 'Target role and difficulty level are required.' });
  }

  try {
    const userId = req.user.id;

    // Fetch user resume (if uploaded)
    const resume = await Resume.findOne({ where: { userId } });

    // Initialize interview document in MySQL
    const interview = await Interview.create({
      userId,
      targetRole,
      difficulty,
      status: 'active',
    });

    // Setup an empty questions array for compatibility with the Gemini service parameters
    interview.questions = [];

    // Generate first question
    console.log('Generating first interview question...');
    let firstQuestion;
    try {
      firstQuestion = await geminiService.generateNextQuestion(
        interview,
        req.user,
        resume
      );
    } catch (aiError) {
      console.error('Gemini First Question Gen Error:', aiError);
      return res.status(502).json({ message: 'Failed to generate initial question from Gemini API.' });
    }

    // Save the generated question to the relational table
    const questionObj = await Question.create({
      interviewId: interview.id,
      text: firstQuestion.text,
      questionType: firstQuestion.questionType,
    });

    return res.status(201).json({
      message: 'Interview session started',
      interviewId: interview.id,
      currentQuestion: {
        _id: questionObj.id,
        text: questionObj.text,
        questionType: questionObj.questionType,
      },
      totalQuestions: INTERVIEW_LENGTH,
      currentIndex: 1,
    });
  } catch (error) {
    console.error('Start interview error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Submit user answer and get next question or final report
// @route   POST /api/interview/submit-answer
// @access  Protected
export const submitAnswer = async (req, res) => {
  const { interviewId, userAnswer } = req.body;

  if (!interviewId || userAnswer === undefined) {
    return res.status(400).json({ message: 'Interview ID and user answer are required.' });
  }

  try {
    const interview = await Interview.findOne({
      where: { id: interviewId, userId: req.user.id },
      include: [{ model: Question, as: 'questions' }],
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found.' });
    }

    if (interview.status !== 'active') {
      return res.status(400).json({ message: 'This interview session has already ended or is not active.' });
    }

    const currentQuestionsList = interview.questions || [];
    const currentIndex = currentQuestionsList.length;

    if (currentIndex === 0) {
      return res.status(400).json({ message: 'No active question found in session.' });
    }

    const currentQuestion = currentQuestionsList[currentIndex - 1];

    if (currentQuestion.userAnswer) {
      return res.status(400).json({ message: 'An answer has already been submitted for this question.' });
    }

    // Evaluate answer via Gemini AI
    console.log(`Evaluating answer for Question ${currentIndex}...`);
    let evaluation;
    try {
      evaluation = await geminiService.evaluateAnswer(
        currentQuestion.text,
        currentQuestion.questionType,
        userAnswer
      );
    } catch (aiError) {
      console.error('Gemini answer evaluation error:', aiError);
      return res.status(502).json({ message: 'Failed to grade current response.' });
    }

    // Save answer and evaluation back to the Question record
    await currentQuestion.update({
      userAnswer,
      evaluation: {
        score: evaluation.score,
        correctness: evaluation.correctness,
        depth: evaluation.depth,
        confidence: evaluation.confidence,
        communication: evaluation.communication,
        technicalAccuracy: evaluation.technicalAccuracy,
        completeness: evaluation.completeness,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        suggestedAnswer: evaluation.suggestedAnswer,
      },
    });

    const resume = await Resume.findOne({ where: { userId: req.user.id } });

    // Refresh interview questions list to include the newly answered question
    const refreshedInterview = await Interview.findOne({
      where: { id: interviewId },
      include: [{ model: Question, as: 'questions' }],
    });

    if (currentIndex < INTERVIEW_LENGTH) {
      // Generate next question
      console.log(`Generating Question ${currentIndex + 1}...`);
      let nextQuestion;
      try {
        nextQuestion = await geminiService.generateNextQuestion(
          refreshedInterview,
          req.user,
          resume
        );
      } catch (aiError) {
        console.error('Gemini Next Question Gen Error:', aiError);
        return res.status(502).json({ message: 'Failed to generate next question.' });
      }

      const nextQuestionObj = await Question.create({
        interviewId: interview.id,
        text: nextQuestion.text,
        questionType: nextQuestion.questionType,
      });

      return res.json({
        status: 'active',
        currentIndex: currentIndex + 1,
        totalQuestions: INTERVIEW_LENGTH,
        feedback: currentQuestion.evaluation,
        nextQuestion: {
          _id: nextQuestionObj.id,
          text: nextQuestionObj.text,
          questionType: nextQuestionObj.questionType,
        },
      });
    } else {
      // Completed! Generate overall report
      console.log('Compiling final interview report...');

      let overallReport;
      try {
        overallReport = await geminiService.generateOverallReport(
          refreshedInterview,
          req.user,
          resume
        );
      } catch (aiError) {
        console.error('Gemini Overall Report Gen Error:', aiError);
        return res.status(502).json({ message: 'Interview answers logged, but failed to compile summary dashboard. Try viewing report in history.' });
      }

      await interview.update({
        status: 'completed',
        overallReport,
      });

      return res.json({
        status: 'completed',
        currentIndex,
        totalQuestions: INTERVIEW_LENGTH,
        feedback: currentQuestion.evaluation,
        report: interview.overallReport,
      });
    }
  } catch (error) {
    console.error('Submit answer error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get user interview history list
// @route   GET /api/interview/history
// @access  Protected
export const getInterviewHistory = async (req, res) => {
  try {
    const history = await Interview.findAll({
      where: { userId: req.user.id, status: 'completed' },
      attributes: ['id', 'targetRole', 'difficulty', 'overallReport', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    // Map fields for full frontend backward compatibility
    const formattedHistory = history.map((item) => ({
      _id: item.id,
      targetRole: item.targetRole,
      difficulty: item.difficulty,
      overallReport: item.overallReport,
      createdAt: item.createdAt,
    }));

    return res.json(formattedHistory);
  } catch (error) {
    console.error('History fetch error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get full interview report
// @route   GET /api/interview/report/:id
// @access  Protected
export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Question, as: 'questions' }],
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview session report not found.' });
    }

    // Map database fields to keep compatible with the client-side expectations
    const formattedQuestions = (interview.questions || []).map((q) => ({
      _id: q.id,
      text: q.text,
      questionType: q.questionType,
      userAnswer: q.userAnswer,
      evaluation: q.evaluation,
    }));

    const formattedReport = {
      _id: interview.id,
      targetRole: interview.targetRole,
      difficulty: interview.difficulty,
      status: interview.status,
      overallReport: interview.overallReport,
      questions: formattedQuestions,
      createdAt: interview.createdAt,
    };

    return res.json(formattedReport);
  } catch (error) {
    console.error('Report fetch error:', error);
    return res.status(500).json({ message: error.message });
  }
};
