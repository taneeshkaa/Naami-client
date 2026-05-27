import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, BookOpen, GraduationCap, Building2, ChevronLeft, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { sendOtp, verifyOtp, checkUsername, signUp, COLLEGE_LIST, COURSE_LIST, YEAR_LIST } from '../api/mockAuth';

/* ── UI Helpers ── */
const InputField = ({ label, id, type = 'text', value, onChange, placeholder, icon: Icon, error, hint }) => (
  <div className="flex flex-col gap-1.5 w-full">
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
          padding: '12px 14px 12px 42px',
          backgroundColor: error ? 'rgba(220,38,38,0.05)' : 'rgba(255,255,255,0.85)',
          border: `1.5px solid ${error ? 'rgba(220,38,38,0.4)' : 'rgba(124,58,237,0.18)'}`,
          color: '#0D0D0D',
        }}
      />
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

const SelectField = ({ label, id, value, onChange, options, icon: Icon, error }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label htmlFor={id} className="text-[12px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#3B1D6E' }}>
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10"
          style={{ color: error ? '#DC2626' : '#A78BFA' }}
        />
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl text-[14px] font-medium outline-none transition-all appearance-none cursor-pointer relative"
        style={{
          padding: '12px 36px 12px 42px',
          backgroundColor: error ? 'rgba(220,38,38,0.05)' : 'rgba(255,255,255,0.85)',
          border: `1.5px solid ${error ? 'rgba(220,38,38,0.4)' : 'rgba(124,58,237,0.18)'}`,
          color: value ? '#0D0D0D' : '#9CA3AF',
        }}
      >
        <option value="" disabled>Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ color: '#000' }}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
    {error && (
      <p className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: '#DC2626' }}>
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
      </p>
    )}
  </div>
);

/* ── Animations ── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 100 : -100, opacity: 0 }),
};

export const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    collegeEmail: '',
    otp: '',
    name: '',
    username: '',
    password: '',
    phone: '',
    gmail: '',
    college: '',
    course: '',
    year: '',
  });

  const nextStep = () => {
    setDirection(1);
    setApiError('');
    setStep(s => s + 1);
  };
  const prevStep = () => {
    setDirection(-1);
    setApiError('');
    setStep(s => s - 1);
  };

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setApiError('');
  };

  /* ── Step 1: Send OTP ── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!form.collegeEmail) return setErrors({ collegeEmail: 'College email is required' });
    
    setLoading(true);
    try {
      await sendOtp(form.collegeEmail);
      nextStep();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify OTP ── */
  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const joinedOtp = otpArray.join('');
    if (joinedOtp.length < 4) return setErrors({ otp: 'Please enter the complete 4-digit OTP' });
    
    setLoading(true);
    try {
      await verifyOtp(form.collegeEmail, joinedOtp);
      setForm(prev => ({ ...prev, otp: joinedOtp }));
      nextStep();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: Combined Final Details ── */
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.college) errs.college = 'College is required';
    if (!form.course) errs.course = 'Course is required';
    if (!form.year) errs.year = 'Year is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.gmail.trim()) errs.gmail = 'Secondary email (Gmail) is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const res = await checkUsername(form.username);
      if (!res.available) throw new Error('Username is already taken');
      await signUp(form);
      setStep(4); // Success step
      setTimeout(() => navigate('/feed'), 1500);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepsCount = 3; // Exclude success step

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: '#E8DFF5' }}>
      {/* Background aesthetics */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(167,139,250,0.15) 0%, transparent 70%)' }} />

      <div className={`relative z-10 w-full transition-all duration-500 ease-out ${step === 3 ? 'max-w-[900px]' : 'max-w-[440px]'}`}>
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-[16px] mb-3 hover:scale-105 transition-transform" style={{ backgroundColor: '#7C3AED' }}>
            N
          </Link>
          <h1 className="text-[26px] font-black tracking-tight text-center" style={{ color: '#0D0D0D' }}>
            Join the Ecosystem
          </h1>
          {step <= stepsCount && (
            <div className="flex gap-1.5 mt-3">
              {Array.from({ length: stepsCount }).map((_, i) => (
                <div key={i} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i + 1 === step ? '24px' : '8px', backgroundColor: i + 1 <= step ? '#7C3AED' : 'rgba(124,58,237,0.2)' }} />
              ))}
            </div>
          )}
        </div>

        {/* Card container */}
        <div 
          className="rounded-2xl overflow-hidden shadow-2xl relative bg-white/80 backdrop-blur-xl border border-white/40"
          style={{ boxShadow: '0 12px 48px rgba(124,58,237,0.1), 0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className={`${step === 3 ? 'p-0 flex flex-col md:flex-row' : 'px-7 py-8'} min-h-[400px]`}>
            
            <AnimatePresence mode="wait" custom={direction}>
              
              {/* STEP 1: College Email */}
              {step === 1 && (
                <motion.form key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }} onSubmit={handleSendOtp} className="flex flex-col h-full">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-violet-100 text-violet-700 mb-3 border border-violet-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verification
                    </div>
                    <h2 className="text-[20px] font-bold text-gray-900 leading-tight">Enter your college email</h2>
                    <p className="text-[13px] text-gray-500 mt-1.5">You must use an active .ac.in or .edu email.</p>
                  </div>

                  <div className="flex-1">
                    <InputField label="Official Email Address" id="signup-email" type="email" value={form.collegeEmail} onChange={update('collegeEmail')} placeholder="student@iitb.ac.in" icon={Mail} error={errors.collegeEmail} />
                  </div>

                  {apiError && <p className="text-red-500 text-[13px] font-medium text-center mt-4 bg-red-50 p-2 rounded-lg">{apiError}</p>}

                  <div className="mt-6">
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 rounded-xl text-[14px] font-bold text-white bg-gray-900 flex items-center justify-center gap-2 shadow-lg shadow-gray-200 disabled:opacity-70">
                      {loading ? 'Sending OTP...' : <>Send Verification Code <ArrowRight className="w-4 h-4" /></>}
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* STEP 2: OTP Verification */}
              {step === 2 && (
                <motion.form key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} onSubmit={handleVerifyOtp} className="flex flex-col h-full">
                  <button type="button" onClick={prevStep} className="absolute left-[-10px] top-[-10px] p-2 text-gray-400 hover:text-gray-800 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="text-center mb-6">
                    <h2 className="text-[20px] font-bold text-gray-900">Check your inbox</h2>
                    <p className="text-[13px] text-gray-500 mt-1.5">We sent a 4-digit code to <br/><span className="font-semibold text-gray-700">{form.collegeEmail}</span></p>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="flex gap-3 justify-center mb-2">
                      {otpArray.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            const newArr = [...otpArray];
                            newArr[idx] = val;
                            setOtpArray(newArr);
                            setErrors(e => ({ ...e, otp: '' }));
                            setApiError('');
                            if (val && idx < 3) document.getElementById(`otp-${idx+1}`).focus();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && idx > 0) {
                              document.getElementById(`otp-${idx-1}`).focus();
                            }
                          }}
                          className="w-12 h-14 text-center text-xl font-bold bg-white border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:bg-violet-50 outline-none transition-colors"
                        />
                      ))}
                    </div>
                    {errors.otp && <p className="text-red-500 text-[12px] font-medium mt-2">{errors.otp}</p>}
                    {apiError && <p className="text-red-500 text-[12px] font-medium mt-2 bg-red-50 p-2 rounded-lg">{apiError}</p>}
                    
                    <p className="text-[12px] text-gray-500 mt-4 text-center">
                      🧪 Demo hint: use <strong className="text-violet-600 bg-violet-50 px-1 py-0.5 rounded">7429</strong>
                    </p>
                  </div>

                  <div className="mt-8">
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 rounded-xl text-[14px] font-bold text-white bg-gray-900 flex items-center justify-center gap-2">
                       {loading ? 'Verifying...' : 'Verify Email'}
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3: Combined Final Details */}
              {step === 3 && (
                <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col md:flex-row w-full bg-white">
                  
                  {/* Left Side Info / Graphic */}
                  <div className="hidden md:flex flex-col justify-between w-2/5 p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #3B1D6E 100%)' }}>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-white/20 text-white mb-6 border border-white/30 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified
                      </div>
                      <h2 className="text-[28px] font-black text-white leading-tight mb-4">Complete your Profile</h2>
                      <p className="text-[14px] text-violet-200 leading-relaxed font-medium">
                        Join your college ecosystem to connect with peers, discover events, and access exclusive academic opportunities.
                      </p>
                    </div>

                    <div className="relative z-10 mt-12 grid grid-cols-2 gap-4">
                       <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                         <User className="w-6 h-6 text-white mb-2" />
                         <div className="text-white text-[13px] font-bold">Networking</div>
                       </div>
                       <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                         <Building2 className="w-6 h-6 text-white mb-2" />
                         <div className="text-white text-[13px] font-bold">Ecosystems</div>
                       </div>
                    </div>

                    {/* Decorative blurred circles */}
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none" />
                    <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none" />
                  </div>

                  {/* Right Side Form */}
                  <div className="w-full md:w-3/5 p-8 h-[600px] overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleFinalSubmit} className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[20px] font-bold text-gray-900">Setup your identity</h3>
                        <button type="button" onClick={prevStep} className="p-2 text-gray-400 hover:text-gray-800 transition-colors flex items-center text-sm font-medium gap-1 bg-gray-50 rounded-lg hover:bg-gray-100">
                          <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Section: Personal Info */}
                        <div className="col-span-2 space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-[11px]">1</div>
                             <h4 className="text-[14px] font-bold text-gray-800">Personal Info</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Full Name" id="signup-name" value={form.name} onChange={update('name')} placeholder="e.g. Rahul Sharma" icon={User} error={errors.name} />
                            <InputField label="Username" id="signup-username" value={form.username} onChange={update('username')} placeholder="e.g. rahul_iitb" icon={Sparkles} error={errors.username} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Phone Number" id="signup-phone" type="tel" value={form.phone} onChange={update('phone')} placeholder="e.g. 9876543210" icon={Phone} error={errors.phone} />
                            <InputField label="Secondary Email" id="signup-gmail" type="email" value={form.gmail} onChange={update('gmail')} placeholder="Backup Gmail" icon={Mail} error={errors.gmail} />
                          </div>
                        </div>

                        <div className="w-full h-[1px] bg-gray-100 my-2" />

                        {/* Section: Academic Details */}
                        <div className="col-span-2 space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-[11px]">2</div>
                             <h4 className="text-[14px] font-bold text-gray-800">Academics</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <SelectField label="College / University" id="signup-college" value={form.college} onChange={update('college')} options={COLLEGE_LIST} icon={Building2} error={errors.college} />
                            </div>
                            <SelectField label="Course / Major" id="signup-course" value={form.course} onChange={update('course')} options={COURSE_LIST} icon={BookOpen} error={errors.course} />
                            <SelectField label="Year of Study" id="signup-year" value={form.year} onChange={update('year')} options={YEAR_LIST} icon={GraduationCap} error={errors.year} />
                          </div>
                        </div>

                        <div className="w-full h-[1px] bg-gray-100 my-2" />

                        {/* Section: Security */}
                        <div className="col-span-2 space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                             <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-[11px]">3</div>
                             <h4 className="text-[14px] font-bold text-gray-800">Security</h4>
                          </div>
                          <InputField label="Create Password" id="signup-password" type="password" value={form.password} onChange={update('password')} placeholder="Min 6 characters" icon={Lock} error={errors.password} />
                        </div>
                      </div>

                      {apiError && <p className="text-red-500 text-[13px] font-medium text-center mt-6 bg-red-50 p-3 rounded-lg">{apiError}</p>}

                      <div className="mt-8 mb-4">
                        <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 rounded-xl text-[14px] font-bold text-white bg-gray-900 shadow-lg shadow-gray-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
                          {loading ? 'Creating Account...' : 'Complete Signup'}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* SUCCESS STEP */}
              {step === 4 && (
                <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex flex-col h-full items-center justify-center text-center py-16 px-8">
                   <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                     <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                   </div>
                   <h2 className="text-[28px] font-black text-gray-900 mb-2">You're all set!</h2>
                   <p className="text-gray-500 text-[15px] max-w-sm">Your identity has been verified and your profile is successfully created. Preparing your college dashboard...</p>
                   
                   <div className="mt-10">
                    <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Footer Login Link */}
        {step < 4 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center text-[13px] mt-6" style={{ color: '#5B21B6' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-bold underline underline-offset-2" style={{ color: '#0D0D0D' }}>
              Sign in here
            </Link>
          </motion.p>
        )}
      </div>
    </div>
  );
};
