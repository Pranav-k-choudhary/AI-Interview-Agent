import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Cpu, FileCheck, BarChart4, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export const LandingPage = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        {/* Hero Section */}
        <motion.div
          className="text-center space-y-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-200 bg-primary-50/50 dark:border-primary-950/30 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 text-xs font-semibold tracking-wide">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
            Revolutionizing Placement Interview Prep
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white leading-[1.1]">
            Ace Your Next Interview with <br />
            <span className="gradient-text">Adaptive AI Interviewers</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed">
            AI Interview Agent reads your resume, dynamically adjusts interview difficulty based on your answers, grades response accuracy, and designs a personalized learning roadmap to secure your dream job.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="group flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/35 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Start Mock Interview
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl text-base font-bold border border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          id="features"
          className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Card 1 */}
          <motion.div className="glass-panel p-8 rounded-2xl flex flex-col" variants={itemVariants}>
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
              <FileCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Resume Parsing</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Upload your PDF resume. Our Gemini parser extracts skills, frameworks, and projects to customize questions specifically around your background.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div className="glass-panel p-8 rounded-2xl flex flex-col" variants={itemVariants}>
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Adaptive Flow</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Experience dynamic follow-ups. Excel at answers to face advanced concepts, or struggle to receive step-by-step conceptual hints.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div className="glass-panel p-8 rounded-2xl flex flex-col" variants={itemVariants}>
            <div className="h-12 w-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Granular Grading</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Receive evaluation on correctness, completeness, and technical language depth. Review strengths, weaknesses, and perfection models.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div className="glass-panel p-8 rounded-2xl flex flex-col" variants={itemVariants}>
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
              <BarChart4 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Skill Gap Analysis</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Identify key technical gaps matching your target role. Generate interactive roadmap directions and project recommendation guides.
            </p>
          </motion.div>
        </motion.div>

        {/* Workflow Showcase */}
        <div className="mt-32 border-t border-slate-200 dark:border-dark-800 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Simulates real-world tech panel interviews
              </h2>
              <p className="text-slate-600 dark:text-slate-350">
                Placement panels check for technical vocabulary accuracy, communication flow, and system engineering architectures. We've optimized Gemini Prompts to ensure you receive evaluations indistinguishable from professional recruiters.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  'Targeted question sets for Frontend, Backend, Java, MERN stacks',
                  'Support for Scenario, System Design, HR, and coding questions',
                  'Interactive Recharts analysis tracking overall improvement metrics',
                  'Interactive, printable feedback scorecards and learning paths',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual Screen Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-2 rounded-2xl border border-slate-200 dark:border-dark-800 bg-slate-100 dark:bg-dark-800 shadow-2xl"
            >
              <div className="rounded-xl overflow-hidden bg-slate-900 aspect-video flex flex-col">
                {/* Window header */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-dark-850 bg-dark-900/60">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-slate-500 ml-4 font-mono">interview_session_active.sh</span>
                </div>
                {/* Shell content */}
                <div className="flex-1 p-6 font-mono text-xs text-slate-400 space-y-4">
                  <p className="text-green-400"># Initializing AI Interview Agent for role: MERN Developer</p>
                  <p className="text-blue-400">&gt; Question 1 [Technical]: Describe the process of lifecycle stages in React hooks compared to class components.</p>
                  <div className="pl-4 py-2 border-l border-primary-500/30 text-slate-300 bg-primary-950/20 rounded">
                    Candidate: "React hooks allow functional components to use state. useEffect handles mounting, updating, and unmounting in a unified API..."
                  </div>
                  <p className="text-yellow-400">&gt; Gemini Evaluating... Score: 9/10 (Excellent Technical Accuracy)</p>
                  <p className="text-indigo-400">&gt; Adaptive Action: Increasing difficulty level. Querying System Design / State management context.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
