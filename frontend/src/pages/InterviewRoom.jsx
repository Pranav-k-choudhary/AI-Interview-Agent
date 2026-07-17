import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { Send, Sparkles, Brain, Award, AlertCircle, HelpCircle, Terminal } from 'lucide-react';

export const InterviewRoom = () => {
  const { id: interviewId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [interview, setInterview] = useState(null);

  // Active question details
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);

  // User input
  const [answer, setAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  useEffect(() => {
    const fetchInterviewStatus = async () => {
      try {
        const { data } = await API.get(`/interview/report/${interviewId}`);
        setInterview(data);

        // If completed already, redirect to report
        if (data.status === 'completed') {
          navigate(`/report/${interviewId}`);
          return;
        }

        // Determine current question to answer
        const qList = data.questions || [];
        const unanswered = qList.find((q) => !q.userAnswer);

        if (unanswered) {
          setCurrentQuestion(unanswered);
          setCurrentIndex(qList.indexOf(unanswered) + 1);
        } else {
          // If all answered but status is not completed, we might have crashed or need report
          setErrorMsg('Session state mismatch. Try returning to your dashboard.');
        }
        setTotalQuestions(5); // default length
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load the interview room session.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewStatus();
  }, [interviewId, navigate]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmittingAnswer(true);
    setErrorMsg('');
    try {
      const { data } = await API.post('/interview/submit-answer', {
        interviewId,
        userAnswer: answer,
      });

      setAnswer('');

      if (data.status === 'completed') {
        // Redirect to report page upon completion
        navigate(`/report/${interviewId}`);
      } else {
        // Load next question
        setCurrentQuestion(data.nextQuestion);
        setCurrentIndex(data.currentIndex);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit response.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-900">
        <div className="w-10 h-10 border-4 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 mt-3 font-semibold">Loading Interview Board...</p>
      </div>
    );
  }

  if (errorMsg && !currentQuestion) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 glass-panel rounded-2xl text-center space-y-4">
        <AlertCircle size={32} className="text-red-500 mx-auto" />
        <h3 className="text-lg font-bold">Error</h3>
        <p className="text-sm text-slate-500">{errorMsg}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex - 1) / totalQuestions) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-6">
      {/* Session Progress Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Mock Placement Panel
          </span>
          <h2 className="text-xl font-bold flex items-center gap-2">
            Target: <span className="gradient-text font-extrabold">{interview?.targetRole}</span>
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400">
            Question {currentIndex} of {totalQuestions}
          </span>
          <div className="w-32 h-2.5 bg-slate-200 dark:bg-dark-850 rounded-full overflow-hidden mt-1.5 border border-slate-100 dark:border-dark-800">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${progressPercent || 5}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Side: Avatar/AI Agent Panel */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="w-full glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
            {/* Animated Avatar Box */}
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span className="text-3xl">🤖</span>
              {submittingAnswer && (
                <div className="absolute inset-0 rounded-2xl bg-dark-900/60 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Recruiter</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Gemini Engine v1.5</p>
            </div>
            <div className="text-[10px] font-bold px-2 py-1 rounded bg-primary-50 dark:bg-primary-950/20 text-primary-500 border border-primary-500/10 flex items-center gap-1">
              <Terminal size={11} />
              Adaptive Flow
            </div>
          </div>
        </div>

        {/* Right Side: Conversation Area */}
        <div className="md:col-span-3 space-y-6">
          {/* Question bubble */}
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.text}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary-500 space-y-3.5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/5 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-primary-500" />
                  <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wider">
                    {currentQuestion.questionType} Question
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-white leading-relaxed">
                  {currentQuestion.text}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Typing Area */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Type Your Response Below
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Explain your thoughts clearly. Use correct terminology..."
                  rows={6}
                  disabled={submittingAnswer}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                ></textarea>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/10 text-red-500 text-xs">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-2">
                <span className="text-[10px] text-slate-400 font-medium">
                  Tip: Provide details and structural examples to secure a higher depth grade.
                </span>
                <button
                  type="submit"
                  disabled={submittingAnswer || !answer.trim()}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-md disabled:opacity-40 transition-colors"
                >
                  {submittingAnswer ? 'Evaluating Response...' : 'Submit Answer'}
                  {!submittingAnswer && <Send size={12} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {submittingAnswer && (
        <div className="fixed inset-0 z-50 bg-dark-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-center px-4">
          <div className="glass-panel p-8 rounded-2xl max-w-sm flex flex-col items-center">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 border-4 border-primary-200 dark:border-dark-700 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
            <h4 className="font-extrabold text-base flex items-center gap-2">
              <Brain size={18} className="text-primary-500 animate-pulse" />
              Grading Answer...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Gemini is assessing correctness, communication metrics, and technical vocabulary depth.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;
