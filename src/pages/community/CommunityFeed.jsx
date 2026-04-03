import React, { useState } from 'react';
import { Heart, Share2, Award, Search } from 'lucide-react';

export default function CommunityFeed() {
  const [feed, setFeed] = useState([
    { id: 1, name: 'Anonymous Hero', bloodGroup: 'O-', city: 'Mumbai', time: '2 mins ago', likes: 12, liked: false, badge: 'Hero' },
    { id: 2, name: 'Priya K.', bloodGroup: 'A+', city: 'New Delhi', time: '1 hr ago', likes: 45, liked: true, badge: 'Regular' },
    { id: 3, name: 'Rahul S.', bloodGroup: 'B-', city: 'Bangalore', time: '5 hrs ago', likes: 8, liked: false, badge: 'Beginner' }
  ]);

  const toggleHeart = (id) => {
    setFeed(feed.map(post => {
      if (post.id === id) {
        return { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 };
      }
      return post;
    }));
  };

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'Hero': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Regular': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header & Leaderboard */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Blood Heroes Wall</h1>
        <p className="text-gray-500 mt-2 text-lg">Celebrate the real heroes of our community.</p>
      </div>

      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-8 text-white shadow-xl shadow-red-500/20 mb-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-20"><Award className="w-48 h-48"/></div>
         <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Award /> Top Donors This Week</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {[1, 2, 3].map((pos) => (
                <div key={pos} className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl min-w-[200px] text-center">
                   <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-red-lifelink font-black text-2xl shadow-inner mb-3">
                     #{pos}
                   </div>
                   <div className="font-bold text-lg">Donor_{Math.floor(Math.random() * 1000)}</div>
                   <div className="text-sm opacity-90">5 Donations</div>
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* Feed Area */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl text-gray-900">Recent Donations</h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search city..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-full text-sm bg-gray-50 focus:ring-2 focus:ring-red-lifelink focus:bg-white" />
        </div>
      </div>
      
      <div className="space-y-6">
        {feed.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
            {/* Blood Drop Graphics */}
            <div className="hidden sm:flex flex-col items-center justify-center w-24 h-24 bg-red-50 rounded-2xl shrink-0 border border-red-100">
               <span className="font-black text-3xl text-red-lifelink">{post.bloodGroup}</span>
            </div>
            
            <div className="flex-grow">
               <div className="flex justify-between items-start mb-2">
                 <div>
                   <h4 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                     {post.name} 
                     <span className={`text-xs px-2 py-0.5 rounded-full border ${getBadgeColor(post.badge)}`}>
                       {post.badge}
                     </span>
                   </h4>
                   <p className="text-sm text-gray-500 font-medium">{post.city} • Saved a life {post.time}</p>
                 </div>
               </div>
               
               <p className="text-gray-700 italic mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm">
                 "I donated blood today! Be a hero and download LifeLink."
               </p>

               {/* Action Bar */}
               <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                 <button 
                  onClick={() => toggleHeart(post.id)}
                  className={`flex items-center gap-2 font-bold transition-colors ${post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                 >
                   <Heart className={`w-5 h-5 ${post.liked ? 'fill-red-500' : ''}`} /> {post.likes} Appreciations
                 </button>
                 <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 font-bold transition-colors">
                   <Share2 className="w-5 h-5" /> Share
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <button className="bg-white border-2 border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full hover:border-red-lifelink hover:text-red-lifelink transition-colors">
          Load More Heroes
        </button>
      </div>
    </div>
  );
}
