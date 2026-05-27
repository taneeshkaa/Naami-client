import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
// eslint-disable-next-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, QrCode, ShieldCheck,
  Building2, CalendarDays, Tag, Trophy, Clock,
  Users, Mail, Layers, Sparkles, ChevronRight,
  Star, Globe, Zap, Play, Award, Activity, Camera, Music, Code2, Medal, Crown
} from 'lucide-react';
import FannedEventCards from '../components/hero/FannedEventCards';

/* ─────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerFast = {
  visible: { transition: { staggerChildren: 0.07 } },
};

/* ─────────────────────────────────────────
   SCROLL-TRIGGERED SECTION WRAPPER
───────────────────────────────────────── */
const InView = ({ children, className = '', delay = 0, variants = fadeUp }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ ...variants, visible: { ...variants.visible, transition: { ...variants.visible?.transition, delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   HERO – PRODUCT MOCKUP CARD
───────────────────────────────────────── */
// eslint-disable-next-line no-unused-vars
const HeroMockup = () => (
  <motion.div
    initial={{ opacity: 0, y: 60, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    transition={{ 
      duration: 0.9, 
      delay: 0.5, 
      ease: [0.22, 1, 0.36, 1],
      scale: { duration: 0.3, ease: 'easeOut' }
    }}
    className="w-full max-w-2xl mx-auto relative group"
  >
    {/* Radial glow blob for contrast and halo */}
    <div className="absolute inset-0 bg-accent/30 blur-[80px] rounded-full pointer-events-none transition-all duration-500 group-hover:bg-accent/40" />

    {/* Floating container */}
    <motion.div 
      className="relative w-full z-10"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      {/* Browser chrome */}
      <div className="bg-[#1e1b4b]/90 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-[0_45px_100px_rgba(0,0,0,0.6)] group-hover:shadow-[0_45px_120px_rgba(124,58,237,0.3)] transition-shadow duration-500">
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="flex-1 mx-3 bg-white/10 rounded-md px-3 py-1 text-[11px] text-white/40 font-mono">
          naami.app/iitbombay
        </div>
      </div>

      {/* Mockup content */}
      <div className="p-5 space-y-3">
        {/* College row */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">College</p>
            <p className="text-[13px] font-bold text-white">IIT Bombay</p>
          </div>
          <span className="text-[10px] text-violet-300 bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 rounded-full font-semibold">Verified ✓</span>
        </div>

        {/* Club row */}
        <div className="ml-6 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Layers className="w-4 h-4 text-white/60" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Club</p>
            <p className="text-[13px] font-bold text-white">E-Cell IITB</p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-white/40">
            <Users className="w-3 h-3" /> 4.2k followers
          </div>
        </div>

        {/* Event row */}
        <div className="ml-12 bg-white rounded-xl overflow-hidden border border-white/20 shadow-lg">
          <div className="px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1">Event</p>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-bold text-gray-900 leading-snug">Eureka! Startup Summit</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                    <CalendarDays className="w-3 h-3" /> Apr 18 · 10 AM
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                    <Trophy className="w-2.5 h-2.5" /> ₹50,000
                  </span>
                </div>
              </div>
              <button className="flex-shrink-0 text-[11px] font-bold bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
                Register
              </button>
            </div>
          </div>
        </div>

        {/* Subtle bottom fade-out */}
        <div className="h-6 bg-gradient-to-b from-transparent to-[#1e1b4b]/60 rounded-b-xl -mt-2 pointer-events-none" />
      </div>
    </div>
    </motion.div>
  </motion.div>
);

/* ─────────────────────────────────────────
   BENTO CARDS
───────────────────────────────────────── */
const VerificationCard = () => (
  <div className="border border-gray-100 rounded-2xl p-6 flex flex-col justify-between h-full min-h-[300px] bg-white hover:shadow-md transition-shadow duration-300 overflow-hidden relative group">
    {/* Subtle accent glow on hover */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-100 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

    <div className="relative">
      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-5">
        <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <h3 className="text-[16px] font-bold text-textMain mb-1.5 leading-snug tracking-tight">
        College-Verified Identity
      </h3>
      <p className="text-[13px] text-textMuted leading-relaxed">
        Every account is verified against an official college domain. No bots. No fakes.
      </p>
    </div>

    {/* OTP visual */}
    <div className="mt-6 border border-gray-100 rounded-xl p-4 bg-gray-50/80">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[11px] text-gray-400 font-mono flex-1">ritesh@iitb.ac.in</span>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
      </div>
      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2.5">One-Time Code</p>
      <div className="flex gap-2">
        {['7', '4', '2', '9', '—', '—'].map((d, i) => (
          <div
            key={i}
            className={`flex-1 text-center py-2 text-[14px] font-bold rounded-lg border transition-colors ${i < 4
              ? 'border-accent bg-accent/5 text-accent'
              : 'border-gray-200 bg-white text-gray-300'
              }`}
          >
            {d}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-emerald-500 font-semibold mt-2.5 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Domain verified · iitb.ac.in
      </p>
    </div>
  </div>
);

const HierarchyCard = () => (
  <div className="border border-gray-100 rounded-2xl p-6 flex flex-col h-full min-h-[300px] bg-white hover:shadow-md transition-shadow duration-300 group overflow-hidden relative">
    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-violet-100 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

    <div className="relative">
      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-5">
        <Layers className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <h3 className="text-[16px] font-bold text-textMain mb-1.5 leading-snug tracking-tight">
        Every Event Has a Home
      </h3>
      <p className="text-[13px] text-textMuted leading-relaxed mb-5">
        A structured hierarchy keeps every event organized, discoverable, and trusted.
      </p>
    </div>

    {/* Tree */}
    <div className="relative flex-1 flex flex-col gap-0">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-accent text-white rounded-xl">
        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-[12px] font-bold">IIT Bombay</span>
        <span className="ml-auto text-[9px] font-bold uppercase tracking-widest bg-white/20 px-1.5 py-0.5 rounded-full">College</span>
      </div>
      <div className="flex">
        <div className="ml-5 w-px bg-gray-200 flex-shrink-0" />
        <div className="flex-1 pt-2 pb-2 pl-3 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-3 py-2 border border-gray-100 rounded-xl bg-accent/5">
            <Layers className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span className="text-[12px] font-bold text-textMain">E-Cell IITB</span>
            <span className="ml-auto text-[9px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-1.5 py-0.5 rounded-full">Club</span>
          </div>
          <div className="flex">
            <div className="ml-5 w-px bg-gray-200 flex-shrink-0" />
            <div className="flex-1 pt-2 pl-3">
              <div className="flex items-center gap-3 px-3 py-2 border border-gray-100 rounded-xl bg-gray-50">
                <CalendarDays className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="text-[12px] font-bold text-textMain">Eureka! Summit</span>
                <span className="ml-auto text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded-full">Event</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const QrEntryCard = () => {
  const QR_PATTERN = [
    1, 1, 1, 0, 1, 1, 1,
    1, 0, 1, 0, 1, 0, 1,
    1, 1, 1, 0, 1, 1, 1,
    0, 0, 1, 1, 1, 0, 0,
    1, 1, 1, 0, 1, 1, 1,
    1, 0, 0, 1, 0, 0, 1,
    1, 1, 1, 0, 1, 1, 1,
  ];
  return (
    <div className="border border-gray-100 rounded-2xl p-6 flex flex-col justify-between h-full min-h-[300px] bg-white hover:shadow-md transition-shadow duration-300 group overflow-hidden relative">
      <div className="absolute -top-8 -right-8 w-28 h-28 bg-violet-100 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-5">
          <QrCode className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <h3 className="text-[16px] font-bold text-textMain mb-1.5 leading-snug tracking-tight">
          Instant QR Entry
        </h3>
        <p className="text-[13px] text-textMuted leading-relaxed">
          Every registration generates a unique QR pass. Organizers scan. You're in.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <div className="border-2 border-accent/20 rounded-2xl p-3 inline-block bg-white shadow-sm">
          <div className="grid gap-px" style={{ gridTemplateColumns: 'repeat(7, 1fr)', width: 80, height: 80 }}>
            {QR_PATTERN.map((cell, i) => (
              <div key={i} className={`rounded-[1px] ${cell ? 'bg-accent' : 'bg-white'}`} />
            ))}
          </div>
        </div>
        <p className="mt-3 text-[11px] font-bold tracking-widest uppercase text-textMuted">Scan to Enter</p>
        <p className="mt-1 text-[10px] text-gray-300 font-mono">naami://pass/E9X2K7</p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   HIGH-QUALITY EVENT CARD (TEASER)
───────────────────────────────────────── */
const EventTeaserCard = () => (
  <div className="w-full border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] bg-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.10)] transition-all duration-300">
    {/* Image area */}
    <div className="relative bg-gradient-to-br from-violet-900 via-violet-700 to-indigo-800 h-48 md:h-56 flex items-end p-5">
      {/* Badges */}
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-white text-accent rounded-lg shadow">
          <Trophy className="w-3 h-3" /> ₹50,000 Prize Pool
        </span>
      </div>
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-black/30 backdrop-blur-sm text-white rounded-lg border border-white/20">
          <Users className="w-3 h-3" /> 2–4 / Team
        </span>
      </div>
      {/* Bottom title overlay */}
      <div>
        <p className="text-[11px] text-white/60 font-semibold uppercase tracking-widest mb-1">Hosted by E-Cell IITB</p>
        <h3 className="text-[20px] font-black text-white leading-tight tracking-tight">
          Eureka! Startup Summit 2026
        </h3>
      </div>
    </div>

    {/* Info row */}
    <div className="px-5 pt-4 pb-5">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {[
          { icon: CalendarDays, label: 'April 18, 2026' },
          { icon: Clock, label: '10:00 AM IST' },
          { icon: Tag, label: 'Startup · Tech' },
          { icon: Globe, label: 'IIT Bombay' },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium border border-gray-100 text-gray-500 rounded-lg bg-gray-50">
            <Icon className="w-3 h-3" /> {label}
          </span>
        ))}
      </div>

      <p className="text-[13px] text-textMuted leading-relaxed mb-5">
        Asia's largest student-run startup competition. Pitch to top VCs and angel investors. Win funding, mentorship, and more.
      </p>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">Registrations Open</p>
          <p className="text-[13px] font-bold text-textMain">Closes in <span className="text-accent">6 days</span></p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold bg-accent text-white rounded-xl hover:bg-violet-700 active:scale-95 transition-all duration-150 shadow-md shadow-accent/20">
          Register Now <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   FEATURE LIST ITEM
───────────────────────────────────────── */
const Feature = ({ children }) => (
  <motion.li variants={fadeUp} className="flex items-center gap-2.5 text-[13px] text-gray-700 font-medium">
    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={2.5} />
    {children}
  </motion.li>
);

/* ─────────────────────────────────────────
   STATS BAR
───────────────────────────────────────── */
const stats = [
  { value: '120+', label: 'Colleges' },
  { value: '600+', label: 'Active Clubs' },
  { value: '3,400+', label: 'Events Hosted' },
  { value: '80K+', label: 'Students' },
];

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export const LandingPage = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const buzzwords = ['Hackathons', 'Cultural Fests', 'Workshops', 'Annual Fests', 'Project Showcases'];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % buzzwords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [buzzwords.length]);

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── NEW TWO-COLUMN HERO ─────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-center pt-28 pb-0 overflow-hidden"
        style={{ backgroundColor: '#F5F3FF' }}
      >
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] mix-blend-multiply animate-float pointer-events-none opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px] mix-blend-multiply animate-float-slow pointer-events-none opacity-30" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center flex-1 px-5 md:px-8 mt-10">

          {/* 👈 LEFT COLUMN 45% */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center py-10 lg:py-0">
             {/* 1. Social Proof Line */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="flex items-center gap-3 mb-6"
             >
                <div className="flex -space-x-2">
                  {['#7C3AED', '#6D28D9', '#A78BFA', '#8B5CF6'].map((c, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-[#F5F3FF] flex items-center justify-center text-white text-[8px] font-bold shadow-sm"
                      style={{ backgroundColor: c }}
                    >
                      {['A', 'K', 'R', 'S'][i]}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <span className="text-[12px] font-semibold text-gray-500">Trusted by 80K+ students across India</span>
             </motion.div>

             {/* 2. Headline */}
             <div className="flex flex-col gap-1">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="font-black text-[#0F0F1A] leading-[1.05] tracking-tight"
                  style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}
                >
                  Introducing Naami
                </motion.h1>
             </div>

             {/* 3. Rotating Word Line */}
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.6, delay: 0.3 }}
               className="mt-4 text-[1.05rem] font-semibold text-gray-500 flex items-center gap-2 h-8"
             >
                Made for <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="relative flex-1 overflow-hidden h-full pt-0.5">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={buzzwords[wordIndex]}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute left-0 text-[#7C3AED]"
                    >
                      {buzzwords[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
             </motion.div>

             {/* 4. Subtitle */}
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
               className="mt-6 text-[1.1rem] text-[#6B7280] leading-relaxed max-w-md font-medium"
             >
               Discover, register, and experience every event happening across India's top colleges.
             </motion.p>

             {/* 5. Two Buttons */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.6 }}
               className="flex flex-wrap items-center gap-4 mt-10"
             >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-7 py-3.5 rounded-full text-white font-bold text-[14px] flex items-center gap-2 hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
                >
                  Get Early Access <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: '#0F0F1A', color: '#FFF' }}
                  whileTap={{ scale: 0.96 }}
                  className="px-7 py-3.5 rounded-full border-2 border-[#0F0F1A] text-[#0F0F1A] font-bold text-[14px] flex items-center gap-2 transition-colors"
                >
                  See How It Works <Play className="w-4 h-4 fill-current" />
                </motion.button>
             </motion.div>

             {/* 6. Four Stat Pills */}
             <motion.div
               initial="hidden"
               animate="visible"
               variants={{
                 visible: { transition: { staggerChildren: 0.1, delayChildren: 0.8 } }
               }}
               className="flex flex-wrap items-center gap-3 mt-12"
             >
                {['🎓 500+ Colleges', '📅 10K+ Events', '👥 80K+ Students', '🏆 ₹2Cr+ in Prizes'].map((stat) => (
                  <motion.div
                    key={stat}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                    }}
                    className="bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 text-[12px] font-bold text-gray-700"
                  >
                    {stat}
                  </motion.div>
                ))}
             </motion.div>
          </div>

          {/* 👉 RIGHT COLUMN: MAC DESKTOP MOCKUP 55% */}
          <div className="w-full lg:w-[55%] relative flex justify-center items-center mt-16 lg:mt-0 lg:pl-12 perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateY: -15, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: -5, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white transform-gpu"
              style={{ transformStyle: 'preserve-3d', boxShadow: '-20px 20px 60px rgba(0,0,0,0.08)' }}
            >
              {/* Mac Window Header */}
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-gray-500 text-[11px] font-semibold bg-white border border-gray-200 px-4 py-1.5 rounded-md text-center flex-1 mx-4 max-w-sm flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> naami.app/discover
                </div>
                <div className="w-14"></div> {/* Spacer to center URL */}
              </div>

              {/* Mac Window Content */}
              <div className="relative bg-gray-50 p-6 h-[420px] overflow-hidden flex inset-0">
                {/* Sidebar Mockup */}
                <div className="w-[30%] border-r border-gray-200 pr-6 hidden sm:block">
                  <div className="h-8 bg-gray-200 rounded-md animate-pulse mb-6"></div>
                  <div className="space-y-4">
                     {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-3 items-center">
                           <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                           <div className="h-4 bg-gray-200 rounded-md flex-1"></div>
                        </div>
                     ))}
                  </div>
                </div>
                
                {/* Live feed items */}
                <div className="flex-1 sm:pl-6 space-y-6 overflow-hidden relative mask-activity">
                   <div className="animate-[scrollUp_20s_linear_infinite] flex flex-col gap-4">
                      {[
                        { title: 'Tech Symposium 2026', host: 'IEEE SG', time: 'Just now', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100' },
                        { title: 'Basketball Tryouts', host: 'Sports Club', time: '2m ago', icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-100' },
                        { title: 'Code Jam Registration', host: 'DevSoc', time: '15m ago', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
                        { title: 'Drama Auditions', host: 'Culture Club', time: '1h ago', icon: Users, color: 'text-pink-600', bg: 'bg-pink-100' },
                        { title: 'Startup Mixer', host: 'E-Cell', time: '3h ago', icon: Sparkles, color: 'text-green-600', bg: 'bg-green-100' },
                        // Duplicate for smooth scroll
                        { title: 'Tech Symposium 2026', host: 'IEEE SG', time: 'Just now', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100' },
                        { title: 'Basketball Tryouts', host: 'Sports Club', time: '2m ago', icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-100' },
                        { title: 'Code Jam Registration', host: 'DevSoc', time: '15m ago', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
                      ].map((item, i) => (
                         <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                               <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="text-gray-900 text-[14px] font-bold truncate">{item.title}</h4>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-gray-500 text-[12px] font-medium">{item.host}</span>
                                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                  <span className="text-gray-400 text-[11px]">{item.time}</span>
                               </div>
                            </div>
                            <button className="bg-gray-50 text-gray-600 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-gray-200">
                               RSVP
                            </button>
                         </div>
                      ))}
                   </div>
                </div>
                
                {/* Interactive cursor element */}
                <motion.div 
                  className="absolute z-20 pointer-events-none"
                  animate={{
                     x: [150, 280, 200, 320, 150],
                     y: [150, 80, 250, 200, 150]
                  }}
                  transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
                     <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.61c.45 0 .67-.54.35-.85L5.85 2.86a.5.5 0 0 0-.85.35Z" fill="#1C1C1C" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  <motion.div 
                    animate={{ opacity: [1, 1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="mt-1 ml-4 bg-accent text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap"
                  >
                     Ritesh clicked RSVP
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* 🎓 COLLEGE TICKER */}
        <div className="w-full mt-24 border-t border-[#E5E7EB] pt-5 pb-5 overflow-hidden relative z-10 flex-shrink-0">
           {/* Marquee Gradient Masks */}
           <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F5F3FF] to-transparent z-10 border-t border-[#E5E7EB] -mt-px pointer-events-none" />
           <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F5F3FF] to-transparent z-10 border-t border-[#E5E7EB] -mt-px pointer-events-none" />

           <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] items-center w-max">
              {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex items-center text-gray-500 font-bold text-[13px] opacity-60">
                    <span className="mx-6">IIT Bombay</span><span className="text-gray-300">·</span>
                    <span className="mx-6">BITS Pilani</span><span className="text-gray-300">·</span>
                    <span className="mx-6">DTU</span><span className="text-gray-300">·</span>
                    <span className="mx-6">VIT</span><span className="text-gray-300">·</span>
                    <span className="mx-6">NSUT</span><span className="text-gray-300">·</span>
                    <span className="mx-6">NIT Trichy</span><span className="text-gray-300">·</span>
                    <span className="mx-6">IIT Delhi</span><span className="text-gray-300">·</span>
                    <span className="mx-6">Amity</span><span className="text-gray-300">·</span>
                    <span className="mx-6">Manipal</span><span className="text-gray-300">·</span>
                    <span className="mx-6">SRM</span><span className="text-gray-300">·</span>
                    <span className="mx-6">IIIT Hyderabad</span><span className="text-gray-300">·</span>
                    <span className="mx-6">Jadavpur</span><span className="text-gray-300">·</span>
                 </div>
              ))}
           </div>
           <style dangerouslySetInnerHTML={{__html: `
              @keyframes marquee {
                 0% { transform: translateX(0); }
                 100% { transform: translateX(-33.333333%); }
              }
              @keyframes scrollUp {
                 0% { transform: translateY(0); }
                 100% { transform: translateY(-50%); }
              }
              .mask-activity {
                 mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
                 -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
              }
           `}} />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 md:py-32 bg-white relative z-30">
        <InView className="max-w-6xl mx-auto px-5 md:px-8 text-center">
           <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/20 rounded-full px-3.5 py-1 mb-5">
             <Code2 className="w-3 h-3 text-accent" />
             <span className="text-[11px] font-bold text-accent uppercase tracking-widest">Simple Process</span>
           </div>
           <h2 className="text-[28px] md:text-[42px] font-black tracking-[-0.03em] text-textMain mb-16 leading-tight">
             From zero to campus insider in <span className="text-accent underline decoration-accent/30 underline-offset-4">minutes.</span>
           </h2>
           <motion.div 
             variants={staggerFast}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative"
           >
             {/* Connecting Line for Desktop */}
             <div className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent border-t border-dashed border-accent/30 z-0"></div>

             {[
               { icon: ShieldCheck, title: "1. Verified Setup", desc: "Use your official college email (e.g., @iitb.ac.in). We ensure a zero-bot, trusted student network." },
               { icon: Layers, title: "2. Find Your Tribe", desc: "Browse official clubs, cultural groups, and departments to curate your campus feed." },
               { icon: CalendarDays, title: "3. RSVP & Experience", desc: "Register for events in one click. Your QR pass grants instant entry—no paper tickets." }
             ].map((step, idx) => (
               <motion.div key={idx} variants={fadeUp} className="flex flex-col items-center relative z-10 group">
                 <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(124,58,237,0.15)] group-hover:-translate-y-2">
                   <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="absolute inset-0 bg-accent rounded-3xl opacity-0 group-hover:opacity-[0.03] scale-50 group-hover:scale-100 transition-all duration-700"></div>
                   <step.icon className="w-10 h-10 text-accent group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                 </div>
                 <h3 className="text-[20px] font-black text-gray-900 mb-3 tracking-tight group-hover:text-accent transition-colors duration-300">{step.title}</h3>
                 <p className="text-[14.5px] text-gray-500 leading-relaxed max-w-[280px]">{step.desc}</p>
               </motion.div>
             ))}
           </motion.div>
        </InView>
      </section>

      {/* ── STATS STRIP ──────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50/30 overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-1/3 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
        <InView>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerFast}
            className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 relative z-10"
          >
            {stats.map((s, idx) => {
              const icons = [Building2, Layers, CalendarDays, Users];
              const Icon = icons[idx];
              return (
                <motion.div key={s.label} variants={fadeUp} className="px-8 py-10 flex flex-col items-center group hover:bg-white hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 cursor-default">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-accent/5 group-hover:border-accent/20 transition-all duration-300">
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors duration-300" strokeWidth={2} />
                  </div>
                  <p className="text-[38px] md:text-[44px] font-black tracking-tighter text-textMain group-hover:text-accent transition-colors duration-300">{s.value}</p>
                  <p className="text-[14px] text-textMuted font-semibold mt-1 uppercase tracking-widest">{s.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </InView>
      </section>

      {/* ── BENTO GRID ───────────────────────── */}
      <section id="features" className="px-5 md:px-8 py-20 md:py-28 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <InView className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/20 rounded-full px-3.5 py-1 mb-5">
              <Zap className="w-3 h-3 text-accent" />
              <span className="text-[11px] font-bold text-accent uppercase tracking-widest">Platform Features</span>
            </div>
            <h2 className="text-[28px] md:text-[42px] font-black tracking-[-0.03em] text-textMain leading-tight mb-4">
              Built for the structure<br />of campus life.
            </h2>
            <p className="text-[15px] text-textMuted max-w-lg mx-auto leading-relaxed">
              Every feature is designed around how colleges, clubs, and events actually work together.
            </p>
          </InView>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[VerificationCard, HierarchyCard, QrEntryCard].map((Card, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── EVENT TEASER ─────────────────────── */}
      <section id="explore" className="px-5 md:px-8 py-20 md:py-28 border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-14 md:gap-20">
          {/* Left copy */}
          <InView className="flex-shrink-0 md:max-w-xs" delay={0}>
            <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/20 rounded-full px-3.5 py-1 mb-5">
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="text-[11px] font-bold text-accent uppercase tracking-widest">Discovery</span>
            </div>
            <h2 className="text-[28px] md:text-[36px] font-black tracking-[-0.03em] text-textMain leading-tight mb-4">
              Every event, beautifully presented.
            </h2>
            <p className="text-[14px] text-textMuted leading-relaxed mb-7">
              Rich event pages with prize details, timelines, team sizes, and real-time registration counters.
            </p>
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
              className="flex flex-col gap-3 mb-8"
            >
              {[
                'Prize pool & reward breakdown',
                'Date, time, and venue details',
                'Team size and eligibility rules',
                'One-tap QR registration pass',
                'Real-time seat availability',
              ].map((item) => <Feature key={item}>{item}</Feature>)}
            </motion.ul>
            <motion.button
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="inline-flex items-center gap-2 text-[13px] font-bold text-accent border border-accent/20 bg-accent/5 px-4 py-2 rounded-xl hover:bg-accent/10 transition-colors"
            >
              Browse all events <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          </InView>

          {/* Right: Event card */}
          <InView className="flex-1 w-full" delay={0.15}>
            <EventTeaserCard />
          </InView>
        </div>
      </section>

      {/* ── GAMIFIED PORTFOLIO ─────────────────────── */}
      <section id="portfolio" className="px-5 md:px-8 py-20 md:py-28 border-b border-gray-100 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-14 md:gap-24">
          
          {/* Left: Profile Mockup */}
          <InView className="flex-1 w-full relative perspective-1000" delay={0.15}>
             {/* Decorative Background Elements */}
             <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />
             <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />

             <motion.div
               whileHover={{ y: -10, rotateY: 5 }}
               transition={{ type: "spring", stiffness: 300, damping: 20 }}
               className="relative z-10 max-w-[360px] mx-auto bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] transform-gpu"
             >
                {/* Cover & Profile Header */}
                <div className="h-28 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
                   <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
                      <img src={`https://ui-avatars.com/api/?name=Aditi+S&background=random&color=fff&size=100`} alt="Profile" className="w-full h-full object-cover" />
                   </div>
                   <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold border border-white/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" /> Top 1% Campus
                   </div>
                </div>

                <div className="pt-12 px-6 pb-6">
                   <h3 className="text-[20px] font-black text-gray-900 tracking-tight">Aditi Sharma</h3>
                   <div className="flex items-center gap-2 mt-1 mb-4 text-[12px] text-gray-500 font-medium">
                      <Building2 className="w-3.5 h-3.5" /> IIT Bombay <span className="text-gray-300">•</span> CS Major
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-3 gap-2 mb-6">
                      {[
                        { label: 'Events', v: '42', c: 'text-blue-600' },
                        { label: 'Wins', v: '8', c: 'text-amber-500' },
                        { label: 'Points', v: '4.2k', c: 'text-emerald-600' }
                      ].map((st) => (
                         <div key={st.label} className="bg-gray-50 rounded-xl py-3 flex flex-col items-center border border-gray-100">
                            <span className={`text-[18px] font-black ${st.c}`}>{st.v}</span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1">{st.label}</span>
                         </div>
                      ))}
                   </div>

                   {/* Verified Badges */}
                   <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Verified Experience</p>
                      <div className="space-y-3">
                         {[
                           { i: Trophy, t: 'Winner: Web3 Hackathon', b: 'bg-amber-100', ic: 'text-amber-600' },
                           { i: Crown, t: 'Tech Team Core', b: 'bg-purple-100', ic: 'text-purple-600' },
                           { i: Medal, t: '1st Runner Up: Debate', b: 'bg-blue-100', ic: 'text-blue-600' }
                         ].map((badge, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:border-gray-300 transition-colors">
                               <div className={`w-10 h-10 rounded-lg ${badge.b} flex items-center justify-center`}>
                                  <badge.i className={`w-5 h-5 ${badge.ic}`} strokeWidth={2} />
                               </div>
                               <div className="flex-1">
                                  <h4 className="text-[13px] font-bold text-gray-900">{badge.t}</h4>
                                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified by IITB
                                  </p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </motion.div>
          </InView>

          {/* Right: Copy */}
          <InView className="flex-shrink-0 md:max-w-[420px]" delay={0}>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3.5 py-1 mb-5">
              <Award className="w-3 h-3 text-emerald-600" />
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">Digital Portfolio</span>
            </div>
            <h2 className="text-[28px] md:text-[42px] font-black tracking-[-0.03em] text-textMain leading-[1.1] mb-5">
              Your campus life, <br/>beautifully captured.
            </h2>
            <p className="text-[15px] text-textMuted leading-relaxed mb-7">
              Stop manually tracking your achievements. Every hackathon you win, every club you lead, and every certificate you earn is automatically verified and added to your digital resume.
            </p>
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="flex flex-col gap-3 mb-8"
            >
              {[
                'Automatic participation logging',
                'Official college-verified win badges',
                'Global & Campus-level rankings',
                'One-click export for recruiters'
              ].map((item) => (
                <motion.li key={item} variants={fadeUp} className="flex items-center gap-3 text-[14px] text-gray-700 font-semibold bg-gray-50/50 py-2 px-4 rounded-lg border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
            <motion.button
              whileHover={{ x: 4, backgroundColor: '#059669' }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="inline-flex items-center gap-2 text-[14px] font-bold text-white bg-emerald-600 px-6 py-3 rounded-xl shadow-lg shadow-emerald-200 transition-colors"
            >
              View Sample Profile <ChevronRight className="w-4 h-4 text-emerald-100" />
            </motion.button>
          </InView>
        </div>
      </section>

      {/* ── ORGANIZER CTA ─────────────────────── */}
      <section id="for-organizers" className="px-5 md:px-8 py-20 md:py-28 border-b border-gray-100 bg-hero-gradient relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-violet-600/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />
        <InView className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1 mb-6">
            <Zap className="w-3 h-3 text-violet-300" />
            <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">For Organizers</span>
          </div>
          <h2 className="text-[28px] md:text-[42px] font-black tracking-[-0.03em] text-white leading-tight mb-4">
            Your event. Your brand.<br />Zero friction.
          </h2>
          <p className="text-[15px] text-white/50 leading-relaxed max-w-md mx-auto mb-10">
            Create, publish, and manage your event in minutes. Built-in QR scanning, registration analytics, and a verified audience.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-bold bg-white text-accent rounded-xl hover:bg-accent-light transition-colors shadow-xl shadow-accent/20"
          >
            Host an Event <ArrowRight className="w-4 h-4" />
          </motion.button>
        </InView>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer className="bg-[#0F0F1A] text-white/60 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col items-start pr-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-indigo-600 flex items-center justify-center shadow-lg shadow-accent/20">
                <span className="text-white text-[13px] font-black leading-none pt-0.5">N</span>
              </div>
              <span className="text-[20px] font-black text-white tracking-tight">Naami</span>
            </div>
            <p className="text-[14px] leading-relaxed mb-8 max-w-sm">
              The premier platform for college communities, structured hierarchies, and verified student experiences. Reimagining campus life across India.
            </p>
            <div className="flex gap-3 mt-auto">
              {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <button key={social} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center cursor-pointer group">
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-white/40 group-hover:bg-white/80 style-mask-social transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px]">
            {/* Product */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold tracking-widest text-[11px] uppercase mb-2">Product</h4>
              {['Features', 'For Organizers', 'Security', 'Pricing', 'Changelog'].map(l => (
                <a key={l} href="#" className="hover:text-white transition-colors w-fit">{l}</a>
              ))}
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold tracking-widest text-[11px] uppercase mb-2">Resources</h4>
              {['Help Center', 'API Docs', 'Community', 'Case Studies', 'Blog'].map(l => (
                <a key={l} href="#" className="hover:text-white transition-colors w-fit">{l}</a>
              ))}
            </div>

            {/* Company */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold tracking-widest text-[11px] uppercase mb-2">Company</h4>
              {['About Us', 'Careers', 'Brand Kit', 'Contact'].map(l => (
                <a key={l} href="#" className="hover:text-white transition-colors w-fit">{l}</a>
              ))}
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold tracking-widest text-[11px] uppercase mb-2">Legal</h4>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map(l => (
                <a key={l} href="#" className="hover:text-white transition-colors w-fit">{l}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 text-[12px]">
          <p>© 2026 Naami Network Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All systems operational
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
};
