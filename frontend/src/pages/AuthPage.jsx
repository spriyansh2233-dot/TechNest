import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'
});

export default function AuthPage({ mode, user, setUser, showToast }) {
  const navigate = useNavigate();
  const { syncUser } = useCart();
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to profile page
  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  // Check if redirected due to session expiration
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      setAuthError('Your session has expired. Please log in again to continue.');
      // Clean up the URL search parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'forgot') {
      showToast('Password reset link sent to your email Address.', 'success');
      navigate('/login');
      return;
    }

    setAuthError('');
    setIsLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await api.post(endpoint, authForm);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        const loggedUser = {
          name: res.data.name,
          email: res.data.email,
          role: res.data.email === 'admin@techhub.com' ? 'ADMIN' : 'USER'
        };
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        syncUser(loggedUser);
        showToast(`Welcome back, ${loggedUser.name}!`, 'success');
        navigate('/profile');
      } else {
        setAuthError(res.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Connection to server failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-surface py-20 px-4">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-card bg-surface p-10 border border-outline shadow-2xl rounded-3xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="font-display-lg text-[32px] text-primary mb-2">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="font-body-md text-on-surface-variant">
              {mode === 'login' && 'Enter your credentials to access your account.'}
              {mode === 'register' && 'Join the premium ecosystem today.'}
              {mode === 'forgot' && 'Enter your email to receive a reset link.'}
            </p>
          </div>

          {authError && (
            <div className="bg-error/10 border border-error/20 text-error font-body-md text-[13px] p-4 rounded mb-6 flex items-start gap-3">
              <span className="material-symbols-outlined text-[18px]" data-icon="warning">warning</span>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="group">
                <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 transition-colors group-focus-within:text-primary">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
                  <input 
                    type="text" 
                    required 
                    value={authForm.name} 
                    onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                    placeholder="e.g. John Doe" 
                    className="w-full bg-surface-container border border-outline rounded-lg py-4 pl-12 pr-4 font-body-md text-[14px] text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-on-surface-variant/50 shadow-sm hover:shadow-md"
                  />
                </div>
              </div>
            )}

            <div className="group">
              <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 transition-colors group-focus-within:text-primary">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">mail</span>
                <input 
                  type="email" 
                  required 
                  autoComplete="off"
                  value={authForm.email} 
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  placeholder="e.g. you@example.com" 
                  className="w-full bg-surface-container border border-outline rounded-lg py-4 pl-12 pr-4 font-body-md text-[14px] text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-on-surface-variant/50 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant transition-colors group-focus-within:text-primary">Password</label>
                  {mode === 'login' && (
                    <Link to="/forgot-password" className="font-label-caps text-[10px] text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">Forgot?</Link>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">lock</span>
                  <input 
                    type="password" 
                    required 
                    autoComplete="new-password"
                    value={authForm.password} 
                    onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full bg-surface-container border border-outline rounded-lg py-4 pl-12 pr-4 font-body-md text-[14px] text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-on-surface-variant/50 shadow-sm hover:shadow-md"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="remember" className="accent-primary w-4 h-4 rounded border-outline bg-surface-container cursor-pointer" />
                <label htmlFor="remember" className="font-body-md text-[12px] text-on-surface-variant cursor-pointer">Remember me for 30 days</label>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 mt-6 bg-primary text-surface font-label-caps text-[12px] rounded-lg hover:bg-primary/90 transition-all text-center uppercase tracking-widest shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 font-bold cursor-pointer"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]" data-icon="sync">sync</span>
              ) : (
                mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline text-center">
            {mode === 'login' ? (
              <p className="font-body-md text-[13px] text-on-surface-variant">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-semibold transition-colors hover:text-primary/80">
                  Sign Up
                </Link>
              </p>
            ) : (
              <p className="font-body-md text-[13px] text-on-surface-variant">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-semibold transition-colors hover:text-primary/80">
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
