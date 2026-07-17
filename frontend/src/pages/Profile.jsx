import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { User, Briefcase, Award, Sparkles, CheckCircle2, Plus, X } from 'lucide-react';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        targetRole: user.targetRole || '',
        experienceLevel: user.experienceLevel || '',
      });
      setSkills(user.skills || []);
    }
  }, [user, reset]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !skills.includes(cleanSkill)) {
      setSkills([...skills, cleanSkill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const onSubmit = async (data) => {
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);
    try {
      await updateProfile({
        name: data.name,
        targetRole: data.targetRole,
        experienceLevel: data.experienceLevel,
        skills,
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Manage your target job settings and skill tags to customize AI questions.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl border border-green-200 dark:border-green-950/40 bg-green-50 dark:bg-green-950/15 text-green-600 dark:text-green-400">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 flex items-center gap-2.5 p-4 rounded-xl border border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/15 text-red-600 dark:text-red-400">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      <div className="glass-panel p-8 rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
                  {...register('name', { required: true })}
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Email Address (ReadOnly)
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-100 dark:bg-dark-850 text-slate-400 dark:text-slate-500 text-sm cursor-not-allowed"
              />
            </div>

            {/* Target Role */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Target Role
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Briefcase size={18} />
                </span>
                <select
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
                  {...register('targetRole')}
                >
                  <option value="">Select Role</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="React Developer">React Developer</option>
                  <option value="Node Developer">Node Developer</option>
                  <option value="MERN Developer">MERN Developer</option>
                </select>
              </div>
            </div>

            {/* Experience level */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Experience Level
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Award size={18} />
                </span>
                <select
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
                  {...register('experienceLevel')}
                >
                  <option value="">Select Experience Level</option>
                  <option value="Entry">Entry-Level / College Aspirant</option>
                  <option value="Mid">Mid-Level (1-4 Years)</option>
                  <option value="Senior">Senior-Level (5+ Years)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skill Tagging Section */}
          <div className="space-y-3.5 pt-4 border-t border-slate-200 dark:border-dark-750">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary-500" />
                Technical & Core Skills
              </label>
              <p className="text-xs text-slate-400 mt-1">
                Add skills manually below. These can also be populated automatically by uploading your resume.
              </p>
            </div>

            {/* Input field to add skill */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. JavaScript, Docker, Redux"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 focus:outline-none text-sm"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center gap-1.5 text-sm font-bold shadow-md shadow-primary-500/10"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            {/* Render Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-950/30"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No skills listed yet.</span>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 dark:border-dark-750 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl text-sm font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/15 disabled:opacity-50"
            >
              {submitting ? 'Saving Changes...' : 'Save Profile Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
