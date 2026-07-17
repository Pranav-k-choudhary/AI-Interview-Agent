import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';

export const Register = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setAuthError('');
    setSubmitting(true);
    try {
      await signup(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative">
      {/* Background blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500 mx-auto mb-4">
            <UserPlus size={24} />
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Register to build, practice, and polish your interviewing skills.
          </p>
        </div>

        {authError && (
          <div className="mb-6 flex items-center gap-2 p-3 rounded-lg border border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/15 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-dark-800 text-sm focus:outline-none transition-all duration-205 ${
                  errors.name
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 dark:border-dark-700 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-1 focus:ring-primary-500'
                }`}
                {...register('name', { required: 'Name is required' })}
              />
            </div>
            {errors.name && (
              <span className="text-xs font-medium text-red-500">{errors.name.message}</span>
            )}
          </div>

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-dark-800 text-sm focus:outline-none transition-all duration-205 ${
                  errors.email
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 dark:border-dark-700 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-1 focus:ring-primary-500'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>
            {errors.email && (
              <span className="text-xs font-medium text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-slate-50 dark:bg-dark-800 text-sm focus:outline-none transition-all duration-205 ${
                  errors.password
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 dark:border-dark-700 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-1 focus:ring-primary-500'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-350"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs font-medium text-red-500">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-dark-800 text-sm focus:outline-none transition-all duration-205 ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 dark:border-dark-700 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-1 focus:ring-primary-500'
                }`}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === passwordValue || 'Passwords do not match',
                })}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-xs font-medium text-red-500">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200 disabled:opacity-50"
          >
            {submitting ? 'Creating Account...' : 'Sign Up'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-primary-500 hover:text-primary-400 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
