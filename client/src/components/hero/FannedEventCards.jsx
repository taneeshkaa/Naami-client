import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────
   EVENT CARD DATA
───────────────────────────────────────── */
const eventCards = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop',
    accent: '#7C3AED',
    chipEmoji: '🖥️',
    chipLabel: 'Hackathon',
    title: 'Smart India Hackathon 2026',
    college: 'Govt. of India Initiative',
    date: 'Apr 18 · Pan India',
    prize: '🏆 ₹1,00,000',
    btnLabel: 'Register',
    // Card 1 (back)
    bottom: 0,
    left: 0,
    rotate: -6,
    rotateRange: [-6, -4, -6],
    zIndex: 1,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop',
    accent: '#EC4899',
    chipEmoji: '🎭',
    chipLabel: 'Cultural Fest',
    title: 'Mood Indigo 2026',
    college: 'IIT Bombay',
    date: 'Mar 22 · Mumbai',
    prize: '🎟️ Free Entry',
    btnLabel: 'Register',
    // Card 2 (middle)
    bottom: 30,
    left: 50,
    rotate: 2,
    rotateRange: [2, 4, 2],
    zIndex: 2,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop',
    accent: '#0D9488',
    chipEmoji: '🛠️',
    chipLabel: 'Workshop',
    title: 'UI/UX Design Bootcamp',
    college: 'BITS Pilani',
    date: 'Apr 5 · Pilani',
    prize: '💻 Certificate',
    btnLabel: 'Register',
    // Card 3 (front)
    bottom: 60,
    left: 90,
    rotate: -1,
    rotateRange: [-1, 1, -1],
    zIndex: 3,
  },
];

/* ─────────────────────────────────────────
   SINGLE EVENT CARD
───────────────────────────────────────── */
const EventCard = ({ card, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, rotate: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
        rotate: card.rotate,
        transition: { duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] },
      }}
      viewport={{ once: true }}
      animate={{
        rotate: card.rotateRange,
      }}
      transition={{
        rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: '0 25px 80px rgba(0,0,0,0.18)',
        zIndex: 10,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="absolute cursor-pointer"
      style={{
        bottom: card.bottom,
        left: card.left,
        width: 340,
        zIndex: hovered ? 10 : card.zIndex,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        borderLeft: `4px solid ${card.accent}`,
      }}
    >
      {/* Image Area */}
      <div className="relative" style={{ height: 160, overflow: 'hidden' }}>
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Category Chip */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white backdrop-blur-sm"
          style={{ backgroundColor: `${card.accent}dd` }}
        >
          <span>{card.chipEmoji}</span>
          <span>{card.chipLabel}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <h4 className="text-[15px] font-bold text-gray-900 leading-snug mb-1">
          {card.title}
        </h4>
        <p className="text-[12px] text-gray-500 font-medium mb-3">
          {card.college}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
              📅 {card.date}
            </span>
            <span className="text-[11px] font-bold text-gray-700">
              {card.prize}
            </span>
          </div>
          <button
            className="text-[11px] font-bold text-white px-4 py-1.5 rounded-full transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: card.accent }}
          >
            {card.btnLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   FANNED EVENT CARDS WRAPPER
───────────────────────────────────────── */
const FannedEventCards = () => {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative mx-auto"
      style={{ width: 480, height: 520 }}
    >
      {eventCards.map((card, index) => (
        <EventCard key={card.id} card={card} index={index} />
      ))}
    </motion.div>
  );
};

export default FannedEventCards;
