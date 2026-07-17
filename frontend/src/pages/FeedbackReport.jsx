import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import {
  Award, Sparkles, CheckCircle2, AlertTriangle, ArrowLeft,
  ChevronDown, ChevronUp, BookOpen, Compass, Code, LayoutGrid, CheckSquare
} from 'lucide-react';

export const FeedbackReport = () => {
  const { id: interviewId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [reportData, setReportData] = useState(null);

  // Accordion toggle states
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await API.get(`/interview/report/${interviewId}`);
        setReportData(data);
        // Pre-expand first question evaluation
        setExpandedQuestions({ 0: true });
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load performance report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [interviewId]);

  const toggleQuestion = (idx) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-900">
        <div className="w-10 h-10 border-4 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 mt-3 font-semibold">Compiling Performance Report...</p>
      </div>
    );
  }

  if (errorMsg || !reportData) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 glass-panel rounded-2xl text-center space-y-4">
        <AlertTriangle size={32} className="text-red-500 mx-auto" />
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

  const { overallReport, questions, targetRole, difficulty } = reportData;

  const scoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (score >= 50) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-10">
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-dark-800">
        <div className="space-y-1.5">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-400"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Interview Evaluation</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {targetRole} Interview — <span className="font-semibold">{difficulty} Level</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/10"
        >
          Retake Practice Session
        </button>
      </div>

      {/* Main Score Metrics Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5 border-t-4 border-t-primary-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Overall Score</span>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{overallReport.overallScore}%</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Technical Accuracy</span>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{overallReport.technicalScore}%</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Communication</span>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{overallReport.communicationScore}%</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Problem Solving</span>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{overallReport.problemSolvingScore}%</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl text-center space-y-1.5 col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Project Depth</span>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{overallReport.projectKnowledgeScore}%</p>
        </div>
      </div>

      {/* Summary Box */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Award size={18} className="text-primary-500" />
          Executive Performance Summary
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {overallReport.summary}
        </p>
      </div>

      {/* Strengths & Weaknesses Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-green-500 space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-green-500" />
            Key Strengths Identified
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            {overallReport.strongAreas?.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-amber-500 space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
            <AlertTriangle size={16} className="text-amber-500" />
            Gaps & Weak Areas
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            {overallReport.weakAreas?.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Individual Question Evaluations */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BookOpen size={18} className="text-primary-500" />
          Question-by-Question Evaluation Breakdown
        </h3>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isExpanded = expandedQuestions[idx];
            return (
              <div
                key={q._id || idx}
                className="glass-panel rounded-2xl overflow-hidden border border-slate-100 dark:border-dark-800"
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleQuestion(idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 hover:bg-slate-50/50 dark:hover:bg-dark-850/20 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-dark-800 text-xs font-bold text-slate-500 dark:text-slate-400">
                      Q{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                      {q.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${scoreBadgeColor(q.evaluation.score * 10)}`}>
                      Grade: {q.evaluation.score}/10
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Collapsed Evaluation Details */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-100 dark:border-dark-800 bg-slate-50/20 dark:bg-dark-850/10 space-y-6 text-xs sm:text-sm">
                    {/* Q&A Side-by-side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Candidate Answer
                        </span>
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-800 bg-slate-50 dark:bg-dark-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                          {q.userAnswer || 'No response recorded.'}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wider">
                          Recommended Model Answer
                        </span>
                        <div className="p-4 rounded-xl border border-primary-100 dark:border-primary-950/20 bg-primary-50/20 dark:bg-primary-950/5 text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                          {q.evaluation.suggestedAnswer}
                        </div>
                      </div>
                    </div>

                    {/* Breakdown grids */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg border border-slate-100 dark:border-dark-800">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Correctness</span>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-normal">{q.evaluation.correctness}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-100 dark:border-dark-800">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Vocabulary Depth</span>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-normal">{q.evaluation.depth}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-100 dark:border-dark-800">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Communication</span>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-normal">{q.evaluation.communication}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-100 dark:border-dark-800">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Confidence</span>
                        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-normal">{q.evaluation.confidence}</p>
                      </div>
                    </div>

                    {/* Q strengths / weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-green-600 dark:text-green-400">
                        <span className="font-bold">Strengths: </span>
                        {q.evaluation.strengths}
                      </div>
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-600 dark:text-amber-400">
                        <span className="font-bold">Suggested Gaps: </span>
                        {q.evaluation.weaknesses}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Gap Analysis & Roadmap */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Compass size={18} className="text-primary-500" />
          Personalized Skill Gap & Learning Roadmap
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Missing Skills and Tech */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-350">
                <Code size={16} className="text-primary-500" />
                Missing Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {overallReport.learningRoadmap?.missingSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-350">
                <LayoutGrid size={16} className="text-primary-500" />
                Recommended Concepts
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {overallReport.learningRoadmap?.recommendedTechnologies?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-500/10 text-primary-500 border border-primary-500/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Roadmap Steps & Projects */}
          <div className="lg:col-span-2 space-y-6">
            {/* Steps */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-350">
                <CheckSquare size={16} className="text-primary-500" />
                Learning Progression Steps
              </h4>
              <div className="space-y-4">
                {overallReport.learningRoadmap?.roadmapSteps?.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-xs flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Projects */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-350">
                <Sparkles size={16} className="text-primary-500" />
                Recommended Building Projects
              </h4>
              <div className="space-y-4">
                {overallReport.learningRoadmap?.suggestedProjects?.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-100 dark:border-dark-750 bg-slate-50/50 dark:bg-dark-850/30 space-y-2.5"
                  >
                    <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {proj.title}
                    </h5>
                    <p className="text-xs text-slate-550 leading-relaxed">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {proj.stack?.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-500 dark:text-primary-400 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackReport;
