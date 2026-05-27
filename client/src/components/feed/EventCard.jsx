import React from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EventCard = ({ event }) => {
  if (!event) return null;

  const {
    author = {},
    title = 'Untitled Event',
    imageUrl,
    description = '',
    aspect = 'square',
    isRegistered = false,
  } = event;

  const { name: authorName = '', username: authorUsername = 'unknown', avatarUrl: authorAvatar } = author;

  const imageAspectClass = aspect === 'portrait' ? 'aspect-[4/5]' : 'aspect-square';

  return (
    <div className="bg-white border-b border-gray-200 pb-4 mb-2 md:border md:border-gray-200 md:rounded-lg md:mb-6 md:pb-0">
      {/* Header */}
      <div className="flex items-center p-3 md:p-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden flex-shrink-0">
          {authorAvatar ? (
            <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
              {authorName?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <Link to={`/${authorUsername}`} className="font-semibold text-sm hover:underline hover:text-textMain truncate">
          {authorUsername}
        </Link>
      </div>

      {/* Media */}
      <div className={`w-full bg-gray-100 relative ${imageAspectClass}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-sm tracking-wide">No Image</span>
          </div>
        )}
      </div>

      {/* Interaction Bar & Registration */}
      <div className="p-3 md:p-4">
        <div className="flex flex-col space-y-3 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button aria-label="Like" className="hover:text-gray-500 transition-colors"><Heart className="w-6 h-6" strokeWidth={1.5} /></button>
              <button aria-label="Comment" className="hover:text-gray-500 transition-colors"><MessageCircle className="w-6 h-6" strokeWidth={1.5} /></button>
              <button aria-label="Share" className="hover:text-gray-500 transition-colors"><Send className="w-6 h-6" strokeWidth={1.5} /></button>
            </div>
            <button aria-label="Save" className="hover:text-gray-500 transition-colors"><Bookmark className="w-6 h-6" strokeWidth={1.5} /></button>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm truncate mr-3">{title}</span>
            <button
              className={`px-5 py-1.5 rounded font-semibold text-sm transition-opacity hover:opacity-90 flex-shrink-0 ${
                isRegistered ? 'bg-gray-100 text-textMain border border-gray-200' : 'bg-accent text-white'
              }`}
            >
              {isRegistered ? 'Registered' : 'Register'}
            </button>
          </div>
        </div>

        {description && (
          <p className="text-sm">
            <span className="font-semibold mr-2">{authorUsername}</span>
            {description}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2 uppercase tracking-wider font-medium">2 days ago</p>
      </div>
    </div>
  );
};
