import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useTransform, useMotionValue, animate } from 'framer-motion';
import {
  Home, Search, Play, LayoutGrid, Calendar, Trophy, Tag, Ticket,
  Bell, User, Heart, MessageCircle, Share2, Bookmark,
  TrendingUp, Users, MoreHorizontal, ChevronRight,
  Sparkles, MapPin, Clock, ArrowDown, ArrowUp, SlidersHorizontal,
  Zap, ArrowLeft, ArrowRight, X, Check, Camera, Copy, Link, MessageSquare, Send, Phone, Video, MoreVertical
} from 'lucide-react';

/* ────────────────────────────────────────────────────────
   DESIGN SYSTEM & THEME
   ──────────────────────────────────────────────────────── */

// eslint-disable-next-line no-unused-vars
const COLORS = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  primary: '#7C3AED',   // Violet-600
  secondary: '#E8DFF5', // Light Lavender
  accent: '#7C3AED',    // Clean violet for highlights
  text: {
    main: '#0F172A',
    muted: '#64748B',
  }
};

const BENTO = "bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]";

const SPRING = { stiffness: 260, damping: 20 };

/* ────────────────────────────────────────────────────────
   MOCK DATA
   ──────────────────────────────────────────────────────── */

const MOCK_DATA = {
  user: {
    name: "Ritesh Sharma",
    college: "IIT Bombay",
    handle: "@ritesh_naami",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ritesh",
    tags: ["Designer", "FullStack"],
    stats: { connections: 482, points: 1250, rank: 42 },
    upcoming: [
      { id: 1, title: "Eureka! Startup Summit", time: "2h 45m" },
      { id: 2, title: "Smart India Hackathon", time: "5d 12h" }
    ]
  },
  navItems: [
    { id: 'feed', icon: Home, label: 'Home' },
    { id: 'explore', icon: Search, label: 'Explore' },
    { id: 'reels', icon: Play, label: 'Discover' },
    { id: 'categories', icon: LayoutGrid, label: 'Categories' },
    { id: 'my-events', icon: Calendar, label: 'My Events' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'messaging', icon: MessageSquare, label: 'Messaging' },
  ],
  liveMoments: [
    { id: 1, organizer: "E-Cell IITB", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ecell" },
    { id: 2, organizer: "Mood Indigo", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=moodi" },
    { id: 3, organizer: "TechFest", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=techfest" },
    { id: 4, organizer: "DesignSoc", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=design" },
    { id: 5, organizer: "IITB Racing", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=racing" },
  ],
  events: [
    {
      id: 1,
      category: 'Hackathon',
      title: 'Global AI Hackathon 2026',
      organizer: 'Tech Club',
      college: 'IIT Bombay',
      date: 'Apr 18',
      prize: '₹50,000',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      description: 'The biggest AI hackathon of the year. Build the future with Generative AI.',
      tags: ['AI', 'Python', 'ML'],
      timestamp: '2h ago',
      likes: 1240,
      comments: 86
    },
    {
      id: 2,
      category: 'Cultural',
      title: 'Spring Symphony: Music Night',
      organizer: 'Cultural Soc',
      college: 'IIT Delhi',
      date: 'Apr 20',
      prize: 'N/A',
      image: 'https://images.unsplash.com/photo-1514525253361-b83f859b73c0?auto=format&fit=crop&q=80&w=800',
      description: 'An evening of classical and contemporary fusion music featuring the college choir.',
      tags: ['Music', 'Night', 'Performance'],
      timestamp: '5h ago',
      likes: 850,
      comments: 42
    },
    {
      id: 3,
      category: 'Workshop',
      title: 'Full Stack Web Dev Masterclass',
      organizer: 'DevClub',
      college: 'BITS Pilani',
      date: 'Apr 22',
      prize: 'Certificate',
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800',
      description: 'Intensive 2-day workshop on React, Node.js, and MongoDB.',
      tags: ['React', 'Web', 'Dev'],
      timestamp: '1d ago',
      likes: 2100,
      comments: 110
    }
  ],
  leaderboard: [
    { rank: 1, name: "Advait Rao", score: 8540, delta: 120 },
    { rank: 2, name: "Mehak Jain", score: 8210, delta: -45 },
    { rank: 3, name: "Samkit Shah", score: 7980, delta: 230 }
  ],
  hotThisWeek: [
    { title: "Eureka! Startup Summit", info: "IIT Bombay · 💰 ₹1L" },
    { title: "Smart India Hackathon", info: "National · 💰 ₹2L" }
  ]
};

const CATEGORY_COLORS = {
  Hackathon: "border-l-[#7C3AED]",
  Cultural: "border-l-[#F97316]",
  Workshop: "border-l-[#14B8A6]",
  "Annual Fest": "border-l-[#EC4899]",
  "Project Showcase": "border-l-[#3B82F6]",
  Competition: "border-l-[#EAB308]",
};

/* ────────────────────────────────────────────────────────
   SUB-COMPONENTS: ATOMS & UTILS
   ──────────────────────────────────────────────────────── */

const BentoCard = ({ children, className = "", hover = false, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={hover ? { y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" } : {}}
    className={`${BENTO} rounded-2xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const RippleButton = ({ children, className = "", onClick, variant = "primary" }) => {
  const bg = variant === "primary" ? "bg-gray-900 text-white" : "bg-[#E8DFF5] text-[#7C3AED] border border-[#7C3AED]/10";
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden font-bold tracking-tight rounded-xl transition-all ${bg} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

const NavItem = ({ item, active, onClick }) => (
  <motion.button
    onClick={() => onClick(item.id)}
    whileHover={{ x: 6 }}
    className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[10px] transition-all relative group ${
      active ? 'bg-[#7C3AED]' : 'hover:bg-[#F3F0FF]'
    }`}
  >
    <item.icon className={`w-[20px] h-[20px] relative z-10 transition-colors ${
      active ? 'text-white' : 'text-slate-500 group-hover:text-[#7C3AED]'
    }`} />
    <span className={`text-[14px] font-bold relative z-10 tracking-tight transition-colors ${
      active ? 'text-white' : 'text-slate-500 group-hover:text-[#7C3AED]'
    }`}>
      {item.label}
    </span>
  </motion.button>
);

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white">
      {/* Light Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      {/* Subtle colorful blobs (very faint) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
    </div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: ATOMS
   ──────────────────────────────────────────────────────── */

// eslint-disable-next-line no-unused-vars
const StatCounter = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut", delay: 0.5 });
    return controls.stop;
  }, [value, count]);
  return <motion.span>{rounded}</motion.span>;
};

const EventCard = ({ event, index }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(event.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <BentoCard hover className={`p-0 ${CATEGORY_COLORS[event.category] || 'border-l-transparent'} border-l-4`}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 p-0.5 relative">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.organizer}`} className="w-full h-full rounded-full relative z-10" alt="Org" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{event.organizer}</h4>
              <p className="text-[11px] text-slate-500 font-bold">{event.college} • {event.timestamp}</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-900 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Poster */}
        <div className="px-4">
          <div className="relative rounded-xl overflow-hidden aspect-video group bg-slate-50 border border-slate-100">
            <img src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Post" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2 py-1 rounded-lg bg-white/90 shadow-sm border border-slate-100 text-[10px] font-black uppercase text-slate-900 tracking-widest">
                {event.category}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 pt-5">
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-display tracking-tight leading-tight">{event.title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium">{event.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-500">#{tag}</span>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between gap-4 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">{event.college}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Trophy className="w-4 h-4 text-[#EAB308]" />
                <span className="text-xs font-bold">{event.prize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="px-4 pb-4 flex items-center justify-between mt-2">
          <div className="flex items-center gap-6">
            <motion.button 
              onClick={toggleLike}
              whileTap={{ scale: 1.6 }}
              className={`flex items-center gap-2 text-sm font-bold ${liked ? 'text-pink-600' : 'text-slate-400'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              {likes}
            </motion.button>
            <button className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900">
              <MessageCircle className="w-5 h-5" />
              {event.comments}
            </button>
            <button className="text-slate-400 hover:text-slate-900"><Share2 className="w-5 h-5" /></button>
          </div>

          <RippleButton className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-gray-200">
            Register Now
          </RippleButton>
        </div>
      </BentoCard>
    </motion.div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: SIDEBAR
   ──────────────────────────────────────────────────────── */

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white/50">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-start gap-[10px] pt-[20px] pb-[16px] px-[16px]">
          <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg shadow-gray-200">
            <span className="text-white font-black text-xl italic leading-none">N</span>
          </div>
          <span className="text-[20px] font-bold tracking-tighter text-[#0F0F1A] font-display">Naami</span>
        </div>

        <nav className="space-y-1 px-[8px]">
          {MOCK_DATA.navItems.map(item => (
            <NavItem 
              key={item.id} 
              item={item} 
              active={activeTab === item.id} 
              onClick={setActiveTab} 
            />
          ))}
        </nav>
      </div>

      {/* Redesigned Profile Card */}
      <div 
        className="mt-[12px] mx-[8px] mb-[16px] p-[24px] rounded-[16px] border border-[#E5E7EB] shrink-0" 
        style={{ background: "linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(79, 70, 229, 0.08))" }}
      >
        {/* Top Row */}
        <div className="flex items-center gap-[14px]">
          <img 
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" 
            alt="Profile" 
            className="w-[64px] h-[64px] rounded-full object-cover border-[2px] border-[#7C3AED] bg-white shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-[#0F0F1A] leading-tight truncate">Ritesh Sharma</h3>
            <p className="text-[12px] text-slate-500 truncate mt-0.5">IIT Bombay</p>
            <p className="text-[11px] text-slate-400 truncate">B.Tech · CSE · '26</p>
          </div>
        </div>

        {/* Skills Row */}
        <div className="flex items-center gap-2 mt-[14px] flex-wrap">
          {['React', 'UI/UX', 'Python'].map(skill => (
            <span key={skill} className="bg-[#F3F0FF] text-[#7C3AED] px-[12px] py-[5px] rounded-full text-[12px] font-bold">
              {skill}
            </span>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mt-[14px] pt-[14px] border-t border-slate-200/50">
          <div className="flex-1 text-center border-r border-slate-200/50">
            <p className="text-[20px] font-bold text-[#0F0F1A] leading-none mb-1">482</p>
            <p className="text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold">CONNECTIONS</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-[20px] font-bold text-[#0F0F1A] leading-none mb-1">1250</p>
            <p className="text-[11px] uppercase tracking-[0.05em] text-slate-500 font-bold">POINTS</p>
          </div>
        </div>

        {/* Button */}
        <button 
          onClick={() => setActiveTab('profile')}
          className="w-full mt-[14px] py-[12px] rounded-[10px] border border-[#7C3AED] text-[#7C3AED] text-[14px] font-bold transition-colors hover:bg-[#7C3AED] hover:text-white"
        >
          View Profile →
        </button>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: CENTER PANEL PAGES
   ──────────────────────────────────────────────────────── */

const HIGHLIGHTS_DATA = [
  { 
    id: 1, name: "Ananya", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", seen: false, time: "2h",
    stories: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: 2, name: "Kabir", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", seen: false, time: "3h",
    stories: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: 3, name: "Priya", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", seen: false, time: "5h",
    stories: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: 4, name: "Rohan", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", seen: false, time: "6h",
    stories: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: 5, name: "Sneha", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", seen: true, time: "8h",
    stories: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop"
    ]
  },
  { id: 6, name: "Arjun", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", seen: true, time: "11h", stories: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"] },
  { id: 7, name: "Meera", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face", seen: true, time: "14h", stories: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face"] },
  { id: 8, name: "Dev", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face", seen: true, time: "16h", stories: ["https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face"] },
  { id: 9, name: "Tanvi", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face", seen: true, time: "20h", stories: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face"] },
];

const FEED_POSTS = [
  {
    id: 1, user: { name: "Arjun Mehta", college: "IIT Bombay", club: "Tech Club", time: "2h ago", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
    caption: "Just shipped 'EcoTrack' — an AI-powered sustainability dashboard we built during the 36-hour Smart India Hackathon! Incredibly proud of our team @Sneha @Rohan @Priya for pushing through the night. We went from zero to a working prototype in under 24 hours, and the judges loved our pitch. Special thanks to @DevClub IITB for the mentorship throughout. This is just the beginning. 🚀 #Hackathon #AI #OpenSource #SmartIndiaHackathon",
    images: ["https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop"],
    stats: { likes: 124, comments: 18 },
    eventDetails: { location: "IIT Bombay, Mumbai", category: "Hackathon", attendees: "1,200" }
  },
  {
    id: 2, user: { name: "Isha Kapoor", college: "BITS Pilani", club: "E-Cell", time: "5h ago", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
    caption: "WE WON! 🏆 Incredibly proud of our team for taking 1st place at the Eureka! Startup Summit 2026. Hard work pays off. We pitched our EdTech startup to a panel of 12 investors and came out on top among 200+ teams from across India. The journey from ideation to the final pitch was nothing short of a rollercoaster. Thank you to everyone who believed in us from day one. @Kabir @Dev — we did it! 🎉 #Winner #Entrepreneurship #EurekaStartupSummit #BITS",
    images: ["https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop"],
    stats: { likes: 342, comments: 47 },
    eventDetails: { location: "BITS Pilani, Rajasthan", category: "Competition", attendees: "800" }
  },
  {
    id: 3, user: { name: "Rohan Verma", college: "DTU", club: "Coding Club", time: "8h ago", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    caption: "Just wrapped up an amazing 2-day UI/UX Design Bootcamp at BITS Pilani. Learned so much about design systems, user research, and prototyping from industry experts. Built a complete case study from scratch — redesigning the college canteen ordering experience. Huge thanks to the DesignSoc team for organizing this. If you haven't attended a design workshop yet, you're missing out. #UIUXDesign #Workshop #DesignThinking #DTU",
    images: ["https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop"],
    stats: { likes: 89, comments: 12 },
    eventDetails: { location: "BITS Pilani, Rajasthan", category: "Workshop", attendees: "120" }
  },
  {
    id: 4, user: { name: "Meera Nair", college: "NIT Trichy", club: "Cultural Society", time: "12h ago", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" },
    caption: "Mood Indigo 2026 was absolutely UNREAL. 🎭 Four days of non-stop performances, competitions, and memories that will last forever. Our dance team placed 2nd in the group choreography event — after 3 months of practice this feels surreal. The energy at IIT Bombay during MI is something you have to experience to believe. Already counting down to next year. @Tanvi @Ananya — you were phenomenal out there! #MoodIndigo #CulturalFest #Dance #NITTrichy",
    images: ["https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop"],
    stats: { likes: 567, comments: 83 },
    eventDetails: { location: "IIT Bombay, Mumbai", category: "Cultural Fest", attendees: "15,000" }
  },
  {
    id: 5, user: { name: "Dev Sharma", college: "NSUT", club: "RoboClub", time: "1d ago", photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face" },
    caption: "Our robot 'Titan' just qualified for the national finals of Robocon 2026! 🤖 Six months of weekends, late nights, and countless iterations — all worth it for this moment. We competed against 48 teams in the regional round and came out in the top 3. The autonomous navigation challenge was brutal but Titan handled it like a champ. Next stop: national finals in Pune. Let's go! #Robocon #Robotics #NSUT #Engineering",
    images: ["https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop"],
    stats: { likes: 203, comments: 31 },
    eventDetails: { location: "NSUT, Delhi", category: "Robotics", attendees: "450" }
  },
  {
    id: 6, user: { name: "Tanvi Reddy", college: "VIT Vellore", club: "Photography Club", time: "1d ago", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face" },
    caption: "Covered the annual TechFest at IIT Bombay as the official photographer this year and it was an experience unlike any other. 📸 Over 3 days I shot 2000+ photos — from robotics demos to stand-up comedy nights to the hackathon war room at 3am. Here are some of my favorites from the event. Grateful to @TechFestIITB for the opportunity. #Photography #TechFest #CampusLife #VIT",
    images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop"],
    stats: { likes: 445, comments: 62 },
    eventDetails: { location: "IIT Bombay, Mumbai", category: "Tech Fest", attendees: "8,000" }
  },
  {
    id: 7, user: { name: "Kabir Singh", college: "IIT Delhi", club: "Entrepreneurship Cell", time: "2d ago", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    caption: "Represented IIT Delhi at the Inter-IIT Tech Meet 2026 and came back with the gold in the Product Design challenge. 🥇 Our team of 5 worked on redesigning India's public transport ticketing experience — from research to prototype in 48 hours. The competition was fierce, every IIT brought their A-game. But we stayed focused and delivered something we're genuinely proud of. #InterIIT #ProductDesign #IITDelhi #TechMeet",
    images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop"],
    stats: { likes: 678, comments: 94 },
    eventDetails: { location: "IIT Delhi, Delhi", category: "Tech Meet", attendees: "2,400" }
  },
  {
    id: 8, user: { name: "Ananya Roy", college: "IIT Bombay", club: "DevClub", time: "2d ago", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    caption: "Just open-sourced our project from HackIITB — a real-time collaborative code editor built with React and WebSockets. 💻 We built this in 24 hours and it actually works really well. The repo already has 200+ stars in 2 days which is insane. If you're into web dev, do check it out and contribute! Link in bio. Huge shoutout to @Arjun for the backend architecture — absolute wizard. #OpenSource #WebDev #HackIITB #React",
    images: ["https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop"],
    stats: { likes: 312, comments: 45 },
    eventDetails: { location: "IIT Bombay, Mumbai", category: "Hackathon", attendees: "600" }
  },
  {
    id: 9, user: { name: "Sneha Joshi", college: "Manipal University", club: "Drama Club", time: "3d ago", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
    caption: "Performed in my first ever inter-college theatre competition last weekend at Rendezvous, IIT Delhi. 🎭 We performed an original play on mental health and burnout in college — something close to all our hearts. The audience response was overwhelming. So many people came up to us after saying it resonated with them deeply. Theatre has the power to start conversations that nothing else can. #Theatre #Rendezvous #Drama #MentalHealth #Manipal",
    images: ["https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop"],
    stats: { likes: 189, comments: 27 },
    eventDetails: { location: "IIT Delhi, Delhi", category: "Cultural", attendees: "3,200" }
  },
  {
    id: 10, user: { name: "Priya Mehta", college: "BITS Pilani", club: "Finance Club", time: "3d ago", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    caption: "Just got back from the National Finance Summit 2026 in Mumbai where I presented my research paper on 'Crypto Regulation and Student Investment Behavior in India'. 📊 Being selected as one of 20 student speakers from 500+ applicants was already surreal — but having my paper cited by two industry panelists during the keynote was something I never expected. If you're passionate about finance and research, start writing. Submit your work. You never know where it leads. #Finance #Research #NationalSummit #BITS #Investing",
    images: ["https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop"],
    stats: { likes: 234, comments: 38 },
    eventDetails: { location: "Mumbai", category: "Finance", attendees: "500" }
  }
];

const SuggestedAccountsCard = () => {
  const SUGGESTED = [
    { name: "Vikram Nair", handle: "@vikram_nit", college: "NIT Surathkal", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face", mutualsText: "👥 3 mutual connections · Ananya Roy, Kabir Singh +1 more" },
    { name: "Rhea Kapoor", handle: "@rhea_design", college: "Amity University", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face", mutualsText: "👥 2 mutual connections · Priya Mehta, Rohan Verma" },
    { name: "Aditya Kumar", handle: "@adi_code", college: "IIT Kanpur", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face", mutualsText: "👥 4 mutual connections · Arjun Mehta, Dev Sharma +2 more" },
  ];

  return (
    <div className="bg-[#F5F3FF] rounded-[16px] p-[20px] mb-4 border border-[#E8DFF5]">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-[15px] font-bold text-slate-900 leading-tight">✨ People you might know</h3>
        <p className="text-[12px] text-slate-500 font-medium">Based on your interests and connections</p>
      </div>
      <div className="space-y-4">
        {SUGGESTED.map((person, i) => (
          <div key={i} className="flex items-center gap-3">
            <img src={person.photo} className="w-10 h-10 rounded-full object-cover border border-white shadow-sm flex-shrink-0" alt={person.name} />
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-bold text-slate-900 truncate">{person.name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                <span className="text-[11px] text-slate-500 truncate">{person.handle}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white text-[#7C3AED] text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm border border-[#E8DFF5]">
                  {person.college}
                </span>
              </div>
              <p className="text-[11px] text-slate-500/90 font-medium truncate">{person.mutualsText}</p>
            </div>
            <button className="px-4 py-1.5 rounded-full border border-[#7C3AED] text-[#7C3AED] text-[11px] font-bold uppercase tracking-widest hover:bg-[#7C3AED] hover:text-white transition-colors">
              Follow
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button className="text-[12px] font-bold text-[#7C3AED] hover:underline cursor-pointer">See All Suggestions →</button>
      </div>
    </div>
  );
};

const PostImageGrid = ({ images }) => {
  if (!images || images.length === 0) return null;
  const len = images.length;
  
  if (len === 1) {
    return <img src={images[0]} className="w-full max-h-[500px] rounded-[12px] object-cover border border-slate-100" alt="Post" />;
  }
  if (len === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 h-[260px] max-h-[500px] overflow-hidden rounded-[12px]">
        {images.map((img, i) => (
          <img key={i} src={img} className="w-full h-full object-cover border border-slate-100" alt={`Post ${i+1}`} />
        ))}
      </div>
    );
  }
  if (len === 3) {
    return (
      <div className="grid grid-cols-2 gap-2 h-[340px] max-h-[500px] overflow-hidden rounded-[12px]">
        <img src={images[0]} className="col-span-2 w-full h-full object-cover border border-slate-100" alt="Post 1" />
        <img src={images[1]} className="w-full h-full object-cover border border-slate-100" alt="Post 2" />
        <img src={images[2]} className="w-full h-full object-cover border border-slate-100" alt="Post 3" />
      </div>
    );
  }
  if (len === 4) {
    return (
      <div className="grid grid-cols-2 gap-2 h-[340px] max-h-[500px] overflow-hidden rounded-[12px]">
        {images.map((img, i) => (
          <img key={i} src={img} className="w-full h-full object-cover border border-slate-100" alt={`Post ${i+1}`} />
        ))}
      </div>
    );
  }
  if (len === 5) {
    return (
      <div className="grid grid-cols-3 gap-2 h-[340px] max-h-[500px] overflow-hidden rounded-[12px]">
        <img src={images[0]} className="col-span-2 row-span-2 w-full h-full object-cover border border-slate-100" alt="Post 1" />
        <div className="col-span-1 grid grid-cols-1 grid-rows-2 gap-2 h-full object-cover border border-slate-100">
           <img src={images[1]} className="w-full h-full object-cover border border-slate-100" alt="Post 2" />
           <img src={images[2]} className="w-full h-full object-cover border border-slate-100" alt="Post 3" />
        </div>
      </div>
    );
  }
  return null;
};

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.stats.likes);
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const shareRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) setShowShareMenu(false);
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    const username = encodeURIComponent(post.user.name.toLowerCase().replace(/\s+/g, '-'));
    navigate(`/${username}`);
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    setShowShareMenu(false);
    // Could add toast notification here
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList([...commentsList, { id: Date.now(), text: commentText, user: 'John Doe', time: 'Just now' }]);
    setCommentText('');
  };

  const formatCaption = (text) => {
    return text.split(/(@\w+|#\w+)/g).map((part, i) => {
      if (part.startsWith('@')) return <span key={i} className="text-[#4F46E5] font-bold cursor-pointer hover:underline">{part}</span>;
      if (part.startsWith('#')) return <span key={i} className="text-[#7C3AED] font-bold cursor-pointer hover:underline">{part}</span>;
      return part;
    });
  };

  return (
    <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-[20px] mb-[16px] group transition-all hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-3 cursor-pointer group/profile" onClick={handleProfileClick}>
          <img src={post.user.photo} className="w-[44px] h-[44px] rounded-full object-cover border border-slate-100 bg-slate-50 flex-shrink-0 group-hover/profile:scale-105 transition-transform" alt={post.user.name} />
          <div className="flex-1 min-w-0">
            <h4 className="text-[15px] font-bold text-slate-900 leading-tight group-hover/profile:text-[#7C3AED] transition-colors">{post.user.name}</h4>
            <p className="text-[12px] text-slate-500 font-medium leading-tight mt-0.5 truncate">{post.user.college} · {post.user.club}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{post.user.time}</p>
          </div>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-2"
              >
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">Report Post</button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium">Unfollow {post.user.name.split(' ')[0]}</button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Block User</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Caption */}
      <p className="text-[14px] text-[#1F2937] leading-[1.6] mb-4 whitespace-pre-wrap">
        {formatCaption(post.caption)}
      </p>

      {/* Image Grid */}
      <div className="mb-[12px] overflow-hidden rounded-[12px]">
        <PostImageGrid images={post.images} />
      </div>

      {/* Event Details Strip */}
      {post.eventDetails && (
        <div className="bg-[#F8F7FF] rounded-[10px] py-[10px] px-[14px] my-[12px] flex items-center gap-2 text-[12px] text-slate-500 font-medium">
          <span className="flex items-center gap-1"><MapPin className="w-[14px] h-[14px]" />{post.eventDetails.location}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <span className="w-[14px] h-[14px] roundedbg-white text-[12px] flex items-center justify-center p-[2px]">🗂</span>
            {post.eventDetails.category}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1"><Users className="w-[14px] h-[14px]" />{post.eventDetails.attendees} attended</span>
        </div>
      )}

      {/* Stats Summary */}
      <div className="flex items-center justify-between text-[12px] text-slate-500 font-medium px-2 py-2 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          {likesCount > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#7C3AED] flex items-center justify-center -mr-1 border border-white z-10">
                <Heart className="w-2.5 h-2.5 text-white fill-current" />
              </div>
              <span className="ml-2">{likesCount} likes</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <span>{post.stats.comments + commentsList.length} comments</span>
          {saved && <span>1 save</span>}
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between relative mt-2">
        <button onClick={toggleLike} className={`flex items-center justify-center gap-2 flex-1 py-1.5 transition-colors duration-200 group/btn rounded-lg hover:bg-purple-50 ${liked ? 'text-[#7C3AED]' : 'text-slate-400 hover:text-[#7C3AED]'}`}>
          <Heart className={`w-[18px] h-[18px] ${liked ? 'fill-current' : 'group-hover/btn:fill-current'} duration-200`} />
          <span className="text-[13px] font-bold">Like</span>
        </button>

        <button onClick={() => setShowComments(!showComments)} className={`flex items-center justify-center gap-2 flex-1 py-1.5 transition-colors duration-200 group/btn rounded-lg hover:bg-purple-50 ${showComments ? 'text-[#7C3AED]' : 'text-slate-400 hover:text-[#7C3AED]'}`}>
          <MessageCircle className={`w-[18px] h-[18px] ${showComments ? 'fill-current' : 'group-hover/btn:fill-current'} duration-200`} />
          <span className="text-[13px] font-bold">Comment</span>
        </button>

        <button onClick={() => setSaved(!saved)} className={`flex items-center justify-center gap-2 flex-1 py-1.5 transition-colors duration-200 group/btn rounded-lg hover:bg-purple-50 ${saved ? 'text-[#7C3AED]' : 'text-slate-400 hover:text-[#7C3AED]'}`}>
          <Bookmark className={`w-[18px] h-[18px] ${saved ? 'fill-current' : 'group-hover/btn:fill-current'} duration-200`} />
          <span className="text-[13px] font-bold">Save</span>
        </button>

        <div className="flex-1 relative" ref={shareRef}>
          <button onClick={() => setShowShareMenu(!showShareMenu)} className={`w-full flex items-center justify-center gap-2 py-1.5 transition-colors duration-200 group/btn rounded-lg hover:bg-purple-50 ${showShareMenu ? 'text-[#7C3AED]' : 'text-slate-400 hover:text-[#7C3AED]'}`}>
            <Share2 className={`w-[18px] h-[18px] ${showShareMenu ? 'fill-current' : 'group-hover/btn:fill-current'} duration-200`} />
            <span className="text-[13px] font-bold">Share</span>
          </button>
          
          <AnimatePresence>
            {showShareMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden"
              >
                <div className="p-3">
                   <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 px-1">Share this post</h5>
                   <button onClick={handleShare} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-colors">
                     <Link className="w-4 h-4 text-slate-500" /> Copy Link to Post
                   </button>
                   <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-colors mt-1">
                     <MessageCircle className="w-4 h-4 text-slate-500" /> Send as Message
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapsible Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-4"
          >
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <form onSubmit={handleAddComment} className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  Me
                </div>
                <div className="flex-1 relative">
                   <input 
                     type="text" 
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                     placeholder="Add a comment..."
                     className="w-full text-sm bg-white border border-slate-200 rounded-full px-4 py-2 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                   />
                   <button 
                     type="submit" 
                     disabled={!commentText.trim()}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#7C3AED] disabled:text-slate-300 transition-colors"
                   >
                     Post
                   </button>
                </div>
              </form>

              {/* Mock Comments List */}
              <div className="space-y-4 max-h-[200px] overflow-y-auto no-scrollbar pr-2">
                {commentsList.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">JD</div>
                    <div className="flex-1">
                      <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm inline-block">
                        <p className="text-xs font-bold text-slate-900">John Doe</p>
                        <p className="text-sm text-slate-700">{comment.text}</p>
                      </div>
                      <div className="flex gap-4 mt-1 ml-2 text-[11px] font-medium text-slate-400">
                        <span>{comment.time}</span>
                        <button className="hover:text-slate-600 font-bold">Like</button>
                        <button className="hover:text-slate-600 font-bold">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Fallback Mock Comment if empty */}
                {commentsList.length === 0 && (
                   <div className="flex gap-3">
                     <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="Sarah" />
                     <div className="flex-1">
                       <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm inline-block">
                         <p className="text-xs font-bold text-slate-900">Sarah Jenkins</p>
                         <p className="text-sm text-slate-700">So inspiring! Congrats on the progress 🎉</p>
                       </div>
                       <div className="flex gap-4 mt-1 ml-2 text-[11px] font-medium text-slate-400">
                         <span>2h</span>
                         <button className="hover:text-slate-600 font-bold">Like</button>
                         <button className="hover:text-slate-600 font-bold">Reply</button>
                       </div>
                     </div>
                   </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HighlightViewer = ({ initialUserIndex, activeRect, data, onClose }) => {
  const [userIndex, setUserIndex] = useState(initialUserIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = forward, -1 = backward
  const [userDirection, setUserDirection] = useState(0); // 1, -1 for user changes

  const user = data[userIndex];
  const stories = user.stories || [user.image];
  const currentStory = stories[storyIndex];

  useEffect(() => {
    // Auto advance after 10s
    const timer = setTimeout(() => {
      handleNext();
    }, 10000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIndex, storyIndex]);

  const handleNext = () => {
    if (storyIndex < stories.length - 1) {
      setDirection(1);
      setUserDirection(0);
      setStoryIndex(prev => prev + 1);
    } else {
      if (userIndex < data.length - 1) {
        setUserDirection(1);
        setDirection(0);
        setStoryIndex(0);
        setUserIndex(prev => prev + 1);
      } else {
        onClose();
      }
    }
  };

  const handlePrev = () => {
    if (storyIndex > 0) {
      setDirection(-1);
      setUserDirection(0);
      setStoryIndex(prev => prev - 1);
    } else {
      if (userIndex > 0) {
        setUserDirection(-1);
        setDirection(0);
        const prevUser = data[userIndex - 1];
        setStoryIndex((prevUser.stories?.length || 1) - 1);
        setUserIndex(prev => prev - 1);
      }
    }
  };

  // User change animation
  const userVariants = {
    initial: (dir) => ({
      scale: dir > 0 ? 0.85 : 1,
      opacity: 0,
      transition: { duration: 0.2 }
    }),
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: (dir) => ({
      scale: dir > 0 ? 1 : 0.85,
      opacity: 0,
      transition: { duration: 0.2 }
    })
  };

  // Story change animation
  const storyVariants = {
    initial: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      transition: { duration: 0.25, ease: "easeInOut" }
    }),
    animate: {
      x: '0%',
      transition: { duration: 0.25, ease: "easeInOut" }
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      transition: { duration: 0.25, ease: "easeInOut" }
    })
  };

  const clipStart = activeRect ? `circle(28px at ${activeRect.x + 28}px ${activeRect.y + 28}px)` : 'circle(150% at 50% 50%)';
  const clipEnd = activeRect ? `circle(150% at ${activeRect.x + 28}px ${activeRect.y + 28}px)` : 'circle(150% at 50% 50%)';

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
      style={{ touchAction: 'none' }}
    >
      <motion.div 
        initial={{ clipPath: clipStart }}
        animate={{ clipPath: clipEnd }}
        exit={{ clipPath: clipStart }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-[380px] h-[680px] mx-auto rounded-[20px] overflow-hidden bg-transparent shadow-2xl" 
      >
        <AnimatePresence initial={false} custom={userDirection} mode="wait">
          <motion.div
            key={userIndex}
            custom={userDirection}
            variants={userDirection !== 0 ? userVariants : { animate: { scale: 1, opacity: 1 } }}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={`${userIndex}-${storyIndex}`}
                custom={direction}
                variants={direction !== 0 ? storyVariants : { animate: { x: '0%' } }}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                <img src={currentStory} className="w-full h-full object-cover" alt={`Story by ${user.name}`} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Top Overlay */}
        <div className="absolute top-0 left-0 w-full h-[120px] bg-transparent pointer-events-auto z-10 p-[12px] flex flex-col gap-[12px]">
          {/* Progress Bars */}
          <div className="flex gap-[3px] w-full">
            {stories.map((_, i) => (
              <div key={i} className="h-[3px] rounded-[2px] bg-white/30 flex-1 relative overflow-hidden">
                <div 
                  className={`absolute inset-y-0 left-0 bg-white ${
                    i < storyIndex ? 'w-full' : i > storyIndex ? 'w-0' : 'w-0'
                  }`}
                  style={{
                    animation: i === storyIndex ? 'fillBar 10s linear forwards' : 'none'
                  }}
                  key={`${userIndex}-${storyIndex}-${i}`} // resets animation
                />
              </div>
            ))}
          </div>

          {/* User Info & Close */}
          <div className="flex items-center gap-3 w-full justify-between">
            <div className="flex items-center gap-3">
              <img src={user.image} className="w-[32px] h-[32px] rounded-full border border-white/20 object-cover" alt="Avatar" />
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-white leading-tight drop-shadow-md">{user.name}</h4>
                <p className="text-[11px] text-white/70 font-medium mt-0.5 drop-shadow-md">{user.time}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-white/70 p-2 font-bold text-[24px] cursor-pointer">✕</button>
          </div>
        </div>

        {/* Navigation Zones */}
        <div className="absolute inset-y-0 left-0 w-[35%] z-[5] cursor-pointer" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-[35%] z-[5] cursor-pointer" onClick={handleNext} />
      </motion.div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fillBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}} />
    </motion.div>
  );
};

const FeedPage = () => {
  const [activeHighlightUserIndex, setActiveHighlightUserIndex] = useState(null);
  const [activeRect, setActiveRect] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [seenHighlights, setSeenHighlights] = useState([]);

  const openHighlight = (index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveRect(rect);
    setActiveHighlightUserIndex(index);
    setSeenHighlights(prev => [...new Set([...prev, HIGHLIGHTS_DATA[index].id])]);
  };

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence>
        {activeHighlightUserIndex !== null && (
          <HighlightViewer 
            initialUserIndex={activeHighlightUserIndex}
            activeRect={activeRect}
            data={HIGHLIGHTS_DATA}
            onClose={() => setActiveHighlightUserIndex(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setIsUploadModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{ maxWidth: 420 }}
              className="w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Create a Story</h3>
                <button onClick={() => setIsUploadModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-slate-200 m-4 rounded-xl pb-8 gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                  <Camera className="w-8 h-8 text-[#7C3AED]" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Drag & Drop media</p>
                <p className="text-xs text-slate-500 text-center px-4">Share your latest project, achievement, or moment with your network</p>
                <button className="mt-4 px-6 py-2.5 bg-[#7C3AED] text-white rounded-full text-sm font-bold shadow-md shadow-purple-500/20 hover:scale-105 transition-transform">
                  Browse Files
                </button>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                 <button disabled className="px-6 py-2 bg-slate-200 text-slate-400 rounded-full text-sm font-bold cursor-not-allowed">
                  Post Story
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HIGHLIGHTS STRIP */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
            ✨ HIGHLIGHTS
          </h2>
        </div>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
          {/* Post Moment Circle */}
          <div onClick={() => setIsUploadModalOpen(true)} className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0">
            <div className="w-[56px] h-[56px] rounded-full p-[2px] bg-gradient-to-tr from-[#7C3AED] to-pink-500 hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#7C3AED] to-purple-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-500 truncate w-[56px] text-center">Post</span>
          </div>

          {/* User Highlights */}
          {HIGHLIGHTS_DATA.map((highlight, index) => (
            <div key={highlight.id} onClick={(e) => openHighlight(index, e)} className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0">
              <div className={`w-[56px] h-[56px] rounded-full p-[2px] ${seenHighlights.includes(highlight.id) || highlight.seen ? 'bg-slate-200' : 'bg-gradient-to-tr from-[#7C3AED] to-pink-500'} group-hover:scale-105 transition-transform`}>
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                  <img src={highlight.image} className="w-full h-full rounded-full object-cover" alt={highlight.name} />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-500 truncate w-[56px] text-center">{highlight.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* DISCOVERY FEED */}
      <section>
        <div className="h-px w-full bg-[#E5E7EB] my-[12px]" />
        
        <div className="flex flex-col">
          {FEED_POSTS.map((post, i) => (
            <React.Fragment key={post.id}>
              <PostCard post={post} />
              {i === 4 && <SuggestedAccountsCard />}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: RIGHT PANEL
   ──────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────
   COMPONENTS: EXPLORE PAGE
   ──────────────────────────────────────────────────────── */

const ExplorePage = ({ setCollegePageData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || "All";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  useEffect(() => {
    const cat = queryParams.get('category');
    if (cat) setActiveCategory(cat);
    
    // Scroll to top of the scroll area when category changes
    const scrollArea = document.getElementById('main-scroll-area');
    if (scrollArea) {
      scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.search]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const FEATURED_EVENTS = [
    { id: 1, title: "Smart India Hackathon", org: "Govt. of India", location: "Pan India", date: "Apr 18", fee: "₹500", category: "Hackathons", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop" },
    { id: 2, title: "Mood Indigo 2026", org: "IIT Bombay", location: "Mumbai", date: "Mar 22", fee: "Free", category: "Cultural", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop" },
    { id: 3, title: "Eureka! Startup Summit", org: "E-Cell IITB", location: "Mumbai", date: "Apr 25", fee: "₹200", category: "Competitions", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop" },
    { id: 4, title: "UI/UX Design Bootcamp", org: "BITS Pilani", location: "Pilani", date: "Apr 5", fee: "Free", category: "Workshops", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop" },
    { id: 5, title: "TechKriti '26", org: "IIT Kanpur", location: "Kanpur", date: "Apr 20", fee: "₹1,000", category: "Hackathons", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop" }
  ];

  const CATEGORIES = [
    { label: "All" }, 
    { label: "Hackathons" }, 
    { label: "Cultural" }, 
    { label: "Workshops" }, 
    { label: "Annual Fests" }, 
    { label: "Project Showcase" }, 
    { label: "Competitions" }, 
    { label: "Talks" }, 
    { label: "Networking" }
  ];

  const ALL_EVENTS = [
    { id: 1, title: "Smart India Hackathon", org: "Govt. of India", location: "Pan India", date: "Apr 18", category: "Hackathons", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop" },
    { id: 2, title: "Mood Indigo 2026", org: "IIT Bombay", location: "Mumbai", date: "Mar 22", category: "Cultural", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop" },
    { id: 3, title: "UI/UX Bootcamp", org: "BITS Pilani", location: "Pilani", date: "Apr 5", category: "Workshops", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop" },
    { id: 4, title: "TechKriti '26", org: "IIT Kanpur", location: "Kanpur", date: "Apr 20", category: "Hackathons", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop" },
    { id: 5, title: "Eureka! Startup Summit", org: "E-Cell IITB", location: "Mumbai", date: "Apr 25", category: "Competitions", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop" },
    { id: 6, title: "Robocon 2026", org: "NSUT", location: "Delhi", date: "May 2", category: "Competitions", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop" },
    { id: 7, title: "Spring Fest 2026", org: "Bennett University", location: "Greater Noida", date: "Apr 25", category: "Cultural", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop" },
    { id: 8, title: "Design Hackathon", org: "NID Ahmedabad", location: "Ahmedabad", date: "Apr 12", category: "Hackathons", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop" },
    { id: 9, title: "Code Relay 3.0", org: "DTU", location: "Delhi", date: "Apr 28", category: "Hackathons", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop" },
    { id: 10, title: "Rendezvous 2026", org: "IIT Delhi", location: "Delhi", date: "Nov 10", category: "Cultural", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop" },
    { id: 11, title: "Shaastra 2026", org: "IIT Madras", location: "Chennai", date: "Jan 15", category: "Annual Fests", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop" },
    { id: 12, title: "Kshitij 2026", org: "IIT Kharagpur", location: "Kolkata", date: "Feb 8", category: "Annual Fests", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop" },
    { id: 13, title: "Antaragni 2026", org: "IIT Kanpur", location: "Kanpur", date: "Oct 20", category: "Cultural", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop" },
    { id: 14, title: "Technovanza", org: "VJTI Mumbai", location: "Mumbai", date: "Dec 5", category: "Annual Fests", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop" },
    { id: 15, title: "E-Summit 2026", org: "IIT Bombay", location: "Mumbai", date: "Mar 10", category: "Networking", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop" }
  ];

  const COLLEGES = [
    { name: "IIT Bombay", events: 6, image: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&auto=format&fit=crop" },
    { name: "BITS Pilani", events: 4, image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&auto=format&fit=crop" },
    { name: "DTU", events: 3, image: "https://images.unsplash.com/photo-1592303637753-ce1e6b8b5e13?w=400&auto=format&fit=crop" },
    { name: "IIT Delhi", events: 5, image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&auto=format&fit=crop" },
    { name: "Bennett University", events: 2, image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&auto=format&fit=crop" },
    { name: "VIT Vellore", events: 7, image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&auto=format&fit=crop" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_EVENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredEvents = ALL_EVENTS.filter(event => activeCategory === "All" || event.category === activeCategory);
  // Show 6 by default or 12 if expanded
  const maxEvents = filteredEvents.slice(0, 12);
  const displayedEvents = isExpanded ? maxEvents : filteredEvents.slice(0, 6);

  return (
    <div className="space-y-0 pb-20">
      {/* 🎠 SECTION 1 — Featured Events Carousel */}
      <div className="w-full h-[280px] rounded-[20px] overflow-hidden relative" style={{ marginBottom: '24px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img 
              src={FEATURED_EVENTS[currentSlide].image} 
              alt={FEATURED_EVENTS[currentSlide].title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 40%, transparent 100%)' }}>
              <div className="absolute top-[20px] left-[20px] bg-[#7C3AED] text-white text-[12px] px-4 py-1.5 rounded-full font-bold">
                {FEATURED_EVENTS[currentSlide].category}
              </div>
              <div className="absolute left-[20px] bottom-[20px] flex flex-col">
                <h2 className="text-white font-[800] text-[24px]">{FEATURED_EVENTS[currentSlide].title}</h2>
                <p className="text-white/70 text-[13px] mt-1">{FEATURED_EVENTS[currentSlide].org} · {FEATURED_EVENTS[currentSlide].location}</p>
                <p className="text-white text-[12px] mt-2 font-bold tracking-wide">
                  📅 {FEATURED_EVENTS[currentSlide].date} · �️ {FEATURED_EVENTS[currentSlide].fee}
                </p>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/event/${FEATURED_EVENTS[currentSlide].id}`);
                    }}
                    className="bg-white text-[#0F0F1A] font-bold text-[13px] px-5 py-2.5 rounded-full transition-transform hover:scale-105 cursor-pointer relative z-20"
                  >
                    Register Now →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Dot Indicators */}
        <div className="absolute right-[20px] bottom-[20px] flex items-center gap-2 z-10">
          {FEATURED_EVENTS.map((_, i) => (
            <div 
              key={i} 
              className={`h-[6px] rounded-full bg-white transition-all duration-300 ${currentSlide === i ? 'w-[20px] opacity-100' : 'w-[6px] opacity-50'}`} 
            />
          ))}
        </div>
      </div>

      {/* 🔍 SECTION 2 — Search Bar */}
      <div 
        className="w-full rounded-full bg-white border border-[#E5E7EB] flex items-center focus-within:border-[#7C3AED] focus-within:shadow-[0_0_10px_rgba(124,58,237,0.15)] transition-all relative"
        style={{ padding: '0 16px 0 44px', marginTop: '8px', marginBottom: '20px', height: '48px' }}
      >
        <Search className="w-5 h-5 text-slate-400 absolute" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search events, colleges, clubs..." 
          className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#0F0F1A] placeholder-slate-400 w-full"
          style={{ height: '48px', lineHeight: '48px' }}
        />
      </div>

      {/* 🏷 SECTION 3 — Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-4" style={{ marginTop: '20px' }}>
        {CATEGORIES.map(cat => (
          <button 
            key={cat.label}
            onClick={() => { setActiveCategory(cat.label); setIsExpanded(false); }}
            className={`px-[16px] py-[7px] rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200
              ${activeCategory === cat.label 
                ? 'bg-[#7C3AED] text-white border border-[#7C3AED]' 
                : 'bg-white text-slate-500 border border-[#E5E7EB] hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 📋 SECTION 4 — Event Cards Grid */}
      {activeCategory === "All" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <h2 className="text-[20px] font-bold text-slate-900 mb-[16px]">Trending Now</h2>
        </motion.div>
      )}
      <motion.div layout className="grid grid-cols-2 gap-[16px]">
        <AnimatePresence mode="popLayout">
          {displayedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              onClick={() => navigate(`/event/${event.id}`)}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-[240px] bg-white rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(124,58,237,0.1)] hover:-translate-y-1 transition-all overflow-hidden group cursor-pointer border border-slate-100"
            >
              <div className="relative w-full h-[150px] overflow-hidden rounded-t-[16px]">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-2 left-2 bg-white text-[#0F0F1A] px-[8px] py-[4px] rounded-full text-[11px] font-bold shadow-sm flex items-center">
                  {event.category}
                </div>
              </div>
              <div className="p-[12px] px-[14px] h-[90px] flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[14px] text-[#0F0F1A] truncate">{event.title}</h3>
                  <p className="text-[12px] text-slate-500 truncate mt-0.5">{event.org} · {event.location}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100/80 rounded-md px-2 py-0.5">{event.date}</span>
                  <span className="text-[11px] font-bold text-[#7C3AED]">Visit →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ⬇️ SECTION 5 — Show More */}
      {filteredEvents.length > 6 && (
        <div className="flex justify-center" style={{ marginTop: '32px', marginBottom: '32px' }}>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 border border-[#7C3AED] text-[#7C3AED] rounded-full px-[28px] py-[10px] text-[13px] font-bold hover:bg-[#7C3AED] hover:text-white transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
            <motion.div
               animate={{ rotate: isExpanded ? 180 : 0 }}
               transition={{ duration: 0.3 }}
            >
               <ArrowDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      )}

      {/* 🎓 SECTION 6 — Colleges Near You */}
      <div className="pb-[24px]" style={{ marginTop: '32px' }}>
        <h2 className="text-[14px] font-black text-[#0F0F1A] uppercase tracking-[0.2em]" style={{ marginBottom: '16px' }}>
          Colleges Near You
        </h2>
        <div className="flex items-center gap-[12px] overflow-x-auto no-scrollbar py-2">
          {COLLEGES.map((college, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              onClick={() => setCollegePageData({ name: college.name, cover: college.image, avatar: college.image, type: 'Institution', followers: '10K', following: '0', joined: '2024' })}
              className="w-[140px] h-[160px] flex-shrink-0 bg-white rounded-[16px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(124,58,237,0.1)] transition-shadow cursor-pointer border border-slate-100 flex flex-col"
            >
              <div className="h-[80px] w-full overflow-hidden">
                <img 
                  src={college.image} 
                  alt={college.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-[8px] px-[10px] flex flex-col justify-center flex-1">
                <h3 className="font-bold text-[12px] text-[#0F0F1A] truncate">{college.name}</h3>
                <p className="text-[11px] text-[#7C3AED]/80 font-bold mt-1">{college.events} upcoming events</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: REELS PAGE
   ──────────────────────────────────────────────────────── */

const ReelsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const [overlayReelIndex, setOverlayReelIndex] = useState(null);

  const CATEGORIES = ["All", "Hackathons", "Cultural", "Workshops", "Annual Fests", "Competitions", "Talks"];

  const REELS_DATA = [
    { id: 1, title: "Smart India Hackathon Highlights", org: "IIT Bombay", duration: "0:42", category: "Hackathons", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop", posterName: "Tech Club", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
    { id: 2, title: "Mood Indigo Opening Ceremony", org: "IIT Bombay", duration: "1:15", category: "Cultural", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop", posterName: "Cultural Society", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { id: 3, title: "UI/UX Bootcamp Day 1", org: "BITS Pilani", duration: "0:58", category: "Workshops", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop", posterName: "DesignSoc", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
    { id: 4, title: "TechKriti '26 Finals", org: "IIT Kanpur", duration: "1:30", category: "Competitions", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&auto=format&fit=crop", posterName: "RoboClub", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    { id: 5, title: "Eureka! Startup Summit", org: "IIT Bombay", duration: "0:55", category: "Competitions", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop", posterName: "E-Cell IITB", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { id: 6, title: "Robocon 2026 Qualifiers", org: "NSUT", duration: "2:10", category: "Competitions", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop", posterName: "RoboClub", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    { id: 7, title: "Spring Fest Dance Finals", org: "Bennett University", duration: "1:05", category: "Cultural", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop", posterName: "Fest Committee", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" },
    { id: 8, title: "Design Hackathon Pitches", org: "NID Ahmedabad", duration: "0:48", category: "Hackathons", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop", posterName: "Design Club", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face" },
    { id: 9, title: "Code Relay Winners", org: "DTU", duration: "0:37", category: "Hackathons", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&auto=format&fit=crop", posterName: "Coding Club", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face" },
    { id: 10, title: "Rendezvous Night Concert", org: "IIT Delhi", duration: "3:20", category: "Cultural", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop", posterName: "Rendezvous", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
    { id: 11, title: "Shaastra 2026 Robotics", org: "IIT Madras", duration: "1:45", category: "Competitions", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop", posterName: "Shaastra", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { id: 12, title: "E-Summit Keynote Highlights", org: "IIT Bombay", duration: "2:30", category: "Talks", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop", posterName: "E-Cell IITB", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    { id: 13, title: "Kshitij 2026 Aftermovie", org: "IIT Kharagpur", duration: "1:55", category: "Annual Fests", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop", posterName: "Kshitij", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
    { id: 14, title: "Technovanza Drone Wars", org: "VJTI Mumbai", duration: "0:59", category: "Annual Fests", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&auto=format&fit=crop", posterName: "Technovanza", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" }
  ];

  const filteredReels = REELS_DATA.filter(reel => activeCategory === "All" || reel.category === activeCategory);
  const displayedReels = filteredReels.slice(0, visibleCount);

  useEffect(() => {
    if (overlayReelIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && overlayReelIndex > 0) setOverlayReelIndex(prev => prev - 1);
      if (e.key === 'ArrowRight' && overlayReelIndex < filteredReels.length - 1) setOverlayReelIndex(prev => prev + 1);
      if (e.key === 'Escape') setOverlayReelIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [overlayReelIndex, filteredReels.length]);

  return (
    <div className="w-full">
      {/* 🎬 PAGE HEADER */}
      <div className="mb-[24px]">
        <h1 className="text-[24px] font-bold text-[#0F0F1A]">Discover</h1>
        <p className="text-[14px] text-slate-500 mt-1">Event reels from across India</p>
      </div>

      {/* 🗂 CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-[20px]">
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => { setActiveCategory(cat); setVisibleCount(12); setOverlayReelIndex(null); }}
            className={`px-[16px] py-[7px] rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200
              ${activeCategory === cat
                ? 'bg-[#7C3AED] text-white border border-[#7C3AED]' 
                : 'bg-white text-slate-500 border border-[#E5E7EB] hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🎴 REELS GRID */}
      <div className="grid grid-cols-3 gap-[8px]">
        <AnimatePresence>
          {displayedReels.map((reel, index) => (
            <motion.div 
              key={reel.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: (index % 3) * 0.05 }}
              onClick={() => setOverlayReelIndex(index)}
              className="flex flex-col bg-white w-full rounded-[12px] border border-[#E5E7EB] overflow-hidden cursor-pointer group shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Always Visible Header Strip */}
              <div className="bg-white flex items-center gap-[8px] px-[10px] py-[8px]">
                <img src={reel.avatar} alt={reel.posterName} className="w-[28px] h-[28px] rounded-full object-cover shrink-0" />
                <div className="flex flex-col justify-center">
                  <span className="text-[#0F0F1A] font-bold text-[12px] leading-tight">{reel.posterName}</span>
                  <span className="text-[#6B7280] font-medium text-[10px] leading-tight mt-0.5">{reel.org}</span>
                </div>
              </div>

              {/* Thumbnail Container */}
              <div className="relative w-full aspect-[9/16] overflow-hidden">
                <img 
                  src={reel.image} 
                  alt={reel.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {/* Always visible duration + play indicator top-right */}
                <div className="absolute top-[8px] right-[8px] flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full">
                  <Play className="w-[10px] h-[10px] text-white fill-white" />
                  <span className="text-[11px] font-bold text-white leading-none">{reel.duration}</span>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex flex-col justify-between p-[12px]">
                  <div />
                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-[48px] h-[48px] rounded-full border-2 border-white/80 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-[20px] h-[20px] text-white fill-white ml-1" />
                    </div>
                  </div>
                  {/* Bottom info overlay */}
                  <div className="translate-y-[20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 relative z-10 bottom-0 pb-1">
                    <h3 className="text-white font-bold text-[13px] leading-tight line-clamp-2 drop-shadow-md">{reel.title}</h3>
                    <p className="text-white/80 text-[11px] font-bold mt-1 drop-shadow-sm">{reel.org}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredReels.length > visibleCount && (
        <div className="flex justify-center mt-[32px] mb-[32px]">
          <button 
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="flex items-center gap-2 border border-[#7C3AED] text-[#7C3AED] rounded-full px-[28px] py-[10px] text-[13px] font-bold hover:bg-[#7C3AED] hover:text-white transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* ▶️ REEL VIEWER FULL SCREEN OVERLAY */}
      <AnimatePresence>
        {overlayReelIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOverlayReelIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          >
            {/* Split Screen Modal */}
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.8, opacity: 0 }}
               transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
               onClick={(e) => e.stopPropagation()}
               className="w-full max-w-[900px] h-[88vh] bg-white rounded-[16px] overflow-hidden flex shadow-2xl relative"
            >
               {/* Left Panel (Media & Caption) - 55% */}
               <div className="w-[55%] h-full bg-black relative flex-shrink-0">
                  <motion.img 
                    key={filteredReels[overlayReelIndex].id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    src={filteredReels[overlayReelIndex].image} 
                    alt={filteredReels[overlayReelIndex].title} 
                    className="w-full h-full object-cover" 
                  />

                  {/* Bottom Image Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-[20px] pt-[40px] z-10 flex flex-col justify-end" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
                    <div className="mb-3">
                      <p className="text-white text-[13px] leading-[1.5] line-clamp-3">
                        {filteredReels[overlayReelIndex].title} and more amazing moments from the recent event! Don't miss out on what we have planned next.
                      </p>
                      <span className="text-[#A78BFA] text-[13px] font-medium block mt-1">
                        #{filteredReels[overlayReelIndex].category.toLowerCase()} #college #events
                      </span>
                    </div>

                    <div className="flex flex-row items-center gap-[10px]">
                      <img 
                        src={filteredReels[overlayReelIndex].avatar} 
                        alt="Creator" 
                        className="w-[32px] h-[32px] rounded-full border border-white/20 object-cover"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold text-[14px] leading-none">{filteredReels[overlayReelIndex].posterName}</span>
                        <span className="text-white/60 font-medium text-[12px] leading-none mt-[1px]">· {filteredReels[overlayReelIndex].org}</span>
                      </div>
                    </div>
                  </div>
               </div>

               {/* Right Panel (Details & Comments) - 45% */}
               <div className="w-[45%] h-full bg-white flex flex-col relative">
                  
                  {/* Top Nav (Close + Arrows) */}
                  <div className="sticky top-0 bg-white z-20 flex items-center justify-end px-4 py-3 gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(overlayReelIndex > 0) setOverlayReelIndex(prev => prev - 1); }}
                      disabled={overlayReelIndex === 0}
                      className="w-[32px] h-[32px] rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(overlayReelIndex < filteredReels.length - 1) setOverlayReelIndex(prev => prev + 1); }}
                      disabled={overlayReelIndex === filteredReels.length - 1}
                      className="w-[32px] h-[32px] rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="w-px h-[20px] bg-slate-200 mx-1" />
                    <button 
                      onClick={() => setOverlayReelIndex(null)}
                      className="w-[32px] h-[32px] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Scrollable Content Container */}
                  <div className="flex-1 overflow-y-auto no-scrollbar px-[20px] pb-[20px]">
                    
                    {/* Section A: Event Details */}
                    <div>
                      <h2 className="font-bold text-[18px] text-[#0F0F1A] mt-[4px] leading-tight">
                        {filteredReels[overlayReelIndex].title}
                      </h2>
                      
                      <div className="flex items-center justify-between mt-[16px]">
                        <div className="flex items-center gap-[10px]">
                          <img 
                            src={filteredReels[overlayReelIndex].avatar} 
                            alt={filteredReels[overlayReelIndex].posterName} 
                            className="w-[36px] h-[36px] rounded-full border border-slate-100 object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-[#0F0F1A] font-bold text-[13px] leading-tight">{filteredReels[overlayReelIndex].posterName}</span>
                            <span className="text-slate-500 font-medium text-[11px] leading-tight">{filteredReels[overlayReelIndex].org}</span>
                          </div>
                        </div>
                        <button className="px-3 py-1 rounded-full border border-[#7C3AED] text-[#7C3AED] text-[12px] font-bold hover:bg-slate-50 transition-colors">
                          Follow
                        </button>
                      </div>

                      <div className="h-px w-full bg-slate-100 my-[16px]" />

                      {/* 2x2 Details Grid */}
                      <div className="grid grid-cols-2 gap-y-[12px] gap-x-[16px]">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-[16px] h-[16px] text-slate-400 shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</span>
                            <span className="text-[13px] text-slate-700 font-medium">Apr 18, 2026</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-[16px] h-[16px] text-slate-400 shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Venue</span>
                            <span className="text-[13px] text-slate-700 font-medium">{filteredReels[overlayReelIndex].org}, Mumbai</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <LayoutGrid className="w-[16px] h-[16px] text-slate-400 shrink-0 mt-0.5" />
                          <div className="flex flex-col items-start">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</span>
                            <span className="text-[10px] bg-[#F3E8FF] text-[#7C3AED] font-bold px-2 py-0.5 rounded mt-0.5">{filteredReels[overlayReelIndex].category}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Users className="w-[16px] h-[16px] text-slate-400 shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registered</span>
                            <span className="text-[13px] text-slate-700 font-medium">1,200 registered</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-px w-full bg-slate-100 my-[16px]" />

                      <button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white font-bold rounded-[10px] py-[12px] text-[14px] shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                        Visit Event Page →
                      </button>
                    </div>

                    {/* Section B: Actions Row */}
                    <div className="flex items-center justify-between px-4 mt-[24px] text-slate-500">
                      <button className="flex items-center gap-1.5 hover:text-[#7C3AED] transition-colors group">
                        <Heart className="w-6 h-6 group-hover:fill-[#7C3AED] group-hover:text-[#7C3AED]" />
                        <span className="text-[13px] font-bold">2.4k</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-[#7C3AED] transition-colors group">
                        <MessageCircle className="w-[22px] h-[22px] group-hover:fill-[#7C3AED] group-hover:text-[#7C3AED]" />
                        <span className="text-[13px] font-bold">48</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-[#7C3AED] transition-colors">
                        <Bookmark className="w-[22px] h-[22px]" />
                        <span className="text-[13px] font-bold">Save</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-[#7C3AED] transition-colors">
                        <Share2 className="w-[22px] h-[22px]" />
                      </button>
                    </div>

                    <div className="h-px w-full bg-slate-100 my-[20px]" />

                    {/* Section C: Comments */}
                    <div>
                      <h3 className="font-bold text-[14px] text-[#0F0F1A] mb-[16px]">Comments (48)</h3>
                      
                      {/* Input Row */}
                      <div className="flex items-center gap-[12px] mb-[24px]">
                        <img 
                          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" 
                          alt="You" 
                          className="w-[32px] h-[32px] rounded-full object-cover border border-slate-200"
                        />
                        <input 
                          type="text" 
                          placeholder="Add a comment..." 
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-[14px] py-[8px] text-[13px] outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                        />
                        <button className="text-[#7C3AED] font-bold text-[13px] hover:text-[#6D28D9]">Post</button>
                      </div>

                      {/* Mock Comments List */}
                      <div className="space-y-[16px]">
                        {[
                          { name: "Ananya Roy", text: "This looks absolutely amazing, definitely registering!", time: "2h", likes: 12, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
                          { name: "Kabir Singh", text: "IIT Bombay always goes all out 🔥", time: "3h", likes: 8, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
                          { name: "Rohan Verma", text: "Went last year, best experience of my college life", time: "5h", likes: 24, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
                          { name: "Priya Mehta", text: "Is there an online participation option?", time: "6h", likes: 3, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
                          { name: "Dev Sharma", text: "Our team is already registered, see you there!", time: "8h", likes: 17, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
                          { name: "Meera Nair", text: "The prize pool this year is insane 👀", time: "1d", likes: 31, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
                        ].map((comment, i) => (
                          <div key={i} className="flex gap-[12px]">
                            <img src={comment.img} alt={comment.name} className="w-[32px] h-[32px] rounded-full object-cover shrink-0 border border-slate-100" />
                            <div className="flex-1">
                              <div className="flex items-baseline gap-[8px]">
                                <span className="font-bold text-[13px] text-[#0F0F1A]">{comment.name}</span>
                                <span className="text-[11px] text-slate-400 font-medium">{comment.time}</span>
                              </div>
                              <p className="text-[13px] text-slate-700 leading-snug mt-[2px]">{comment.text}</p>
                            </div>
                            <div className="flex flex-col items-center gap-[2px] pt-[2px] pl-2 shrink-0">
                              <Heart className="w-[12px] h-[12px] text-slate-400 hover:text-[#EF4444] hover:fill-[#EF4444] cursor-pointer transition-colors" />
                              <span className="text-[10px] text-slate-400 font-bold">{comment.likes}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: CATEGORIES PAGE
   ──────────────────────────────────────────────────────── */

const CategoriesPage = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const QUICK_CHIPS = [
    { label: "Closing Soon", active: true },
    { label: "Free Entry", active: false },
    { label: "Workshops", active: false },
    { label: "Hackathons", active: false },
  ];

  const CATEGORY_CARDS = [
    { id: 1, name: "Tech & Innovation", events: 12, height: "220px", width: "calc(60% - 6px)", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop" },
    { id: 2, name: "Cultural", events: 8, height: "220px", width: "calc(40% - 6px)", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop" },
    { id: 3, name: "Sports", events: 6, height: "180px", width: "calc(33.333% - 8px)", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop" },
    { id: 4, name: "Arts & Design", events: 9, height: "180px", width: "calc(33.333% - 8px)", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop" },
    { id: 5, name: "Entrepreneurship", events: 7, height: "180px", width: "calc(33.333% - 8px)", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop" },
    { id: 6, name: "Networking", events: 5, height: "160px", width: "calc(50% - 6px)", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop" },
    { id: 7, name: "Wellness", events: 3, height: "160px", width: "calc(50% - 6px)", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop" },
    { id: 8, name: "Science", events: 4, height: "180px", width: "calc(33.333% - 8px)", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop" },
    { id: 9, name: "Conferences", events: 11, height: "180px", width: "calc(33.333% - 8px)", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop" },
    { id: 10, name: "Gaming", events: 8, height: "180px", width: "calc(33.333% - 8px)", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop" }
  ];

  return (
    <div className="w-full pb-[40px]">
      
      {/* 🔍 SECTION 1 — Search Bar */}
      <div className="relative w-full h-[44px] mb-[28px] group">
        <div className="absolute inset-y-0 left-0 pl-[16px] flex items-center pointer-events-none">
          <Search className="w-[18px] h-[18px] text-slate-400 group-focus-within:text-[#7C3AED] transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Find your next obsession..."
          className="w-full h-full pl-[44px] pr-[16px] rounded-full border border-[#E5E7EB] bg-white text-[14px] text-[#0F0F1A] placeholder:text-slate-400 outline-none focus:border-[#7C3AED] focus:ring-[3px] focus:ring-[#7C3AED]/10 transition-all shadow-sm"
        />
      </div>

      {/* 🗂 SECTION 3 — Browse by Interest (Masonry Grid) */}
      <div>
        <div className="flex items-center justify-between mb-[16px]">
          <h2 className="font-bold text-[18px] text-[#0F0F1A]">Browse by Interest</h2>
        </div>

        <div className="flex flex-wrap gap-[12px]">
          {CATEGORY_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
              onClick={() => {
                navigate(`/feed?tab=explore&category=${encodeURIComponent(card.name)}`);
                setActiveTab('explore');
              }}
              className="relative rounded-[16px] overflow-hidden cursor-pointer group shadow-sm bg-slate-100"
              style={{ width: card.width, height: card.height }}
            >
              {/* Inner scalable image wrapper */}
              <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[16px]">
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover transition-transform duration-400 ease-out group-hover:scale-[1.06]"
                    style={{ transitionDuration: '0.4s' }}
                  />
              </div>
              
              {/* Dark Gradient Overlay */}
              <div 
                className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-100 opacity-90"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }}
              />
              
              {/* Content Label */}
              <div className="absolute bottom-[20px] left-[20px] flex flex-col transform transition-transform duration-300 ease-out group-hover:-translate-y-[4px]">
                <h3 className="text-white font-bold text-[16px] leading-tight drop-shadow-md">{card.name}</h3>
                <span className="text-white/80 font-medium text-[12px] mt-[4px] drop-shadow-sm">{card.events} Active Events</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: MY EVENTS PAGE
   ──────────────────────────────────────────────────────── */

const MyEventsPage = () => {
  const [activeTab, setActiveTab] = useState('Registered');
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [selectedEventPass, setSelectedEventPass] = useState(null);
  const navigate = useNavigate();

  const tabs = ['Registered', 'Saved', 'Past'];

  const getCategoryColor = (category) => {
    const colors = {
      "Hackathon": { bg: "#7C3AED", text: "white" },
      "Cultural": { bg: "#EC4899", text: "white" },
      "Workshop": { bg: "#0D9488", text: "white" },
      "Entrepreneurship": { bg: "#F97316", text: "white" },
      "Competition": { bg: "#3B82F6", text: "white" }
    };
    return colors[category] || colors["Competition"];
  };

  const handleViewPass = (event) => {
    setSelectedEventPass(event);
    setPassModalOpen(true);
  };

  const APPROVED_EVENTS = [
    { 
      id: "a1",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&auto=format&fit=crop",
      title: "Global AI Hackathon 2026",
      organizer: "Tech Club",
      college: "IIT Bombay",
      daysLeft: 3,
      category: "Hackathon",
      date: "Apr 18",
      passId: "NAAMI-2026-001"
    },
    { 
      id: "a2",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&auto=format&fit=crop",
      title: "Bennett Hackathon 3.0",
      organizer: "Tech Club",
      college: "Bennett University",
      daysLeft: 5,
      category: "Hackathon",
      date: "Apr 20",
      passId: "NAAMI-2026-002"
    }
  ];

  const PENDING_EVENTS = [
    { 
      id: "p1",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&auto=format&fit=crop",
      title: "Mood Indigo 2026",
      organizer: "Cultural Society",
      college: "IIT Bombay",
      category: "Cultural",
      date: "Apr 25"
    },
    { 
      id: "p2",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&auto=format&fit=crop",
      title: "Eureka! Startup Summit",
      organizer: "E-Cell IITB",
      college: "IIT Bombay",
      category: "Competition",
      date: "May 12"
    }
  ];

  const SAVED_EVENTS = [
    { id: 's1', title: "TechKriti '26", college: "IIT Kanpur", date: "Apr 20", category: "Hackathon", fee: "₹75,000", club: "Science Club", isUrgent: false },
    { id: 's2', title: "UI/UX Bootcamp", college: "BITS Pilani", date: "Apr 5", category: "Workshop", fee: "Free", club: "DesignSoc", isUrgent: true },
    { id: 's3', title: "Smart India Hackathon", college: "Govt. of India", date: "Apr 18", category: "Hackathon", fee: "₹1,00,000", club: "Tech", isUrgent: false },
    { id: 's4', title: "Spring Fest 2026", college: "Bennett University", date: "Apr 25", category: "Cultural", fee: "Free", club: "Culture", isUrgent: false }
  ];

  const PAST_EVENTS = [
    { id: 'pa1', title: "Mood Indigo 2025", college: "IIT Bombay", date: "Dec 2025", category: "Cultural", club: "Cultural Society", points: 150 },
    { id: 'pa2', title: "HackIITB 2025", college: "IIT Bombay", date: "Nov 2025", category: "Hackathon", club: "Tech Club", points: 150 },
    { id: 'pa3', title: "UI/UX Summit 2025", college: "BITS Pilani", date: "Sep 2025", category: "Workshop", club: "DesignSoc", points: 150 },
    { id: 'pa4', title: "E-Summit 2025", college: "IIT Bombay", date: "Aug 2025", category: "Entrepreneurship", club: "E-Cell", points: 150 }
  ];

  return (
    <div className="w-full pb-[40px]">
      <div className="space-y-8">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
             <LayoutGrid className="w-4 h-4 text-[#7C3AED]" /> My Portfolio
          </h2>
          <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${activeTab === tab ? 'bg-gray-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'Registered' && (
              <div className="space-y-4">
                {/* Approved Events */}
                {APPROVED_EVENTS.map(event => {
                  const categoryColor = getCategoryColor(event.category);
                  const isUrgent = event.daysLeft <= 3;
                  return (
                    <div key={event.id} className="bg-white rounded-[16px] border border-slate-100 p-5 flex items-center gap-6 hover:shadow-md hover:border-slate-200 transition-all">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
                        <img src={event.image} className="w-full h-full object-cover" alt={event.title} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-[10px] py-[3px] rounded-full text-white font-bold text-[11px]" style={{ backgroundColor: categoryColor.bg }}>{event.category}</span>
                          <span className="px-2 py-0.5 rounded-md bg-[#E8DFF5] text-[#7C3AED] text-[9px] font-black uppercase tracking-widest">Confirmed</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Starts in {event.daysLeft}d</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{event.title}</h3>
                        {isUrgent && <p className="text-[12px] font-bold text-[#F97316] mt-1">⚡ Starting soon</p>}
                        <p className="text-[13px] text-slate-500 font-bold mt-1">{event.organizer} · {event.college} · {event.date}</p>
                      </div>
                      <button onClick={() => handleViewPass(event)} className="px-8 py-4 rounded-xl flex items-center shadow-lg shadow-gray-100 bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all font-black text-[11px] uppercase tracking-widest">
                        View Pass
                      </button>
                    </div>
                  );
                })}

                <div className="my-[16px] border-t border-[#E5E7EB]" />
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-[0.08em] mb-4">⏳ Awaiting Approval</p>

                {/* Pending Events */}
                {PENDING_EVENTS.map(event => {
                  const categoryColor = getCategoryColor(event.category);
                  return (
                    <div key={event.id} className="bg-white rounded-[16px] border border-slate-100 border-l-[4px] border-l-[#F59E0B] p-5 flex items-center gap-6 hover:shadow-md hover:border-slate-200 transition-all">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm opacity-80">
                        <img src={event.image} className="w-full h-full object-cover grayscale-[20%]" alt={event.title} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-[10px] py-[3px] rounded-full text-white font-bold text-[11px]" style={{ backgroundColor: categoryColor.bg }}>{event.category}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[9px] font-black uppercase tracking-widest">⏳ Pending</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight text-slate-700">{event.title}</h3>
                        <p className="text-[13px] text-slate-500 font-bold mt-1">{event.organizer} · {event.college} · {event.date}</p>
                      </div>
                      <p className="text-[13px] text-[#9CA3AF] italic text-right cursor-default">Awaiting confirmation</p>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'Saved' && (
              <div className="space-y-4">
                <p className="text-[13px] text-slate-400 mb-4">{SAVED_EVENTS.length} saved events</p>
                {SAVED_EVENTS.map(event => {
                  const categoryColor = getCategoryColor(event.category);
                  return (
                    <div key={event.id} className="bg-white rounded-[16px] border border-slate-100 p-4 flex items-center justify-between hover:-translate-y-[2px] hover:shadow-md hover:border-slate-200 transition-all cursor-default">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: categoryColor.bg }} />
                          <h3 className="text-[15px] font-bold text-slate-900 leading-tight">{event.title}</h3>
                        </div>
                        <p className="text-[12px] text-slate-500 pl-4">{event.college} · {event.club}</p>
                        {event.isUrgent && <p className="text-[12px] text-[#EF4444] font-bold pl-4 mt-1">🔴 Registration closes in &lt; 7 days</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[12px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">📅 {event.date}</span>
                          <span className="px-[10px] py-[3px] rounded-full text-white font-bold text-[10px]" style={{ backgroundColor: categoryColor.bg }}>{event.category}</span>
                          <div className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center cursor-pointer">
                            <Bookmark className="w-4 h-4 text-[#7C3AED] fill-current" />
                          </div>
                        </div>
                        <button onClick={() => navigate('/event/' + event.id)} className="text-[12px] font-bold text-[#7C3AED] hover:underline cursor-pointer">
                          Visit Page →
                        </button>
                      </div>
                    </div>
                  );
                })}
                {SAVED_EVENTS.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Bookmark className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold">You haven't saved any events yet</p>
                    <button onClick={() => navigate('/feed?tab=explore')} className="mt-4 px-6 py-2 bg-[#7C3AED] text-white rounded-full text-[12px] font-bold hover:bg-[#6D28D9] transition-colors">
                      Browse Events →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Past' && (
              <div className="space-y-4">
                <p className="text-[13px] text-slate-400 mb-4">{PAST_EVENTS.length} past events</p>
                {PAST_EVENTS.map(event => {
                  const categoryColor = getCategoryColor(event.category);
                  return (
                    <div key={event.id} className="bg-[#FAFAFA] rounded-[16px] border border-slate-100 border-l-[4px] border-l-[#10B981] p-5 flex items-center gap-6 hover:shadow-sm hover:border-slate-200 transition-all">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm opacity-90">
                        {/* Placeholder image for past events based on category color */}
                        <div className="w-full h-full flex items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: categoryColor.bg }}>
                          {event.category[0]}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-[10px] py-[3px] rounded-full text-white font-bold text-[11px]" style={{ backgroundColor: categoryColor.bg }}>{event.category}</span>
                          <span className="px-[10px] py-[3px] rounded-full bg-[#10B981] text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                            ✓ Attended
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{event.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight text-slate-700">{event.title}</h3>
                        <p className="text-[13px] text-slate-500 font-bold mt-1">{event.club} · {event.college}</p>
                        <p className="text-[12px] font-bold text-[#10B981] mt-2">+{event.points} Naami Points earned</p>
                      </div>
                      <button className="px-6 py-3 rounded-xl flex items-center gap-2 border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all font-black text-[10px] uppercase tracking-widest">
                        View Highlights
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* View Pass Modal */}
      <AnimatePresence>
        {passModalOpen && selectedEventPass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setPassModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          >
            {/* Pass Card */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] bg-white rounded-[24px] overflow-hidden shadow-2xl"
            >
              {/* Top: Event Banner */}
              <div className="relative h-[160px] overflow-hidden bg-slate-300">
                <img 
                  src={selectedEventPass.image} 
                  alt={selectedEventPass.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />

                {/* Top Left: Category Chip */}
                <div className="absolute top-4 left-4">
                  <span className="px-[10px] py-[3px] rounded-full text-white font-bold text-[11px] bg-[#7C3AED]">
                    {selectedEventPass.category}
                  </span>
                </div>

                {/* Top Right: Close Button */}
                <button onClick={() => setPassModalOpen(false)} className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-900 rounded-full w-8 h-8 flex items-center justify-center transition-all">
                  <X className="w-5 h-5" />
                </button>

                {/* Bottom: Event Name */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-white font-bold text-[20px] leading-tight drop-shadow-md">{selectedEventPass.title}</h2>
                  <p className="text-white/80 text-[13px] mt-1 drop-shadow-sm">{selectedEventPass.college}</p>
                </div>
              </div>

              {/* Dashed Divider with Semicircles */}
              <div className="relative h-12 flex items-center">
                <div className="absolute -left-4 w-8 h-8 rounded-full bg-[#F8F7FF]" />
                <div className="absolute -right-4 w-8 h-8 rounded-full bg-[#F8F7FF]" />
                <div className="w-full h-px border-t-2 border-dashed border-[#E5E7EB]" />
              </div>

              {/* Details Section */}
              <div className="px-6 py-5">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">📅 Date</p>
                    <p className="text-[14px] font-bold text-slate-900 mt-1">{selectedEventPass.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">🕐 Time</p>
                    <p className="text-[14px] font-bold text-slate-900 mt-1">{selectedEventPass.time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">🕕 End</p>
                    <p className="text-[14px] font-bold text-slate-900 mt-1">{selectedEventPass.endTime}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">📍 Venue</p>
                    <p className="text-[14px] font-bold text-slate-900 mt-1">{selectedEventPass.venue}</p>
                  </div>
                </div>

                {/* Duration for Hackathons */}
                {selectedEventPass.category === "Hackathon" && (
                  <div className="text-center mb-6 pb-6 border-b border-slate-100">
                    <p className="text-[13px] font-bold text-[#7C3AED]">⏱ Duration: {selectedEventPass.duration}</p>
                  </div>
                )}

                {/* QR Code Section */}
                <div className="flex flex-col items-center py-6">
                  {/* Placeholder QR Code SVG */}
                  <div className="w-[140px] h-[140px] bg-slate-100 rounded-lg border-2 border-slate-300 flex items-center justify-center">
                    <svg viewBox="0 0 140 140" className="w-full h-full p-2">
                      <rect width="140" height="140" fill="white" />
                      <rect x="10" y="10" width="30" height="30" fill="black" />
                      <rect x="100" y="10" width="30" height="30" fill="black" />
                      <rect x="10" y="100" width="30" height="30" fill="black" />
                      <circle cx="70" cy="70" r="20" fill="black" />
                      <rect x="40" y="40" width="60" height="60" fill="white" stroke="black" strokeWidth="2" />
                      {Array.from({length: 25}).map((_, i) => (
                        Math.random() > 0.5 ? (
                          <rect key={i} x={20 + (i % 5) * 20} y={40 + Math.floor(i / 5) * 20} width="8" height="8" fill="black" />
                        ) : null
                      ))}
                    </svg>
                  </div>
                  <p className="text-slate-400 font-bold text-[11px] mt-3">{selectedEventPass.passId}</p>
                  <p className="text-slate-400 text-[11px] mt-1">Scan at venue entry</p>
                </div>

                {/* Bottom: Logo + Verified Badge */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-black text-xs">N</div>
                    <span className="font-bold text-[13px] text-[#7C3AED]">Naami</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D1FAE5]">
                    <Check className="w-3 h-3 text-[#10B981]" />
                    <span className="text-[11px] font-bold text-[#10B981]">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: NOTIFICATIONS PAGE
   ──────────────────────────────────────────────────────── */

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'Social', text: 'Ananya Roy liked your post about Smart India Hackathon', timestamp: '2 minutes ago', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', group: 'TODAY', unread: true, detail: "Your post about the team finding their stride during the Smart India Hackathon got some attention! Ananya Roy recently liked it.", actionLink: "/post/smart-india-hackathon", actionText: "View Post" },
    { id: 2, type: 'Events', text: '⏰ Reminder: Global AI Hackathon 2026 starts in 24 hours. Don\'t forget your QR pass!', timestamp: '1 hour ago', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop', group: 'TODAY', unread: true, detail: "Global AI Hackathon 2026 is tomorrow! Make sure you have your Naami pass ready to scan at the venue (IIT Bombay, Main Hall). Bring your laptop and charger!", actionLink: "/event/ai-hackathon", actionText: "View Event Details" },
    { id: 3, type: 'Social', text: 'Kabir Singh commented on your post: "Congrats! Well deserved 🔥"', timestamp: '3 hours ago', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', group: 'TODAY', unread: true, detail: "Kabir Singh commented on your recent UI/UX Bootcamp certificate post: \n\n\"Congrats! Well deserved 🔥\"", actionLink: "/post/ui-ux-cert", actionText: "Reply to Comment" },
    { id: 4, type: 'Events', text: '🎟 Registration confirmed! You\'re registered for Eureka! Startup Summit 2026', timestamp: '5 hours ago', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop', group: 'TODAY', unread: true, detail: "Your registration for Eureka! Startup Summit 2026 has been approved by the organizers. Your digital pass is now available in your portfolio.", actionLink: "/portfolio", actionText: "View Pass" },
    { id: 5, type: 'Social', text: 'Sneha Joshi mentioned you in a post: "@Ritesh this is the project we should collab on!"', timestamp: '6 hours ago', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', group: 'TODAY', unread: false, detail: "Sneha Joshi tagged you in a post about the upcoming Web3 Hackathon at Bennett University. \n\n\"@Ritesh this is exactly the project we should collab on! Let's build that DApp.\"", actionLink: "/post/web3-collab", actionText: "View Post" },
    { id: 6, type: 'Social', text: 'Rohan Verma started following you', timestamp: 'Yesterday, 8:45 PM', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', group: 'YESTERDAY', unread: false, detail: "Rohan Verma (CS '26 @ IIT Delhi) is now following your updates.", actionLink: "/profile/rohan", actionText: "View Profile" },
    { id: 7, type: 'Updates', text: '🏆 You earned 150 Naami Points for attending Bennett Hackathon 3.0. Your new total: 1,250 pts', timestamp: 'Yesterday, 6:30 PM', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=100&h=100&fit=crop', group: 'YESTERDAY', unread: false, detail: "Congratulations! Your presence at Bennett Hackathon 3.0 was verified, adding 150 Naami Points to your account. Keep attending events to level up your profile!", actionLink: "/profile", actionText: "View Naami Score" },
    { id: 8, type: 'Events', text: '📣 Mood Indigo 2026 posted by IIT Bombay Cultural Society — a club you follow', timestamp: 'Yesterday, 3:15 PM', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&h=100&fit=crop', group: 'YESTERDAY', unread: false, detail: "A new event was just posted by IIT Bombay Cultural Society! Mood Indigo 2026 dates have been announced. Early bird registrations are open now.", actionLink: "/event/mood-indigo", actionText: "View Event" },
    { id: 9, type: 'Updates', text: '⚠️ Event updated: TechKriti \'26 venue has changed to IIT Kanpur Main Auditorium', timestamp: 'Yesterday, 11:00 AM', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=100&h=100&fit=crop', group: 'YESTERDAY', unread: false, detail: "Important update for TechKriti '26: The organizers have changed the venue from the CS Block to the Main Auditorium to accommodate more attendees. Time remains unchanged.", actionLink: "/event/techkriti", actionText: "View Updated Details" },
    { id: 10, type: 'Social', text: 'Priya Mehta liked your post about UI/UX Bootcamp', timestamp: 'Yesterday, 9:20 AM', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', group: 'YESTERDAY', unread: false, detail: "Priya Mehta liked your post: \"Just wrapped up an amazing 2-day UI/UX Design Bootcamp at BITS Pilani...\"", actionLink: "/post/ui-ux-cert", actionText: "View Post" },
    { id: 11, type: 'Events', text: '⏳ Closing soon: Registration for Smart India Hackathon closes in 2 days. You saved this event!', timestamp: 'Apr 18, 4:00 PM', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop', group: 'EARLIER THIS WEEK', unread: false, detail: "Don't miss out! You bookmarked Smart India Hackathon, and registrations close in exactly 48 hours. Secure your spot now.", actionLink: "/event/smart-india", actionText: "Register Now" },
    { id: 12, type: 'Social', text: 'Meera Nair started following you', timestamp: 'Apr 18, 1:30 PM', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face', group: 'EARLIER THIS WEEK', unread: false, detail: "Meera Nair (Design @ NID) is now following your updates.", actionLink: "/profile/meera", actionText: "View Profile" },
    { id: 13, type: 'Updates', text: '🏆 You earned 200 Naami Points for attending Eureka! Startup Summit 2026. Your new total: 1,100 pts', timestamp: 'Apr 17, 7:00 PM', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop', group: 'EARLIER THIS WEEK', unread: false, detail: "Your pass was scanned successfully at Eureka! Startup Summit 2026. 200 Naami Points have been credited to your account.", actionLink: "/profile", actionText: "View Naami Score" },
    { id: 14, type: 'Events', text: '⏰ Reminder: UI/UX Bootcamp starts in 1 hour. Head to BITS Pilani Main Hall', timestamp: 'Apr 17, 9:00 AM', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=100&h=100&fit=crop', group: 'EARLIER THIS WEEK', unread: false, detail: "The UI/UX Bootcamp is starting soon! Don't forget to grab your ID card and head over to the BITS Pilani Main Hall.", actionLink: "/event/ui-ux-bootcamp", actionText: "View Event" },
  ]);

  const filteredNotifications = activeFilter === 'All' 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const groupedNotifications = ['TODAY', 'YESTERDAY', 'EARLIER THIS WEEK'].map(group => ({
    name: group,
    items: filteredNotifications.filter(n => n.group === group)
  })).filter(g => g.items.length > 0);

  const handleNotificationClick = (notification) => {
    setNotifications(notifications.map(n => n.id === notification.id ? { ...n, unread: false } : n));
    setSelectedNotification(notification);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Social': '💜',
      'Events': '📅',
      'Updates': '⚡'
    };
    return icons[type] || '📌';
  };

  return (
    <div className="w-full pb-[40px]" style={{ backgroundColor: '#F8F7FF', padding: '24px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-[20px]">
        <h1 className="font-bold text-[22px] text-[#0F0F1A]">Notifications</h1>
        <button 
          onClick={handleMarkAllAsRead}
          className="text-[#7C3AED] text-[13px] font-bold hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-[20px]">
        {['All', 'Events', 'Social', 'Updates'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`rounded-full px-[14px] py-[6px] text-[12px] font-bold transition-all
              ${activeFilter === tab
                ? 'bg-[#7C3AED] text-white border border-[#7C3AED]'
                : 'bg-white text-slate-500 border border-[#E5E7EB] hover:bg-slate-50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications Grouped by Time */}
      <div className="space-y-2">
        {groupedNotifications.length > 0 ? (
          groupedNotifications.map((group, groupIdx) => (
            <div key={group.name}>
              <h3 className="text-[11px] font-bold uppercase text-slate-400 tracking-widest mt-4 mb-2">{group.name}</h3>
              <div className="space-y-2">
                {group.items.map((notification, idx) => (
                  <motion.button
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (groupIdx * 5 + idx) * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full flex items-start gap-3 p-4 rounded-[12px] transition-all hover:bg-slate-100
                      ${notification.unread ? 'bg-[#F3F0FF]' : 'bg-white'}`}
                  >
                    {/* Unread Dot */}
                    {notification.unread && (
                      <div className="w-2 h-2 rounded-full bg-[#7C3AED] mt-1.5 flex-shrink-0" />
                    )}
                    {!notification.unread && <div className="w-2 h-2 mt-1.5 flex-shrink-0" />}

                    {/* Image */}
                    <img
                      src={notification.image}
                      alt="notification"
                      className="w-[44px] h-[44px] rounded-[10px] object-cover flex-shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <p className="text-[14px] text-[#1F2937] leading-[1.5]">
                        {notification.text}
                      </p>
                      <p className="text-[12px] text-[#9CA3AF] mt-1">{notification.timestamp}</p>
                    </div>

                    {/* Type Icon */}
                    <span className="text-[16px] mt-1 flex-shrink-0">{getTypeIcon(notification.type)}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-[14px]">No notifications here</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNotification(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getTypeIcon(selectedNotification.type)}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{selectedNotification.type}</span>
                </div>
                <button onClick={() => setSelectedNotification(null)} className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 text-center flex flex-col items-center">
                <img 
                  src={selectedNotification.image} 
                  className="w-20 h-20 rounded-2xl object-cover shadow-sm mb-4" 
                  alt="detail" 
                />
                <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug">
                  {selectedNotification.text}
                </h3>
                <p className="text-sm text-slate-500 mb-6 px-4">
                  {selectedNotification.detail}
                </p>
                <div className="w-full flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      if (selectedNotification.actionLink) {
                        navigate(selectedNotification.actionLink);
                      }
                      setSelectedNotification(null);
                    }}
                    className="w-full py-3 bg-[#7C3AED] text-white rounded-xl font-bold text-sm hover:bg-[#6D28D9] transition-colors shadow-md shadow-purple-500/20"
                  >
                    {selectedNotification.actionText}
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-4">{selectedNotification.timestamp}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MOCK_CHATS = [
  { id: 1, name: "E-Cell IITB", avatar: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=150&h=150&fit=crop", message: "Are you attending the speaker session today?", time: "12:30 PM", unread: 2, online: true },
  { id: 2, name: "Advait Rao", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", message: "Let's sync up for the hackathon project.", time: "Yesterday", unread: 0, online: false },
  { id: 3, name: "TechFest Organizing", avatar: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=150&h=150&fit=crop", message: "Your registration is confirmed!", time: "Monday", unread: 0, online: true },
  { id: 4, name: "Mehak Jain", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", message: "Thanks for the notes 😊", time: "Tuesday", unread: 0, online: false },
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, senderId: 1, text: "Hey there! A quick reminder about the speaker session happening today.", time: "11:00 AM" },
    { id: 2, senderId: "me", text: "Hi! Yes, I got the email. What time was it again?", time: "11:15 AM" },
    { id: 3, senderId: 1, text: "It starts precisely at 5 PM in the FC Kohli Auditorium. See you there!", time: "11:20 AM" },
    { id: 4, senderId: "me", text: "Perfect, looking forward to it.", time: "11:25 AM" },
    { id: 5, senderId: 1, text: "Are you attending the speaker session today?", time: "12:30 PM" },
  ],
  2: [
    { id: 1, senderId: 2, text: "Hey, are you free to discuss the hackathon project?", time: "Yesterday" },
    { id: 2, senderId: "me", text: "Sure, I can jump on a call tonight.", time: "Yesterday" },
    { id: 3, senderId: 2, text: "Let's sync up for the hackathon project.", time: "Yesterday" },
  ],
  3: [
    { id: 1, senderId: 3, text: "Hello! We are excited to have you on board.", time: "Monday" },
    { id: 2, senderId: 3, text: "Your registration is confirmed!", time: "Monday" },
  ],
  4: [
    { id: 1, senderId: "me", text: "Make sure to check the notes I sent yesterday.", time: "Monday" },
    { id: 2, senderId: 4, text: "Thanks for the notes 😊", time: "Tuesday" },
  ]
};

const MessagingPage = ({ setActiveTab }) => {
  const [activeChat, setActiveChat] = useState(MOCK_CHATS[0]);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES[1] || []);

  useEffect(() => {
    if (activeChat) {
      setMessages(MOCK_MESSAGES[activeChat.id] || []);
    }
  }, [activeChat]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      senderId: "me",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessageText("");
  };

  return (
    <div className="w-full flex bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 h-[calc(100vh-6rem)]">
      {/* Left Sidebar */}
      <div className="w-[320px] border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Messages</h2>
          <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <MoreHorizontal className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="p-3 bg-white border-b border-slate-50 z-10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-slate-100 text-sm rounded-xl py-2 pl-9 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {MOCK_CHATS.map(chat => (
            <motion.div
              layoutId={`chat-${chat.id}`}
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-colors relative ${activeChat?.id === chat.id ? 'bg-white' : 'hover:bg-slate-100'}`}
            >
              {activeChat?.id === chat.id && (
                <motion.div 
                  layoutId="activeChatIndicator" 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary" 
                />
              )}
              <div className="relative shrink-0">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full bg-slate-200 object-cover" />
                {chat.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={`text-sm font-bold truncate transition-colors ${activeChat?.id === chat.id ? 'text-primary' : 'text-slate-900'}`}>{chat.name}</h3>
                  <span className={`text-xs font-bold shrink-0 transition-colors ${chat.unread ? 'text-primary' : 'text-slate-400'}`}>{chat.time}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className={`text-xs truncate transition-colors ${chat.unread ? 'text-slate-800 font-bold' : 'text-slate-500 font-medium'}`}>{chat.message}</p>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#F8FAFC] relative overflow-hidden">
        {/* Chat Header */}
        <AnimatePresence mode="wait">
        {activeChat ? (
          <motion.div 
            key={activeChat.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col"
          >
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-10 w-full">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full bg-slate-100" />
                  {activeChat.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeChat.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{activeChat.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar w-full">
              <AnimatePresence>
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === 'me';
                  return (
                    <motion.div 
                      key={msg.id} 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-[70%]">
                        <div className={`p-3.5 rounded-2xl text-sm font-bold ${
                          isMe 
                            ? 'bg-[#E8DFF5] text-[#7C3AED] rounded-br-sm shadow-sm' 
                            : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100 shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`text-[10px] font-bold text-slate-400 mt-1.5 ${isMe ? 'text-right' : 'text-left'}`}>
                          {msg.time}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0 w-full">
              <div className="flex items-end gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                <button className="p-2.5 text-slate-400 hover:text-primary transition-colors shrink-0">
                  <Sparkles className="w-5 h-5" />
                </button>
                <textarea 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message..." 
                  className="w-full bg-transparent border-none focus:ring-0 resize-none py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none max-h-[120px]"
                  rows="1"
                />
                <button 
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors shrink-0 m-0.5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-primary/40" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Your Messages</h3>
            <p className="text-sm text-slate-500 max-w-[260px]">Select a conversation from the sidebar to start chatting.</p>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: PROFILE PAGE
   ──────────────────────────────────────────────────────── */

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [eventFilter, setEventFilter] = useState('All');
  const [organizerModalOpen, setOrganizerModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [statsDisplayed, setStatsDisplayed] = useState({ connections: 0, points: 0, events: 0 });

  const PROFILE_DATA = {
    name: 'Ritesh Sharma',
    college: 'IIT Bombay',
    club: 'E-Cell IITB',
    course: 'Computer Science',
    year: '2026',
    bio: 'Full-stack dev & UI/UX enthusiast. Building cool things at IIT Bombay 🚀',
    skills: ['React', 'UI/UX', 'Python'],
    stats: { connections: 482, points: 1250, eventsAttended: 24 },
    cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    contact: {
      phone: '+91 98765 43210',
      email: 'ritesh.sharma@iitb.ac.in',
      collegeId: '22CS001',
      github: 'github.com/ritesh-sharma',
      linkedin: 'linkedin.com/in/ritesh-sharma'
    }
  };

  // Animate stats on mount
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setStatsDisplayed({
        connections: Math.floor(482 * progress),
        points: Math.floor(1250 * progress),
        events: Math.floor(24 * progress)
      });
      if (currentStep >= steps) clearInterval(interval);
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, []);

  const TABS = ['Posts', 'Events', 'Highlights', 'Achievements', 'About'];

  // Home feed posts data (same as FeedPage)
  const HOME_POSTS = [
    {
      id: 1,
      author: 'Ritesh Sharma',
      role: 'IIT Bombay · E-Cell IITB',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ritesh',
      timestamp: '2 hours ago',
      title: 'EcoTrack AI Hackathon 2026',
      description: 'Just wrapped up an amazing hackathon focused on AI for sustainable living! 🌍\n\nOur team built EcoTrack, an AI-powered carbon footprint tracker that helps students and professionals monitor their environmental impact in real-time.\n\nKey achievements:\n✨ Won Best Innovation Award\n🎯 200+ Naami Points earned\n🤝 Connected with 15+ other developers and designers\n\nA huge thanks to all the mentors, sponsors, and fellow participants. This community is amazing! 🚀\n\n#EcoTech #AI #Sustainability #Hackathon #IITBombay',
      location: 'IIT Bombay, Mumbai',
      category: 'Hackathon',
      catColor: 'bg-[#F3F0FF] text-[#7C3AED]',
      images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop'],
      likes: 324,
      comments: 47,
      liked: false
    },
    {
      id: 3,
      author: 'Ritesh Sharma',
      role: 'IIT Bombay · E-Cell IITB',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ritesh',
      timestamp: '5 days ago',
      title: 'UI/UX Design Bootcamp - Week 3 Complete',
      description: 'Completed 3 weeks of intensive UI/UX design at BITS Pilani! 🎨\n\nWhat I learned:\n• Design systems & component libraries\n• Advanced prototyping in Figma\n• User research methodologies\n• A/B testing frameworks\n\nProud moment: My redesign of a college admission portal was selected as the best project of the batch! 🏆\n\nThanks to @designmentors for the guidance. Excited for the final project! 🚀',
      location: 'BITS Pilani, Pilani',
      category: 'Workshop',
      catColor: 'bg-[#F0FAFA] text-teal-600',
      images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop'],
      likes: 289,
      comments: 32,
      liked: false
    },
    {
      id: 8,
      author: 'Ritesh Sharma',
      role: 'IIT Bombay · E-Cell IITB',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ritesh',
      timestamp: '2 weeks ago',
      title: 'HackIITB 2026 - Now Open Source! 🎉',
      description: 'Excited to announce that HackIITB 2026 backend is now open source! 🚀\n\nWe\'ve been working on this for months, and we\'re thrilled to share it with the community. Whether you\'re looking to learn, contribute, or use it for your own projects, feel free to fork, star, and contribute!\n\nRepository: github.com/ritesh-sharma/hackiitb-2026\n\nFeatures:\n• Real-time event management\n• Automated leaderboard system\n• Participant analytics dashboard\n• Integration with Naami platform\n\nContributions welcome! Join us in making this the best hackathon platform ever! 💯',
      location: 'IIT Bombay, Mumbai',
      category: 'Open Source',
      catColor: 'bg-[#FEF3C7] text-amber-700',
      images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop'],
      likes: 412,
      comments: 89,
      liked: false
    }
  ];

  return (
    <div className="w-full" style={{ backgroundColor: '#F8F7FF' }}>
      {/* Cover Photo */}
      <div className="relative w-full h-[200px] overflow-hidden bg-slate-300 group" style={{ borderRadius: '16px 16px 0 0' }}>
        <img src={PROFILE_DATA.cover} alt="Cover" className="w-full h-full object-cover" />
        <motion.button 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[16px] hover:bg-slate-100 transition-colors"
        >
          ✏️
        </motion.button>
      </div>

      {/* Profile Header Section - LinkedIn Style */}
      <div style={{ padding: '0 32px 24px 32px' }}>
        
        {/* Profile Photo */}
        <motion.div 
          className="relative flex-shrink-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ marginTop: '-57px' }}
        >
          <img 
            src={PROFILE_DATA.avatar} 
            alt="Profile" 
            className="w-[115px] h-[115px] rounded-full object-cover border-[3px] border-[#7C3AED]"
          />
        </motion.div>

        {/* Name + Edit Button */}
        <div className="flex items-center justify-between gap-4" style={{ marginTop: '12px', marginBottom: '4px' }}>
          <h1 className="text-[22px] font-weight-700 text-[#0F0F1A]" style={{ fontWeight: 700 }}>{PROFILE_DATA.name}</h1>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            className="w-[28px] h-[28px] rounded-full border-2 border-slate-300 flex items-center justify-center text-[14px] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors flex-shrink-0"
          >
            ✏️
          </motion.button>
        </div>

        {/* Bio Row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-4"
        >
          <p className="text-[14px] text-[#4B5563] leading-relaxed">
            {bioExpanded ? PROFILE_DATA.bio + ' I\'m passionate about creating beautiful, functional interfaces and contributing to the tech community.' : PROFILE_DATA.bio}
            {PROFILE_DATA.bio.length > 100 && (
              <button onClick={() => setBioExpanded(!bioExpanded)} className="text-[#7C3AED] font-bold cursor-pointer ml-1">
                {bioExpanded ? 'less' : '... see more'}
              </button>
            )}
          </p>
        </motion.div>

        {/* Course + Year Strip */}
        <p className="text-[13px] text-[#6B7280] mt-3 font-medium">
          B.Tech · {PROFILE_DATA.course} · Class of {PROFILE_DATA.year}
        </p>

        {/* College + Club Pills */}
        <motion.div 
          className="flex items-center gap-2 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <span className="px-4 py-1.5 bg-[#F3F3F3] text-[#4B5563] rounded-full text-[13px] font-bold">
            🏫 {PROFILE_DATA.college}
          </span>
          <span className="px-4 py-1.5 bg-[#F3F0FF] text-[#7C3AED] rounded-full text-[13px] font-bold">
            ⚡ {PROFILE_DATA.club}
          </span>
        </motion.div>

        {/* Stats Row */}
        <div className="flex items-center justify-start gap-6 py-4 mt-4 border-t border-b border-slate-200">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-[18px] font-bold text-[#0F0F1A]">{statsDisplayed.connections}</p>
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mt-1">Connections</p>
          </motion.div>
          <div className="w-px h-[40px] bg-slate-200" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <p className="text-[18px] font-bold text-[#0F0F1A]">{statsDisplayed.points}</p>
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mt-1">Points</p>
          </motion.div>
          <div className="w-px h-[40px] bg-slate-200" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[18px] font-bold text-[#0F0F1A]">{statsDisplayed.events}</p>
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mt-1">Events Attended</p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="flex gap-2.5 mt-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <button 
            onClick={() => setContactModalOpen(true)}
            className="flex-1 px-6 py-2 rounded-[999px] bg-[#7C3AED] text-white font-bold text-[13px] hover:bg-[#6D28D9] transition-all"
          >
            💬 Contact
          </button>
          <button 
            onClick={() => setOrganizerModalOpen(true)}
            className="flex-1 px-6 py-2 rounded-[999px] border-2 border-[#F97316] text-[#F97316] font-bold text-[13px] hover:bg-[#F97316] hover:text-white transition-all"
          >
            🎪 Become Organizer
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200 pt-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[14px] font-bold transition-all relative
                ${activeTab === tab
                  ? 'text-[#7C3AED]'
                  : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#7C3AED]" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Posts' && (
          <div className="space-y-6 pb-20">
            {HOME_POSTS.map((post, idx) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="bg-white rounded-[16px] shadow-sm border border-slate-100 p-5"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-[13px] text-slate-900">{post.author}</p>
                      <p className="text-[12px] text-slate-500">{post.role}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{post.timestamp}</p>
                    </div>
                  </div>
                  <button className="text-[16px] hover:opacity-60 transition-opacity">···</button>
                </div>

                {/* Post Title */}
                <h3 className="text-[14px] font-bold text-slate-900 mb-3">{post.title}</h3>

                {/* Post Description */}
                <p className="text-[14px] text-slate-700 whitespace-pre-line mb-4 leading-relaxed">{post.description}</p>

                {/* Category + Location */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${post.catColor}`}>
                    {post.category}
                  </span>
                  <span className="text-[12px] text-slate-500 flex items-center gap-1">
                    📍 {post.location}
                  </span>
                </div>

                {/* Images Grid */}
                {post.images && post.images.length > 0 && (
                  <div className="mb-4">
                    <div className={`grid gap-2 ${
                      post.images.length === 1 ? 'grid-cols-1' :
                      post.images.length === 2 ? 'grid-cols-2' :
                      'grid-cols-3'
                    }`}>
                      {post.images.map((img, i) => (
                        <motion.img
                          key={i}
                          src={img}
                          alt={`Post image ${i + 1}`}
                          className="w-full h-[200px] rounded-[8px] object-cover hover:brightness-90 transition-all cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Post Stats */}
                <div className="text-[12px] text-slate-500 mb-4 pb-4 border-b border-slate-100">
                  <span className="font-bold">{post.likes} likes</span> · <span>{post.comments} comments</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-around text-[13px] font-bold text-slate-600">
                  <button className="flex items-center gap-2 py-2 px-4 rounded-[8px] hover:bg-slate-100 transition-colors">
                    👍 Like
                  </button>
                  <button className="flex items-center gap-2 py-2 px-4 rounded-[8px] hover:bg-slate-100 transition-colors">
                    💬 Comment
                  </button>
                  <button className="flex items-center gap-2 py-2 px-4 rounded-[8px] hover:bg-slate-100 transition-colors">
                    📌 Save
                  </button>
                  <button className="flex items-center gap-2 py-2 px-4 rounded-[8px] hover:bg-slate-100 transition-colors">
                    📤 Share
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'Events' && (
          <div className="pb-20">
            <div className="flex gap-2 mb-6">
              {['All', 'Hackathons', 'Cultural', 'Workshops', 'Competitions'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setEventFilter(cat)}
                  className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all
                    ${eventFilter === cat
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({length: 6}).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative bg-slate-300 rounded-[12px] h-[200px] overflow-hidden group"
                >
                  <img 
                    src={`https://images.unsplash.com/photo-150${440 + i}384308090-c894fdcc538d?w=400&auto=format&fit=crop`}
                    alt="Event"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                    ✓ Attended
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <p className="text-white font-bold text-[14px]">Event {i + 1}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Highlights' && (
          <div className="pb-20">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({length: 6}).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="bg-slate-300 rounded-[12px] aspect-[9/16] overflow-hidden group cursor-pointer"
                >
                  <img 
                    src={`https://images.unsplash.com/photo-${1492684223066 + i}?w=400&auto=format&fit=crop`}
                    alt="Highlight"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Achievements' && (
          <div className="pb-20">
            <h3 className="text-[16px] font-bold text-slate-900 mb-6">Badges Earned (8)</h3>
            <div className="grid grid-cols-4 gap-4 mb-12">
              {[
                { emoji: '🏆', name: 'First Hackathon', desc: 'Attended your first hackathon', date: 'Apr 2025' },
                { emoji: '🎯', name: '10 Events', desc: 'Attended 10 events', date: 'Jan 2026' },
                { emoji: '⭐', name: 'Top Contributor', desc: 'Earned 1000+ points', date: 'Mar 2026' },
                { emoji: '🔥', name: 'Streak', desc: 'Registered 5 events in a row', date: 'Feb 2026' },
                { emoji: '🎪', name: 'Cultural Explorer', desc: 'Attended 3 cultural fests', date: 'Dec 2025' },
                { emoji: '💻', name: 'Code Warrior', desc: 'Won a hackathon', date: 'Nov 2025' },
                { emoji: '🤝', name: 'Connector', desc: '400+ connections', date: 'Mar 2026' },
                { emoji: '🌟', name: 'Early Adopter', desc: 'Joined Naami in beta', date: 'Sep 2025' }
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-[16px] shadow-sm p-4 text-center hover:shadow-md transition-shadow"
                >
                  <p className="text-[28px] mb-2">{badge.emoji}</p>
                  <p className="text-[13px] font-bold text-slate-900">{badge.name}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{badge.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{badge.date}</p>
                </motion.div>
              ))}
            </div>

            <h3 className="text-[16px] font-bold text-slate-900 mb-6 mt-12">Points History</h3>
            <div className="space-y-4">
              {[
                { event: 'Global AI Hackathon 2026', points: 200, date: 'Apr 18' },
                { event: 'Bennett Hackathon 3.0', points: 150, date: 'Apr 20' },
                { event: 'UI/UX Bootcamp', points: 100, date: 'Apr 5' },
                { event: 'Eureka! Startup Summit', points: 200, date: 'Mar 22' },
                { event: 'Mood Indigo 2026', points: 150, date: 'Mar 20' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 py-3"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                    {i < 4 && <div className="w-0.5 h-12 bg-slate-200 mt-1" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-slate-900">{item.event}</p>
                    <p className="text-[12px] text-slate-500 mt-1">{item.date}</p>
                  </div>
                  <p className="text-[14px] font-bold text-green-600">+{item.points} pts</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'About' && (
          <div className="pb-20 grid grid-cols-3 gap-12">
            <div className="col-span-2">
              <div className="mb-8">
                <h3 className="text-[16px] font-bold text-slate-900 mb-4">Education</h3>
                <div className="bg-white rounded-[12px] p-6 border border-slate-100">
                  <p className="text-[14px] font-bold text-slate-900">IIT Bombay</p>
                  <p className="text-[13px] text-slate-600 mt-1">B.Tech Computer Science Engineering</p>
                  <p className="text-[12px] text-slate-500 mt-1">2024 - 2026</p>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-[16px] font-bold text-slate-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {PROFILE_DATA.skills.concat(['JavaScript', 'TypeScript', 'Tailwind CSS', 'Design Thinking', 'Figma']).map(skill => (
                    <span key={skill} className="bg-[#F3F0FF] text-[#7C3AED] px-4 py-2 rounded-full text-[12px] font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-4">Bio</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed">{PROFILE_DATA.bio} I'm passionate about creating beautiful, functional interfaces and have been contributing to the tech community at IIT Bombay for over 2 years. Always eager to learn new technologies and collaborate on exciting projects.</p>
              </div>
            </div>
            <div>
              <div className="mb-8">
                <h3 className="text-[16px] font-bold text-slate-900 mb-4">Social Links</h3>
                <div className="space-y-2">
                  {[
                    { icon: '💻', label: 'GitHub', handle: '@ritesh-sharma' },
                    { icon: '🔗', label: 'LinkedIn', handle: 'ritesh-sharma' },
                    { icon: '𝕏', label: 'Twitter', handle: '@ritesh_codes' }
                  ].map(link => (
                    <button key={link.label} className="w-full px-4 py-2.5 border border-slate-200 rounded-full text-left text-[13px] font-bold text-slate-900 hover:bg-slate-50 transition-colors">
                      {link.icon} {link.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-[16px] font-bold text-slate-900 mb-4">Joined Naami</h3>
                <p className="text-[14px] text-slate-600">September 2025</p>
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-4">College</h3>
                <div className="px-4 py-2.5 border border-slate-200 rounded-full inline-flex items-center gap-2">
                  <span>🏢 IIT Bombay</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {contactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setContactModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] bg-white rounded-[20px] p-7 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-bold text-slate-900">Contact Info</h2>
                <button onClick={() => setContactModalOpen(false)} className="text-[18px] text-slate-400 hover:text-slate-900">✕</button>
              </div>

              {[
                { icon: '📱', label: 'Phone', value: PROFILE_DATA.contact.phone, color: 'bg-green-100 text-green-600', link: false },
                { icon: '✉️', label: 'Email', value: PROFILE_DATA.contact.email, color: 'bg-purple-100 text-purple-600', link: false },
                { icon: '🎓', label: 'College ID', value: PROFILE_DATA.contact.collegeId, extra: 'IIT Bombay', color: 'bg-blue-100 text-blue-600', link: false },
                { icon: '💻', label: 'GitHub', value: PROFILE_DATA.contact.github, color: 'bg-gray-100 text-gray-900', link: true },
                { icon: '💼', label: 'LinkedIn', value: PROFILE_DATA.contact.linkedin, color: 'bg-blue-50 text-blue-700', link: true }
              ].map((contact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-center gap-4 py-3 ${i < 4 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[16px] ${contact.color}`}>
                    {contact.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] text-slate-500 font-medium">{contact.label}</p>
                    {contact.link ? (
                      <a href={`https://${contact.value}`} target="_blank" rel="noopener noreferrer" className="text-[13px] font-bold text-[#7C3AED] hover:underline">
                        {contact.value}
                      </a>
                    ) : (
                      <>
                        <p className="text-[13px] font-bold text-slate-900">{contact.value}</p>
                        {contact.extra && <p className="text-[12px] text-slate-500">{contact.extra}</p>}
                      </>
                    )}
                  </div>
                </motion.div>
              ))}

              <button onClick={() => setContactModalOpen(false)} className="w-full mt-6 py-2.5 text-[#7C3AED] font-bold text-[13px] hover:text-[#6D28D9]">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: RIGHT PANEL
   ──────────────────────────────────────────────────────── */

const TrendingCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const slides = [
    {
      title: "Smart India Hackathon",
      org: "Govt. of India · Pan India",
      count: "12.4k",
      category: "Hackathon",
      catBg: "bg-[#F3F0FF] text-[#7C3AED]",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop"
    },
    {
      title: "Mood Indigo 2026",
      org: "IIT Bombay · Mumbai",
      count: "8.2k",
      category: "Cultural",
      catBg: "bg-[#FFF0F6] text-pink-600",
      img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop"
    },
    {
      title: "UI/UX Bootcamp",
      org: "BITS Pilani · Pilani",
      count: "890",
      category: "Workshop",
      catBg: "bg-[#F0FAFA] text-teal-600",
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop"
    },
    {
      title: "Startup Summit",
      org: "IIT Delhi · Delhi",
      count: "3.1k",
      category: "Competition",
      catBg: "bg-[#EFF6FF] text-blue-600",
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="relative w-full rounded-[12px] overflow-hidden bg-slate-50 isolate">
        <div 
          className="flex flex-nowrap w-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: "transform 0.5s ease" }}
        >
          {slides.map((s, i) => (
            <div key={i} className="w-full flex-shrink-0 flex flex-col">
              <div className="relative w-full h-[110px] rounded-[12px] overflow-hidden">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                
                {/* Top Right Chip */}
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm shadow flex items-center gap-1 leading-none">
                  <span className="text-[10px]">🔥</span>
                  <span className="text-[10px] font-bold text-white tracking-wide">{s.count}</span>
                </div>

                {/* Bottom Left Info */}
                <div className="absolute bottom-2 left-3 flex flex-col">
                  <h4 className="text-[13px] font-bold text-white leading-tight shadow-sm">{s.title}</h4>
                  <p className="text-[11px] text-white/80 font-medium leading-tight mt-0.5">{s.org}</p>
                </div>
              </div>
              
              {/* Below Image */}
              <div className="flex items-center gap-2 mt-2 px-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.catBg}`}>
                  {s.category}
                </span>
                <span className="text-[10px] font-bold text-[#7C3AED] hover:underline cursor-pointer tracking-tight">Register →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-1 mt-1">
        {slides.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-[#7C3AED]' : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

const CountdownTimer = ({ initialDays, initialHours, initialMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    // Convert to total seconds
    return (initialDays * 24 * 60 + initialHours * 60 + initialMinutes) * 60;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const d = Math.floor(timeLeft / (24 * 3600));
  const h = Math.floor((timeLeft % (24 * 3600)) / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <span className="text-[#EF4444] font-bold text-[12px]">
      closes in {d}d {h}h {m}m {s}s
    </span>
  );
};

export const bennettEvents = [
  { name: 'Bennett Hackathon 3.0', club: 'Tech Club', date: 'Apr 20', fee: '₹199', category: 'Hackathon', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400', eventId: 'bennett-hackathon' },
  { name: 'Spring Fest 2026', club: 'Cultural Society', date: 'Apr 25', fee: 'Free', category: 'Cultural', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400', eventId: 'spring-fest' },
  { name: 'Web Dev Workshop', club: 'Coding Club', date: 'Apr 15', fee: '₹99', category: 'Workshop', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400', eventId: 'web-dev-workshop' },
  { name: 'Bennett MUN 2026', club: 'MUN Society', date: 'May 5', fee: '₹299', category: 'Competition', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400', eventId: 'bennett-mun' },
  { name: 'E-Summit Bennett', club: 'E-Cell', date: 'May 12', fee: '₹499', category: 'Entrepreneurship', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400', eventId: 'e-summit' },
  { name: 'Photography Walk', club: 'Photography Club', date: 'Apr 28', fee: 'Free', category: 'Workshop', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400', eventId: 'photo-walk' },
];

const BennettCard1 = ({ navigate, setCollegePageData, CardContainer, SectionHeader }) => {
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setEventIndex((prev) => (prev + 2 >= bennettEvents.length ? 0 : prev + 2));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <CardContainer delay={0}>
      <SectionHeader 
        icon="🏫" 
        text="BENNETT UNIVERSITY" 
        className="cursor-pointer hover:bg-[#F3F0FF] p-2 -my-2 -mx-2 rounded-lg transition-colors"
        onClick={() => setCollegePageData({ id: 'bennett', name: 'Bennett University' })}
      />

      {/* Calendar Strip */}
      <div className="flex justify-between w-full mb-6 mt-4">
        {[
          { day: 'Mon', date: '15', id: 'web-dev-workshop' },
          { day: 'Tue', date: '16' },
          { day: 'Wed', date: '17' },
          { day: 'Thu', date: '18', today: true },
          { day: 'Fri', date: '19' },
          { day: 'Sat', date: '20', id: 'bennett-hackathon' },
          { day: 'Sun', date: '21', id: 'spring-fest' },
        ].map((d, i) => {
          const currentPair = bennettEvents.slice(eventIndex, eventIndex + 2);
          const isActive = currentPair.some(ev => ev.eventId === d.id);
          return (
          <div 
            key={i} 
            className={`flex flex-col items-center gap-1.5 min-w-[28px] ${isActive ? 'cursor-pointer hover:opacity-80' : ''}`}
            onClick={() => isActive && navigate(`/event/${d.id}`)}
          >
            <span className="text-[10px] text-slate-400 font-medium">{d.day}</span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${d.today ? 'bg-[#7C3AED] text-white' : 'text-slate-700'}`}>
              {d.date}
            </div>
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shadow-sm shadow-[#7C3AED]/50" />}
          </div>
        )})}
      </div>

      <div className="relative w-full overflow-hidden" style={{ minHeight: '160px' }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={eventIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col gap-2"
          >
            {bennettEvents.slice(eventIndex, eventIndex + 2).map((ev, i) => (
              <div key={ev.eventId} className="space-y-4 shadow-sm border border-slate-50 p-3 rounded-xl hover:border-purple-100 transition-colors cursor-pointer bg-white" onClick={() => navigate(`/event/${ev.eventId}`)}>
                <div className="flex items-start gap-3 relative">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-sm ${i === 0 ? 'bg-[#7C3AED] shadow-[#7C3AED]/30' : 'bg-pink-500 shadow-pink-500/30'}`} />
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-[13px] leading-tight pr-2">{ev.name}</h4>
                      <div className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-500 flex-shrink-0 whitespace-nowrap">
                        {ev.date}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{ev.club}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        {ev.fee}
                      </span>
                      <button 
                        className="text-[10px] font-bold text-[#7C3AED] text-left hover:underline flex items-center gap-1"
                        onClick={(e) => { e.stopPropagation(); navigate(`/event/${ev.eventId}`); }}
                      >
                        Visit Page <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </CardContainer>
  );
};

const PEOPLE = [
  { id: 'ananya-roy', name: "Ananya Roy", handle: "@ananya_dev", tag: "IIT Bombay", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: 'kabir-singh', name: "Kabir Singh", handle: "@kabir_iitd", tag: "IIT Delhi", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: 'priya-mehta', name: "Priya Mehta", handle: "@priya_ux", tag: "BITS Pilani", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: 'rohan-verma', name: "Rohan Verma", handle: "@rohan_dtu", tag: "DTU", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { id: 'meera-nair', name: "Meera Nair", handle: "@meera_nit", tag: "NIT Trichy", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" },
  { id: 'dev-sharma', name: "Dev Sharma", handle: "@dev_nsut", tag: "NSUT", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face" },
  { id: 'tanvi-reddy', name: "Tanvi Reddy", handle: "@tanvi_vit", tag: "VIT Vellore", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face" },
  { id: 'sneha-joshi', name: "Sneha Joshi", handle: "@sneha_manipal", tag: "Manipal", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
];

const RightPanelSuggestedAccountsCard = ({ CardContainer, SectionHeader, navigate }) => {
  const [followedIds, setFollowedIds] = useState([]);
  const toggleFollow = (id) => {
    setFollowedIds(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };
  return (
    <CardContainer delay={0.3}>
      <SectionHeader icon="👥" text="PEOPLE TO FOLLOW" />
      <div className="space-y-4 max-h-[320px] overflow-y-auto no-scrollbar">
        <AnimatePresence>
          {PEOPLE.filter(person => !followedIds.includes(person.id)).map((person, i, arr) => {
            return (
              <motion.div 
                key={person.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm border border-slate-200 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => navigate(`/${person.id}`)}
                  >
                    <img src={person.img} className="w-full h-full object-cover" alt={person.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="text-[13px] font-bold text-slate-900 truncate tracking-tight leading-tight cursor-pointer hover:text-[#7C3AED] transition-colors"
                      onClick={() => navigate(`/${person.id}`)}
                    >
                      {person.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-500 font-medium truncate">{person.handle}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#F3F0FF] text-[#7C3AED] border border-purple-100 text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                        {person.tag}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleFollow(person.id)}
                    className="px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white"
                  >
                    Follow
                  </button>
                </div>
                {i < arr.length - 1 && <div className="h-px w-full bg-slate-50 mt-4 mb-4" />}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </CardContainer>
  );
};

const CardContainer = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -2, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
    className={`bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4 transition-all ${className}`}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ icon, text, extra, onClick, className = '' }) => (
  <div 
    className={`flex items-center gap-2 mb-4 ${className}`}
    onClick={onClick}
  >
    {icon && <div className="w-5 flex items-center justify-center font-normal">{icon}</div>}
    <div className="text-[11px] uppercase tracking-[0.08em] font-bold text-slate-500">
      {text}
    </div>
    {extra && <div className="ml-auto">{extra}</div>}
  </div>
);

const RightPanel = ({ setCollegePageData, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[14px] bg-[#F8F7FF] p-4 rounded-3xl min-h-full overflow-y-auto no-scrollbar">
      
      {/* CARD 1 - Bennett University Events */}
      <BennettCard1 navigate={navigate} setCollegePageData={setCollegePageData} CardContainer={CardContainer} SectionHeader={SectionHeader} />

      {/* CARD 2 - Trending Nationwide */}
      <CardContainer delay={0.1} className="overflow-hidden">
        <div
          onClick={() => {
            navigate('/feed?tab=explore&category=All');
            setActiveTab('explore');
          }}
          className="group cursor-pointer"
        >
          <SectionHeader icon="🔥" text="TRENDING NATIONWIDE" />

          <div className="w-full mb-3 pointer-events-none group-hover:opacity-90 transition-opacity">
            <TrendingCarousel />
          </div>

          <div className="h-px w-full bg-slate-100 mb-3" />
          <div className="flex justify-end">
            <button className="text-[12px] font-bold text-[#7C3AED] group-hover:underline">View All Trending →</button>
          </div>
        </div>
      </CardContainer>

      {/* CARD 3 - Closing Soon */}
      <CardContainer delay={0.2} className="!bg-[#FFF5F5] border border-[#FED7D7]">
        <SectionHeader 
          icon="⏳" 
          text="CLOSING SOON" 
          extra={<div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />}
        />
        
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-900 text-[14px] leading-tight">TechKriti '26</h4>
            <p className="text-[12px] text-slate-500">IIT Kanpur</p>
            <CountdownTimer initialDays={1} initialHours={3} initialMinutes={59} />
            
            <div className="mt-2 space-y-1.5">
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#EF4444] rounded-full" style={{ width: '68%' }} />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-slate-500 font-medium">340/500 seats filled</span>
                <button onClick={() => navigate('/event/4')} className="text-[11px] font-bold text-[#EF4444] hover:underline cursor-pointer">Register Now →</button>
              </div>
            </div>
          </div>
          
          <div className="h-px w-full bg-[#FED7D7]" />
          
          <div className="flex flex-col gap-1.5">
            <h4 className="font-bold text-slate-900 text-[14px] leading-tight">UI/UX Bootcamp</h4>
            <p className="text-[12px] text-slate-500">BITS Pilani</p>
            <CountdownTimer initialDays={2} initialHours={11} initialMinutes={0} />
            
            <div className="mt-2 space-y-1.5">
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#EF4444] rounded-full" style={{ width: '89%' }} />
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-slate-500 font-medium">89/100 seats filled</span>
                <button onClick={() => navigate('/event/3')} className="text-[11px] font-bold text-[#EF4444] hover:underline cursor-pointer">Register Now →</button>
              </div>
            </div>
          </div>
        </div>
      </CardContainer>

      {/* CARD 4 - Suggested Accounts */}
      <RightPanelSuggestedAccountsCard CardContainer={CardContainer} SectionHeader={SectionHeader} navigate={navigate} />
    </div>
  );
};

/* ────────────────────────────────────────────────────────
   COMPONENTS: INTERACTIVE CALENDAR
   ──────────────────────────────────────────────────────── */

const interactiveCalendarEvents = [
  { date: new Date(2026, 3, 15), title: "Web Dev Workshop", color: "#0D9488", time: "10:00 AM" },
  { date: new Date(2026, 3, 20), title: "Bennett Hackathon 3.0", color: "#7C3AED", time: "9:00 AM" },
  { date: new Date(2026, 3, 25), title: "Spring Fest 2026", color: "#EC4899", time: "11:00 AM" },
  { date: new Date(2026, 3, 28), title: "Photography Walk", color: "#0D9488", time: "5:00 PM" },
  { date: new Date(2026, 4, 5), title: "Bennett MUN 2026", color: "#EAB308", time: "10:00 AM" },
  { date: new Date(2026, 4, 12), title: "E-Summit Bennett", color: "#F97316", time: "9:00 AM" }
];

const InteractiveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  // Adjust so Monday is 0, Sunday is 6
  const emptyDaysCount = (startDay + 6) % 7;

  const days = [];
  for (let i = 0; i < emptyDaysCount; i++) days.push(null);
  for (let i = 1; i <= numDays; i++) days.push(new Date(year, month, i));

  const handleDateClick = (date) => {
    if (date) {
      if (selectedDate && date.getTime() === selectedDate.getTime()) {
        setSelectedDate(null);
      } else {
        setSelectedDate(date);
      }
    }
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return interactiveCalendarEvents.filter(e =>
      e.date.getFullYear() === date.getFullYear() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getDate() === date.getDate()
    );
  };

  const todayStr = new Date(2026, 3, 18).toDateString(); // Hardcoded mock today

  return (
    <div className="bg-white rounded-[16px] shadow-sm p-[20px] mb-[24px]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <h2 className="text-[16px] font-bold text-slate-900">
          {monthNames[month]} {year}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className="h-[64px] rounded-[10px]"></div>;

          const dayEvents = getEventsForDate(date);
          const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
          const isToday = todayStr === date.toDateString();
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={i}
              onClick={() => handleDateClick(date)}
              className={`relative h-[64px] rounded-[10px] p-1.5 sm:p-2 flex flex-col items-start transition-all border border-transparent ${
                isSelected ? 'bg-[#F3F0FF] border-[#7C3AED]/20' : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`text-[13px] font-bold w-6 h-6 flex items-center justify-center rounded-full mt-[-2px] ml-[-2px] ${
                  isToday ? 'bg-[#7C3AED] text-white' : 'text-slate-700'
                }`}
              >
                {date.getDate()}
              </div>

              {hasEvents && (
                <div className="flex gap-1 mt-auto ml-0.5 pb-0.5">
                  {dayEvents.slice(0, 3).map((ev, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: ev.color }}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4 bg-slate-50 rounded-[12px] border border-slate-100"
          >
            <div className="p-4">
              <h3 className="text-[13px] font-black text-slate-500 mb-3 border-b border-slate-200 pb-2">
                Events for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
              
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-sm text-slate-400 font-medium text-center py-4">No events on this day</p>
              ) : (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map((ev, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm gap-3">
                      <div className="flex flex-col gap-1.5">
                        <span 
                          className="text-[10px] font-black uppercase tracking-wider w-fit px-2 py-0.5 rounded-md" 
                          style={{ color: ev.color, backgroundColor: `${ev.color}15` }}
                        >
                          {ev.category || 'Event'}
                        </span>
                        <p className="text-[14px] font-bold text-slate-900">{ev.title}</p>
                        <p className="text-[12px] font-semibold text-slate-500">{ev.time}</p>
                      </div>
                      <button className="text-[11px] font-bold text-[#7C3AED] hover:underline flex items-center gap-1 sm:mt-0 mt-1 whitespace-nowrap">
                        Visit Page <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   COMPONENTS: NEW PAGES (COLLEGE & EVENT)
   ───────────────────────────────────────────────────────────────── */

const CollegeEventsPage = ({ onClose, data }) => {
  const navigate = useNavigate();
  const events = bennettEvents;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2rem] overflow-hidden shadow-inner min-h-full relative pb-10">
      <div className="relative">
        <button onClick={onClose} className="absolute top-4 left-4 z-10 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img src={data?.cover || "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop"} className="w-full h-[180px] object-cover" alt={data?.name || "College"} />
        <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-1 border-2 border-white shadow-sm"><Check className="w-4 h-4" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <h1 className="absolute bottom-4 left-6 text-white font-black text-2xl drop-shadow-md tracking-tight uppercase">{data?.name || "Bennett University"}</h1>
      </div>
      <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
        <div>
           <p className="text-slate-500 font-bold text-sm">Location, IN</p>
           <p className="text-slate-400 text-xs mt-1 font-medium">12 Events · {data?.followers || "4,200"} Followers · 34 Clubs</p>
        </div>
      </div>

      <InteractiveCalendar />

      <div className="px-6 py-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          {['All', 'Hackathons', 'Cultural', 'Workshops', 'Competitions', 'Annual Fests'].map((tab, i) => (
             <button key={i} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-[#7C3AED] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {tab}
             </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
           {events.map((ev, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:shadow-lg hover:border-purple-100 transition-all cursor-pointer group" onClick={() => navigate(`/event/${ev.eventId}`)}>
                 <img src={ev.img} className="w-full sm:w-[120px] h-[120px] object-cover rounded-xl flex-shrink-0 group-hover:scale-[1.02] transition-transform" alt={ev.name} />
                 <div className="flex flex-col flex-1 py-1">
                    <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-wider bg-purple-50 w-fit px-2 py-1 rounded-md mb-2">{ev.category}</span>
                    <h3 className="font-bold text-slate-900 text-[15px] leading-tight group-hover:text-[#7C3AED] transition-colors">{ev.name}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">{ev.club} · {ev.date}</p>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-200">{ev.feeValue || ev.fee}</span>
                       <button className="text-[11px] font-bold text-[#7C3AED] hover:underline flex items-center gap-1">Visit Page <ArrowRight className="w-3 h-3" /></button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
};

const EventDetailsPage = ({ eventId }) => {
  const navigate = useNavigate();
  const [regState, setRegState] = useState('idle'); // idle, confirming, confirmed
  const [timeLeft, setTimeLeft] = useState(3 * 24 * 60 * 60 + 12 * 60 * 60);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const d = Math.floor(timeLeft / (24 * 60 * 60));
  const h = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const m = Math.floor((timeLeft % (60 * 60)) / 60);
  const s = timeLeft % 60;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2rem] overflow-hidden shadow-inner min-h-full pb-20 relative">
      {/* Hero Section */}
      <div className="relative h-[320px]">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 z-10 bg-black/40 text-white p-2.5 rounded-full hover:bg-black/60 transition-colors backdrop-blur-sm cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Event Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
           <span className="text-xs font-black text-white uppercase tracking-wider bg-[#7C3AED] px-3 py-1.5 rounded-lg mb-3 inline-block shadow-md">Hackathon</span>
           <h1 className="text-white font-black text-3xl md:text-4xl drop-shadow-md tracking-tight mb-2">Bennett Hackathon 3.0</h1>
           <p className="text-white/80 font-medium text-sm flex items-center gap-2">
             <span className="text-white font-bold">Tech Club</span> · Bennett University
           </p>
        </div>
      </div>

      <div className="p-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1 lg:w-[65%] space-y-10">
           <section>
              <h2 className="text-lg font-black text-slate-900 mb-3 tracking-wide">ABOUT THIS EVENT</h2>
              <p className="text-slate-600 text-[14px] leading-relaxed font-medium">
                Bennett Hackathon 3.0 is the flagship annual hackathon organized by the Tech Club of Bennett University. 
                Open to all students across India, this 24-hour coding marathon brings together the brightest minds to 
                build innovative solutions for real-world problems. With mentors from top tech companies, exciting prizes, 
                and networking opportunities, this is the event you don't want to miss.
              </p>
           </section>

           <section>
              <h2 className="text-lg font-black text-slate-900 mb-4 tracking-wide">WHAT TO EXPECT</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { icon: '💻', text: '24-hour coding marathon' },
                   { icon: '🏆', text: 'Prize pool of ₹25,000' },
                   { icon: '👨‍💼', text: 'Mentors from top tech companies' },
                   { icon: '🤝', text: 'Networking with 500+ students' }
                 ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">{item.icon}</div>
                       <span className="text-sm font-bold text-slate-700">{item.text}</span>
                    </div>
                 ))}
              </div>
           </section>

           <section>
              <h2 className="text-lg font-black text-slate-900 mb-6 tracking-wide">SCHEDULE</h2>
              <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-100">
                 {[
                   { time: '9:00 AM', event: 'Registration & Check-in' },
                   { time: '10:00 AM', event: 'Opening Ceremony & Problem Statements' },
                   { time: '11:00 AM', event: 'Hacking Begins' },
                   { time: '11:00 PM', event: 'Mid-point Review' },
                   { time: '10:00 AM (next day)', event: 'Submission Deadline' },
                   { time: '11:00 AM', event: 'Final Presentations' },
                   { time: '2:00 PM', event: 'Results & Prize Distribution' }
                 ].map((item, i) => (
                    <div key={i} className="flex items-start gap-5 relative">
                       <div className="w-4 h-4 bg-white border-4 border-[#7C3AED] rounded-full mt-0.5 relative z-10" />
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#7C3AED] leading-none uppercase">{item.time}</span>
                          <span className="text-sm font-bold text-slate-800 mt-1">{item.event}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           <section>
              <h2 className="text-lg font-black text-slate-900 mb-4 tracking-wide">ORGANIZER</h2>
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-slate-50 p-5 rounded-2xl border border-slate-100 gap-4">
                 <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" className="w-14 h-14 rounded-full object-cover shadow-md" alt="Arjun Mehta" />
                    <div>
                       <h3 className="font-bold text-slate-900">Arjun Mehta</h3>
                       <p className="text-xs text-slate-500 font-medium">Tech Club · Bennett University</p>
                       <p className="text-sm text-slate-700 mt-1 font-medium">Building things at Tech Club. Open Source enthusiast.</p>
                    </div>
                 </div>
                 <div className="relative">
                   <button 
                     onClick={() => isFollowing ? setShowUnfollowConfirm(true) : setIsFollowing(true)}
                     className={`px-5 py-2 text-sm font-bold shadow-sm transition-all duration-200 whitespace-nowrap flex items-center gap-1 ${
                       isFollowing 
                         ? 'bg-[#10B981] text-white border border-[#10B981] hover:bg-[#059669] rounded-full' 
                         : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 rounded-xl'
                     }`}
                   >
                     {isFollowing ? <><Check className="w-4 h-4" /> Following</> : 'Follow Organizer'}
                   </button>
                   {showUnfollowConfirm && (
                     <div className="absolute top-full mt-2 right-0 bg-slate-900 text-white p-3 rounded-lg shadow-xl z-20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                       <span className="text-sm font-medium whitespace-nowrap">Unfollow?</span>
                       <button onClick={() => { setIsFollowing(false); setShowUnfollowConfirm(false); }} className="text-xs font-bold text-red-400 hover:text-red-300">Yes</button>
                       <button onClick={() => setShowUnfollowConfirm(false)} className="text-xs font-bold text-slate-300 hover:text-white">Cancel</button>
                     </div>
                   )}
                 </div>
              </div>
           </section>
        </div>

        {/* Right Column (Sticky) */}
        <div className="lg:w-[35%]">
           <div className="sticky top-8 space-y-6">
              {/* Registration Card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#7C3AED] to-pink-500" />
                 <h3 className="font-black text-slate-900 text-xl mb-5">Registration details</h3>
                 <div className="space-y-4 mb-6">
                    {[
                      { icon: <Calendar className="w-4 h-4" />, label: 'Date', val: 'Apr 20, 2026' },
                      { icon: <Clock className="w-4 h-4" />, label: 'Time', val: '10:00 AM' },
                      { icon: <MapPin className="w-4 h-4" />, label: 'Venue', val: 'Bennett University, UP' },
                      { icon: <Users className="w-4 h-4" />, label: 'Seats', val: <div className="w-full flex items-center justify-end gap-2"><div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[68%]" /></div><span className="text-[#10B981] font-bold">340/500</span></div> },
                      { icon: <Tag className="w-4 h-4 text-[#7C3AED]" />, label: 'Fee', val: '₹199' }
                    ].map((row, i) => (
                       <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                             {row.icon} <span>{row.label}:</span>
                          </div>
                          <div className="text-sm font-bold text-slate-800 text-right">{row.val}</div>
                       </div>
                    ))}
                 </div>

                 {regState === 'idle' && (
                    <button onClick={() => setRegState('confirming')} className="w-full py-3.5 bg-gradient-to-r from-[#7C3AED] to-purple-500 hover:to-purple-600 text-white rounded-xl font-black text-[15px] shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition-all">
                       Register Now →
                    </button>
                 )}

                 {regState === 'confirming' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-slate-50 p-4 rounded-xl border border-purple-100">
                       <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2 text-center">Confirm Details</p>
                       <input type="text" readOnly value="John Doe" className="w-full bg-white border border-slate-200 text-sm font-bold p-2.5 rounded-lg mb-2 text-slate-600 outline-none" />
                       <input type="text" readOnly value="Naami College" className="w-full bg-white border border-slate-200 text-sm font-bold p-2.5 rounded-lg mb-2 text-slate-600 outline-none" />
                       <input type="text" readOnly value="john.doe@college.edu" className="w-full bg-white border border-slate-200 text-sm font-bold p-2.5 rounded-lg mb-4 text-slate-600 outline-none" />
                       
                       <div className="flex gap-2">
                          <button onClick={() => setRegState('idle')} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
                          <button onClick={() => setRegState('confirmed')} className="flex-[2] py-2.5 bg-[#7C3AED] text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-md">Confirm →</button>
                       </div>
                    </motion.div>
                 )}

                 {regState === 'confirmed' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                       <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mb-3 shadow-md">
                          <Check className="w-6 h-6" />
                       </div>
                       <h4 className="font-black text-green-800 text-lg mb-1">Registration Successful!</h4>
                       <p className="text-xs text-green-700 font-medium mb-4">Your e-pass has been sent to your email.</p>
                       <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=NAAMI-EVENT-${eventId}-123`} alt="QR Code" className="w-24 h-24 mix-blend-multiply mb-4" />
                       <button className="w-full py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-sm transition-colors cursor-pointer">View Pass</button>
                    </motion.div>
                 )}

                 <div className="mt-5 text-center">
                    <p className="text-xs font-bold text-red-500 mb-3 flex items-center justify-center gap-1.5 bg-red-50 py-1.5 rounded-lg border border-red-100">
                       <Clock className="w-3.5 h-3.5" /> Closes in {d}d {h}h {m}m {s}s
                    </p>
                    <button className="text-slate-500 text-xs font-bold hover:text-[#7C3AED] transition-colors inline-flex items-center gap-1.5">
                       <Bookmark className="w-3.5 h-3.5" /> Save Event
                    </button>
                 </div>
              </div>

              {/* Share Box */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                 <h4 className="font-bold text-slate-800 text-sm mb-3">Share this event</h4>
                 <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg hover:bg-slate-100 transition-colors shadow-sm" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                       <Copy className="w-3.5 h-3.5" /> Copy Link
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 text-xs font-bold py-2 rounded-lg hover:bg-[#1DA1F2]/20 transition-colors shadow-sm">
                       <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ────────────────────────────────────────────────────────
   MAIN PAGE SHELL
   ──────────────────────────────────────────────────────── */

export const DashboardV2 = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [collegePageData, setCollegePageData] = useState(null);
  const { eventId } = useParams();
  const location = useLocation();

  useEffect(() => {
    setCollegePageData(null);
  }, [location.pathname, activeTab]);

  useEffect(() => {
    const scrollContainer = document.getElementById('main-scroll-area');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab, eventId, collegePageData, location.search]);

  const renderPage = () => {
    if (collegePageData) return <CollegeEventsPage data={collegePageData} onClose={() => setCollegePageData(null)} />;
    if (eventId) return <EventDetailsPage eventId={eventId} />;

    switch(activeTab) {
      case 'feed': return <FeedPage />;
      case 'explore': return <ExplorePage setCollegePageData={setCollegePageData} />;
      case 'reels': return <ReelsPage />;
      case 'categories': return <CategoriesPage setActiveTab={setActiveTab} />;
      case 'my-events': return <MyEventsPage />;
      case 'notifications': return <NotificationsPage />;
      case 'messaging': return <MessagingPage setActiveTab={setActiveTab} />;
      case 'profile': return <ProfilePage />;
      default: return <FeedPage />;
    }
  };

  const isFullOverlay = !!eventId || !!collegePageData;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      {/* Visual background layers */}
      <ParticleBackground />

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        :root { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes ring-pulse {
          0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.2); }
          70% { box-shadow: 0 0 0 10px rgba(124, 58, 237, 0); }
          100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
        }
        .active-pulse {
          animation: ring-pulse 2s infinite;
        }
      `}} />

      <main className="relative z-10 max-w-[1536px] mx-auto h-screen flex gap-6 p-6">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-[280px] flex-shrink-0 h-full">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Center Panel (Page Renderer) */}
        <div id="main-scroll-area" className="flex-1 h-full overflow-y-auto no-scrollbar rounded-[2rem] bg-slate-50/50 border border-slate-100/50 shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={eventId || (collegePageData ? collegePageData.id : null) || activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={SPRING}
              className="min-h-full p-6"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Panel */}
        {!isFullOverlay && activeTab !== 'reels' && activeTab !== 'profile' && (
          <div className="hidden xl:block w-[340px] flex-shrink-0 h-full overflow-y-auto no-scrollbar">
             <RightPanel setCollegePageData={setCollegePageData} setActiveTab={setActiveTab} />
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardV2;








