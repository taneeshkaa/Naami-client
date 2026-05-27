import React from 'react';
import { BadgeCheck, Link as LinkIcon, UserPlus, Users } from 'lucide-react';

export const ProfileHeader = ({ profile }) => {
  if (!profile) return null;

  const {
    name = 'Unknown',
    username = 'unknown',
    isVerified = false,
    avatarUrl,
    stats = { posts: 0, followers: 0, following: 0 },
    bio = '',
    category = '',
    link,
    isOwnProfile = true,
    isConnected = false,
    mutuals = 0,
  } = profile;

  const { posts = 0, followers = 0, following = 0 } = stats || {};

  return (
    <div className="p-4 md:p-6 pb-4 border-b border-gray-100 bg-white">
      {/* Top Bar (Mobile Username) */}
      <div className="flex items-center space-x-1 mb-4 md:hidden">
        <h2 className="text-xl font-bold text-slate-900">{username}</h2>
        {isVerified && <BadgeCheck className="w-5 h-5 text-[#7C3AED]" />}
      </div>

      <div className="flex items-center gap-6 md:gap-10 mb-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-slate-100 border-2 border-slate-100 overflow-hidden shadow-sm">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-3xl font-light">
                {name?.charAt(0) || '?'}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-1 justify-around md:justify-start md:space-x-8 text-center pt-2">
          <div className="flex flex-col items-center">
            <span className="font-black text-lg md:text-xl text-slate-900">{posts}</span>
            <span className="text-[13px] text-slate-500 font-medium">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-black text-lg md:text-xl text-slate-900">{followers}</span>
            <span className="text-[13px] text-slate-500 font-medium">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-black text-lg md:text-xl text-slate-900">{following}</span>
            <span className="text-[13px] text-slate-500 font-medium">Following</span>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-4">
        <div className="hidden md:flex items-center space-x-1 mb-1">
          <h1 className="font-black text-[17px] text-slate-900">{name}</h1>
          {isVerified && <BadgeCheck className="w-4 h-4 text-[#7C3AED] mt-0.5" />}
        </div>

        {category && <p className="text-[13px] font-bold text-slate-400 mb-1">{category}</p>}
        {bio && <p className="text-[14px] whitespace-pre-wrap leading-tight text-slate-700 max-w-xl font-medium mt-2">{bio}</p>}
        
        {/* Mutuals info for non-own profile */}
        {!isOwnProfile && mutuals > 0 && (
          <div className="flex items-center gap-1.5 mt-3 text-[13px] text-slate-500 font-medium">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{mutuals} mutual connections</span>
          </div>
        )}

        {link?.url && (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7C3AED] text-[13px] font-bold flex items-center mt-3 hover:underline w-fit"
          >
            <LinkIcon className="w-3.5 h-3.5 mr-1" />
            {link.label || link.url}
          </a>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-5">
        {isOwnProfile ? (
          <button className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-lg text-sm transition-colors border border-slate-200">
            Edit profile
          </button>
        ) : (
          <>
            <button className={`flex-1 py-1.5 font-bold rounded-lg text-sm transition-colors flex justify-center items-center gap-1 ${isConnected ? 'bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200' : 'bg-[#7C3AED] text-white hover:bg-purple-700'}`}>
              {isConnected ? 'Connected' : <><UserPlus className="w-4 h-4" /> Connect</>}
            </button>
            <button className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 font-bold rounded-lg text-sm transition-colors">
              Message
            </button>
          </>
        )}
      </div>
    </div>
  );
};
