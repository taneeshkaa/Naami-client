import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

export const LandingLayout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      smooth: true,
    });
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-textMain antialiased">
      {/* Navbar */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/70 backdrop-blur-md shadow-sm'
            : 'bg-transparent py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          {/* Logo & Left Corner */}
          <div className="flex items-center gap-4 flex-1">
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-md shadow-accent/20 group-hover:bg-violet-600 transition-colors"
              >
                <span className="text-white text-[13px] font-black tracking-tight">N</span>
              </motion.div>
              <span className={`text-[18px] font-black tracking-tight transition-colors ${scrolled ? 'text-textMain' : 'text-gray-900 group-hover:text-accent'}`}>
                Naami
              </span>
            </Link>
          </div>

          {/* Center Nav – desktop */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
            {['Features', 'Events', 'Organizers', 'Colleges', 'Guide'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="group relative text-[13px] font-semibold text-gray-500 transition-colors hover:text-accent"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </nav>

          {/* Right CTAs & Icons – desktop */}
          <div className="hidden md:flex items-center justify-end gap-3 flex-1">
            <Link
              to="/login"
              className="px-4 py-2 text-[13px] font-bold rounded-xl border border-gray-200 text-gray-700 hover:border-accent hover:text-accent transition-all duration-300"
            >
              Log in
            </Link>
            <Link 
              to="/signup"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 text-[13px] font-bold bg-gradient-to-r from-accent to-indigo-600 text-white rounded-xl shadow-[0_0_40px_rgba(124,58,237,0.25)] hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all duration-300"
              >
                Join Naami
              </motion.div>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white/50 hover:bg-gray-50 transition-colors shadow-sm`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <X className={`w-5 h-5 text-gray-900`} />
              : <Menu className={`w-5 h-5 text-gray-900`} />
            }
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100 bg-white px-5 pb-5 pt-4 flex flex-col gap-4 overflow-hidden"
            >
              {['Features', 'Events', 'Organizers', 'Colleges', 'Guide'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-[14px] font-medium text-gray-500 hover:text-textMain transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center w-full px-4 py-2 text-[13px] font-semibold border border-gray-200 rounded-[6px] hover:bg-gray-50 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-center w-full px-4 py-2 text-[13px] font-semibold bg-accent text-white rounded-[6px] hover:bg-violet-700 transition-colors">
                  Join Naami
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
