import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { login } from '../api/mockAuth';

/* ── tiny helpers ── */
const InputField = ({ label, id, type = 'text', value, onChange, placeholder, icon: Icon, error, hint, right }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[12px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#3B1D6E' }}>
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: error ? '#DC2626' : '#A78BFA' }}
        />
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl text-[14px] font-medium outline-none transition-all"
        style={{
          padding: '12px 44px 12px 42px',
          paddingRight: right ? '44px' : '14px',
          backgroundColor: error ? 'rgba(220,38,38,0.05)' : 'rgba(255,255,255,0.85)',
          border: `1.5px solid ${error ? 'rgba(220,38,38,0.4)' : 'rgba(124,58,237,0.18)'}`,
          color: '#0D0D0D',
        }}
      />
      {right}
    </div>
    {error && (
      <p className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: '#DC2626' }}>
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
      </p>
    )}
    {hint && !error && (
      <p className="text-[11px]" style={{ color: '#7C5CBF' }}>{hint}</p>
    )}
  </div>
);

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'College email is required';
    else if (!/\.(ac\.in|edu\.in|edu)$/i.test(form.email))
      errs.email = 'Must be a college email (e.g. name@college.ac.in)';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await login(form.email, form.password);
      setSuccess(true);
      setTimeout(() => navigate('/feed'), 1200);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: '#E8DFF5' }}
    >
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Glow blob */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[360px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.20) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-2.5 mb-8"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-[14px]"
            style={{ backgroundColor: '#7C3AED' }}
          >
            N
          </div>
          <span className="font-black text-[20px] tracking-tight" style={{ color: '#0D0D0D' }}>Naami</span>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(124,58,237,0.14)',
            boxShadow: '0 8px 48px rgba(124,58,237,0.10), 0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* Card header */}
          <div className="px-8 pt-8 pb-6 border-b" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
              <Sparkles className="w-3 h-3" style={{ color: '#7C3AED' }} />
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: '#5B21B6' }}>College Verified Network</span>
            </div>
            <h1 className="text-[24px] font-black tracking-tight" style={{ color: '#0D0D0D' }}>Welcome back</h1>
            <p className="text-[13px] mt-1" style={{ color: '#7C5CBF' }}>Sign in with your college email to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-5">
            <InputField
              label="College Email"
              id="login-email"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="yourname@college.ac.in"
              icon={Mail}
              error={errors.email}
              hint="Use your official college/university email"
            />

            <InputField
              label="Password"
              id="login-password"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              hint="Demo password: demo123"
              right={
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5"
                  style={{ color: '#A78BFA' }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* API Error */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px]"
                  style={{ backgroundColor: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)', color: '#B91C1C' }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-[13px] font-semibold"
                  style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', color: '#065F46' }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Signed in! Redirecting to your dashboard…
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || success}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[14px] font-bold transition-all"
              style={{
                backgroundColor: success ? '#059669' : '#0D0D0D',
                color: '#FFFFFF',
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </>
              ) : success ? (
                <><CheckCircle2 className="w-4 h-4" /> Signed in!</>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>

            <p className="text-center text-[12px]" style={{ color: '#7C5CBF' }}>
              Forgot password?{' '}
              <button type="button" className="font-bold underline underline-offset-2" style={{ color: '#5B21B6' }}>
                Reset via college email
              </button>
            </p>
          </form>
        </motion.div>

        {/* Signup CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[13px] mt-6"
          style={{ color: '#5B21B6' }}
        >
          New to Naami?{' '}
          <Link to="/signup" className="font-bold underline underline-offset-2" style={{ color: '#0D0D0D' }}>
            Create your account
          </Link>
        </motion.p>

        {/* Demo note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-4 rounded-xl px-4 py-3 text-center text-[11px]"
          style={{
            backgroundColor: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.15)',
            color: '#7C5CBF',
          }}
        >
          🧪 <strong>Demo mode:</strong> Use <code className="font-mono bg-white/60 px-1 py-0.5 rounded">ritesh@iitb.ac.in</code> with password <code className="font-mono bg-white/60 px-1 py-0.5 rounded">demo123</code>
        </motion.div>
      </div>
    </div>
  );
};
