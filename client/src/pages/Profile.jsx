import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { NavTabs } from '../components/profile/NavTabs';
import { BranchHeader } from '../components/shared/BranchHeader';

const MOCK_USERS_DATA = {
  'my-profile': {
    name: 'Cultural Society',
    username: 'culturalsoc_naami',
    isOwnProfile: true,
    isVerified: true,
    avatarUrl: '',
    category: 'College Club',
    bio: 'The official cultural society. \nOrganizing the biggest fests on campus. 🎉',
    link: { label: 'linktr.ee/culturalsoc', url: '#' },
    stats: { posts: 12, followers: 1450, following: 3 }
  },
  'arjun-mehta': {
    name: 'Arjun Mehta',
    username: 'arjun_mehta',
    isOwnProfile: false,
    isConnected: false,
    mutuals: 4,
    isVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    category: 'Student · IIT Bombay',
    bio: 'Building things at Tech Club. \nOpen Source enthusiast.',
    stats: { posts: 4, followers: 320, following: 154 }
  },
  'isha-kapoor': {
    name: 'Isha Kapoor',
    username: 'isha_kapoor',
    isOwnProfile: false,
    isConnected: true,
    mutuals: 12,
    isVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    category: 'Student · BITS Pilani',
    bio: 'E-Cell. \nBuilding EdTech startup.',
    stats: { posts: 15, followers: 890, following: 400 }
  },
  'rohan-verma': {
    name: 'Rohan Verma',
    username: 'rohan_verma',
    isOwnProfile: false,
    isConnected: false,
    mutuals: 1,
    isVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    category: 'Student · DTU',
    bio: 'UI/UX Design. \nCoding Club DTU.',
    stats: { posts: 8, followers: 210, following: 120 }
  },
  'meera-nair': {
    name: 'Meera Nair',
    username: 'meera_nair',
    isOwnProfile: false,
    isConnected: false,
    mutuals: 0,
    isVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    category: 'Student · NIT Trichy',
    bio: 'Cultural Society. \nDancer.',
    stats: { posts: 22, followers: 1200, following: 300 }
  },
  'dev-sharma': {
    name: 'Dev Sharma',
    username: 'dev_sharma',
    isOwnProfile: false,
    isConnected: false,
    mutuals: 5,
    isVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face',
    category: 'Student · NSUT',
    bio: 'Robotics. \nRoboClub NSUT.',
    stats: { posts: 6, followers: 180, following: 95 }
  },
  'tanvi-reddy': {
    name: 'Tanvi Reddy',
    username: 'tanvi_reddy',
    isOwnProfile: false,
    isConnected: false,
    mutuals: 8,
    isVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face',
    category: 'Student · VIT Vellore',
    bio: 'Photography Club. \nCapturing moments.',
    stats: { posts: 45, followers: 2300, following: 500 }
  },
  'kabir-singh': {
    name: 'Kabir Singh',
    username: 'kabir_singh',
    isOwnProfile: false,
    isConnected: true,
    mutuals: 2,
    isVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    category: 'Student · IIT Delhi',
    bio: 'E-Cell. \nProduct Design.',
    stats: { posts: 11, followers: 450, following: 200 }
  },
  'ananya-roy': {
    name: 'Ananya Roy',
    username: 'ananya_roy',
    isOwnProfile: false,
    isConnected: false,
    mutuals: 15,
    isVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    category: 'Student · IIT Bombay',
    bio: 'DevClub. \nReact & WebSockets.',
    stats: { posts: 9, followers: 600, following: 350 }
  },
  'sneha-joshi': {
    name: 'Sneha Joshi',
    username: 'sneha_joshi',
    isOwnProfile: false,
    isConnected: false,
    mutuals: 0,
    isVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    category: 'Student · Manipal',
    bio: 'Drama Club. \nTheatre enthusiast.',
    stats: { posts: 14, followers: 340, following: 120 }
  },
  'priya-mehta': {
    name: 'Priya Mehta',
    username: 'priya_mehta',
    isOwnProfile: false,
    isConnected: true,
    mutuals: 6,
    isVerified: false,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    category: 'Student · BITS Pilani',
    bio: 'Finance Club. \nResearch & Investing.',
    stats: { posts: 7, followers: 280, following: 140 }
  },
};

export const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  
  const query = username || 'my-profile';
  const profileData = MOCK_USERS_DATA[query] || {
    name: username.replace('-', ' '),
    username: username,
    isOwnProfile: false,
    isConnected: false,
    mutuals: 0,
    isVerified: false,
    avatarUrl: '',
    category: 'Student',
    bio: 'Welcome to my profile!',
    stats: { posts: 0, followers: 0, following: 0 }
  };

  const MOCK_BREADCRUMBS = [
    { label: 'Naami College', path: '/' },
    { label: profileData.name, path: `/${username || 'profile'}` }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <BranchHeader breadcrumbs={MOCK_BREADCRUMBS} />
      <ProfileHeader profile={profileData} />
      <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 p-4 bg-gray-50/50">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
               <div key={i} className="aspect-square bg-gray-200">
                  {profileData.avatarUrl && <img src={profileData.avatarUrl} alt="post" className="w-full h-full object-cover opacity-50" />}
               </div>
            ))}
          </div>
        )}
        {activeTab === 'upcoming' && (
           <div className="flex flex-col">
             <div className="text-center p-8 text-gray-500 font-medium tracking-wide text-sm">No upcoming events.</div>
           </div>
        )}
        {activeTab === 'archive' && (
           <div className="flex flex-col opacity-75">
              <div className="text-center p-8 text-gray-500 font-medium tracking-wide text-sm">Archive is empty.</div>
           </div>
        )}
      </div>
    </div>
  );
};
