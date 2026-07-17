import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { Mail, Lock, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);
    try {
      await API.post('/auth/forgot-password', {
        email: data.email,
        newPassword: data.password,
      });
      setSuccessMsg('Your password has been reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Password reset failed. Please verify your email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500 mx-auto mb-4">
            <KeyRound size={24} />
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Reset Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Enter your email and configure your new password below.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-950/40 bg-green-50 dark:bg-green-950/15 text-green-600 dark:text-green-400 text-sm">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 flex items-center gap-2 p-3 rounded-lg border border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/15 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Registered Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50 dark:bg-dark-800 text-sm focus:outline-none transition-all duration-205 ${
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

          {/* New Password input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50 dark:bg-dark-800 text-sm focus:outline-none transition-all duration-205 ${
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
            </div>
            {errors.password && (
              <span className="text-xs font-medium text-red-500">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200 disabled:opacity-50"
          >
            {submitting ? 'Resetting Password...' : 'Save New Password'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-8">
          Remembered your password?{' '}
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

export default ForgotPassword;
