import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Network, MessageSquare, User, Calendar, MapPin, Wifi, Users, ChevronDown } from 'lucide-react';

// Mock team members data
const mockTeamMembers = [
  { id: 1, name: 'Arjun Patel', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', tags: ['Infrastructure', 'Policy Research'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
  { id: 2, name: 'Arjun Patel', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', tags: ['Infrastructure', 'Policy Research'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
  { id: 3, name: 'Arjun Patel', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', tags: ['Infrastructure', 'Policy Research'], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face' },
  { id: 4, name: 'Arjun Patel', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', tags: ['Infrastructure', 'Policy Research'], avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face' },
  { id: 5, name: 'Arjun Patel', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', tags: ['Infrastructure', 'Policy Research'], avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face' },
  { id: 6, name: 'Arjun Patel', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', tags: ['Infrastructure', 'Policy Research'], avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face' },
  { id: 7, name: 'Arjun Patel', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', tags: ['Infrastructure', 'Policy Research'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
  { id: 8, name: 'Arjun Patel', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', tags: ['Infrastructure', 'Policy Research'], avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face' },
];

const stats = [
  { label: 'Total Members', value: '09', icon: Users, color: 'text-slate-500' },
  { label: 'Online Now', value: '05', icon: Wifi, color: 'text-slate-500' },
  { label: 'Locations', value: '04', icon: MapPin, color: 'text-slate-500' },
  { label: 'Meetings Today', value: '12', icon: Calendar, color: 'text-slate-500' },
];

const TeamsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockTeamMembers.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-primary mb-1">Teams</h1>
          <p className="text-xs text-slate-400">Meet the dedicated team members working on your project</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-full py-2 pl-4 pr-9 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 w-48"
            />
            <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
          </div>

          {/* Sort */}
          <button className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider">
            <ArrowUpDown size={13} /> Sort
          </button>

          {/* Filter */}
          <button className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider">
            <SlidersHorizontal size={13} /> Filter
          </button>

          {/* Project Structure */}
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-xs font-bold hover:bg-primary-dark transition-colors uppercase tracking-wider">
            <Network size={13} /> Project Structure
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-slate-100 card-shadow rounded-xl px-6 py-5 flex justify-between items-center">
              <div>
                <div className="text-4xl font-bold text-slate-700 font-serif">{stat.value}</div>
                <div className="text-[11px] text-slate-400 mt-1">{stat.label}</div>
              </div>
              <Icon size={28} className={stat.color} strokeWidth={1.5} />
            </div>
          );
        })}
      </div>

      {/* Project Team Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">Project Team</h2>
        <span className="text-xs text-slate-400">{filtered.length} Members</span>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

const TeamMemberCard = ({ member }) => {
  return (
    <div className="bg-white border border-slate-100 card-shadow rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-all duration-200">
      {/* Avatar + Name + Status */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">{member.name}</span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="w-1 h-1 bg-emerald-500 rounded-full inline-block"></span>
              {member.status}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span>{member.role}</span>
            <span className="text-slate-200">•</span>
            <span>{member.exp}</span>
            <span className="text-slate-200">•</span>
            <span>{member.location}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {member.tags.map((tag, i) => (
          <span
            key={i}
            className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button className="flex-1 bg-primary hover:bg-primary-dark text-white text-[10px] font-bold py-1.5 rounded tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5">
          <MessageSquare size={11} /> Message
        </button>
        <button className="flex-1 border border-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded tracking-wider uppercase hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
          <User size={11} /> Profile
        </button>
        <button className="border border-slate-200 text-slate-500 p-1.5 rounded hover:bg-slate-50 transition-colors">
          <Calendar size={13} />
        </button>
      </div>
    </div>
  );
};

export default TeamsPage;
