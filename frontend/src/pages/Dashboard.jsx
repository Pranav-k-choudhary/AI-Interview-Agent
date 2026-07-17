import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Calendar, BookOpen, GraduationCap, ChevronRight, Award, PlusCircle, History, MessageSquareQuote } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Interview Form states
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('Entry');
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await API.get('/interview/history');
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch interview history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    if (user && user.targetRole) {
      setRole(user.targetRole);
    }
  }, [user]);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!role) {
      setStartError('Please select a target role to continue.');
      return;
    }

    setStartError('');
    setStarting(true);
    try {
      const { data } = await API.post('/interview/start', {
        targetRole: role,
        difficulty,
      });
      // Redirect to the interview room
      navigate(`/interview/${data.interviewId}`);
    } catch (err) {
      console.error(err);
      setStartError(err.response?.data?.message || 'Failed to start interview.');
    } finally {
      setStarting(false);
    }
  };

  // Process chart data
  const chartData = history
    .slice()
    .reverse()
    .map((item, idx) => ({
      index: idx + 1,
      score: item.overallReport?.overallScore || 0,
      date: new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      role: item.targetRole.split(' ')[0], // abbreviation
    }));

  // Aggregated Score Metrics
  const lastInterview = history[0];
  const overallAvg = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.overallReport?.overallScore || 0), 0) / history.length)
    : 0;
  const technicalAvg = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.overallReport?.technicalScore || 0), 0) / history.length)
    : 0;
  const commAvg = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.overallReport?.communicationScore || 0), 0) / history.length)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analyze your skill gaps and practice mock placement interviews.
          </p>
        </div>

        {!user?.targetRole && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-yellow-200 dark:border-yellow-950/40 bg-yellow-50 dark:bg-yellow-950/10 text-yellow-600 dark:text-yellow-400 text-xs font-semibold leading-relaxed">
            <Award size={18} className="flex-shrink-0" />
            <div>
              Configure target role in your{' '}
              <Link to="/profile" className="underline font-bold">
                Profile Settings
              </Link>{' '}
              for customized interviews.
            </div>
          </div>
        )}
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Start Session Form & Stats */}
        <div className="lg:col-span-1 space-y-8">
          {/* Start Mock Session */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <PlusCircle size={20} className="text-primary-500" />
              New Mock Interview
            </h3>

            <form onSubmit={handleStartInterview} className="space-y-4">
              {startError && (
                <p className="text-xs font-medium text-red-500">{startError}</p>
              )}
              {/* Role Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">Select Target Role</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="React Developer">React Developer</option>
                  <option value="Node Developer">Node Developer</option>
                  <option value="MERN Developer">MERN Developer</option>
                </select>
              </div>

              {/* Difficulty Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="Entry">Entry-Level / Placement Aspirant</option>
                  <option value="Mid">Mid-Level (1-4 Yrs)</option>
                  <option value="Senior">Senior-Level (5+ Yrs)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={starting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/10 transition-colors disabled:opacity-50"
              >
                {starting ? 'Initiating Room...' : 'Start Mock Interview'}
                {!starting && <ChevronRight size={16} />}
              </button>
            </form>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4.5 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg. Grade</span>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1.5">{overallAvg}%</p>
            </div>
            <div className="glass-panel p-4.5 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Completed</span>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1.5">{history.length}</p>
            </div>
            <div className="glass-panel p-4.5 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tech Avg</span>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1.5">{technicalAvg}%</p>
            </div>
            <div className="glass-panel p-4.5 rounded-2xl text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Comm Avg</span>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1.5">{commAvg}%</p>
            </div>
          </div>
        </div>

        {/* Right column: Charts & History List */}
        <div className="lg:col-span-2 space-y-8">
          {/* Charts Area */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Sparkles size={18} className="text-primary-500" />
              Performance Improvement Graph
            </h3>

            {chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" opacity={0.1} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <MessageSquareQuote size={32} className="text-slate-350 mb-3" />
                <p className="text-xs text-slate-400">
                  Complete your first interview to track your score progression over time.
                </p>
              </div>
            )}
          </div>

          {/* History List */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <History size={18} className="text-primary-500" />
              Interview History
            </h3>

            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="w-8 h-8 border-4 border-t-primary-500 rounded-full animate-spin"></div>
              </div>
            ) : history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-dark-750 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Seniority</th>
                      <th className="pb-3 font-semibold text-center">Grade</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item._id} className="border-b border-slate-100 dark:border-dark-800/40 hover:bg-slate-50/50 dark:hover:bg-dark-850/20 transition-colors">
                        <td className="py-3.5 flex items-center gap-1.5 text-slate-500 font-medium">
                          <Calendar size={13} />
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 font-bold text-slate-700 dark:text-slate-300">
                          {item.targetRole}
                        </td>
                        <td className="py-3.5 text-slate-500">{item.difficulty}</td>
                        <td className="py-3.5 text-center">
                          <span className={`px-2 py-0.5 rounded-md font-bold ${
                            item.overallReport?.overallScore >= 80
                              ? 'bg-green-500/10 text-green-500'
                              : item.overallReport?.overallScore >= 50
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {item.overallReport?.overallScore}%
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to={`/report/${item._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-primary-500 hover:bg-primary-600 text-white transition-colors"
                          >
                            Report
                            <ChevronRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 italic">
                No past sessions recorded. Start your first session above!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
