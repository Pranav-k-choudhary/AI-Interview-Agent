import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, FileText, CheckCircle2, ShieldAlert, BarChart3, TrendingDown, LayoutGrid } from 'lucide-react';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchAdminMetrics = async () => {
      try {
        const { data } = await API.get('/admin/metrics');
        setMetrics(data);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.response?.data?.message || 'Access Denied. Only administrators are allowed to view this panel.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-900">
        <div className="w-8 h-8 border-4 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 mt-3 font-semibold">Loading Admin Analytics...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 glass-panel rounded-2xl text-center space-y-4">
        <ShieldAlert size={32} className="text-red-500 mx-auto" />
        <h3 className="text-lg font-bold">Access Restricting</h3>
        <p className="text-sm text-slate-500">{errorMsg}</p>
      </div>
    );
  }

  const { totalUsers, totalInterviews, mostCommonSkills, mostCommonWeakAreas } = metrics;

  // Max counts for calculating bar percentages
  const maxSkillCount = mostCommonSkills[0]?.count || 1;
  const maxWeakCount = mostCommonWeakAreas[0]?.count || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Banner */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Admin System Portal</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor application metrics, trending skills, and developer gap analytics.
        </p>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Registered Users</span>
            <p className="text-3xl font-extrabold mt-1">{totalUsers}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Completed Interviews</span>
            <p className="text-3xl font-extrabold mt-1">{totalInterviews}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-5 md:col-span-2 lg:col-span-1">
          <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <LayoutGrid size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">System Engine Status</span>
            <p className="text-base font-extrabold mt-2 text-green-500 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
              Connected (Gemini-1.5)
            </p>
          </div>
        </div>
      </div>

      {/* Analytical Bar Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Common Skills */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 size={18} className="text-primary-500" />
            Most Common Skills (From Resumes)
          </h3>

          {mostCommonSkills.length > 0 ? (
            <div className="space-y-4">
              {mostCommonSkills.map((skill, idx) => {
                const percent = Math.round((skill.count / maxSkillCount) * 100);
                return (
                  <div key={idx} className="space-y-1.5 text-xs sm:text-sm">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-700 dark:text-slate-350">{skill.name}</span>
                      <span className="text-slate-400">{skill.count} resumes</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 dark:bg-dark-850 rounded-full overflow-hidden border border-slate-100 dark:border-dark-800">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-6">No resumes uploaded yet to compute trending stack details.</p>
          )}
        </div>

        {/* Common Weak Areas */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingDown size={18} className="text-amber-500" />
            Most Common Weak Areas (From Reports)
          </h3>

          {mostCommonWeakAreas.length > 0 ? (
            <div className="space-y-4">
              {mostCommonWeakAreas.map((area, idx) => {
                const percent = Math.round((area.count / maxWeakCount) * 100);
                return (
                  <div key={idx} className="space-y-1.5 text-xs sm:text-sm">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-700 dark:text-slate-350">{area.name}</span>
                      <span className="text-slate-400">{area.count} times</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 dark:bg-dark-850 rounded-full overflow-hidden border border-slate-100 dark:border-dark-800">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-6">No reports completed yet to compute trending gaps.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
