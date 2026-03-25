import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Network, MessageSquare, User, Calendar, MapPin, Wifi, Users, ChevronDown } from 'lucide-react';

const mockTeamMembers = [
  { id: 1, name: 'Sinha', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop' },
  { id: 2, name: 'Albert Thomas', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop' },
  { id: 3, name: 'Kayanthi', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Offline', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop' },
  { id: 4, name: 'Rihanna', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop' },
  { id: 5, name: 'Mithun Raj', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop' },
  { id: 6, name: 'Poovarasan', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Offline', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=300&fit=crop' },
  { id: 7, name: 'Sanjana', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Online', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop' },
  { id: 8, name: 'Suhasini', role: 'Policy Analyst', exp: '4 Years Exp', location: 'Mumbai', status: 'Offline', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop' },
];

const stats = [
  { label: 'Total Members', value: '09', icon: Users, color: 'text-[#7B2C34]' },
  { label: 'Online Now', value: '05', icon: Wifi, color: 'text-[#7B2C34]' },
  { label: 'Locations', value: '04', icon: MapPin, color: 'text-[#7B2C34]' },
  { label: 'Meetings Today', value: '12', icon: Calendar, color: 'text-[#7B2C34]' },
];

const TeamsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockTeamMembers.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto pb-12 px-2 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-5xl font-serif font-bold text-primary mb-2">Teams</h1>
          <p className="text-xs text-slate-400 font-medium">Meet the dedicated team members working on your project</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-full py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 w-64 shadow-sm"
            />
            <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <button className="flex items-center gap-2 border border-slate-200 bg-white px-5 py-2.5 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest shadow-sm">
            <ArrowUpDown size={13} /> SORT
          </button>
          <button className="flex items-center gap-2 border border-slate-200 bg-white px-5 py-2.5 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest shadow-sm">
            <SlidersHorizontal size={13} /> FILTER
          </button>
          <button className="flex items-center gap-2 border border-slate-200 bg-white px-5 py-2.5 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest shadow-sm">
            PROJECT STRUCTURE
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-slate-100 card-shadow rounded-2xl p-6 flex justify-between items-center group hover:shadow-lg transition-all duration-300">
              <div>
                <div className="text-4xl font-bold text-slate-800 font-serif mb-1">{stat.value}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-[#7B2C34]/5 transition-colors">
                <Icon size={24} className={stat.color} strokeWidth={1.5} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Team Section */}
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-xl font-bold text-slate-800">Project Team</h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filtered.length} Members</span>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

const TeamMemberCard = ({ member }) => {
  return (
    <div className="bg-white border border-slate-100 card-shadow rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
      {/* Cover Image */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span className="text-lg font-bold text-slate-800">{member.name}</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${member.status === 'Online'
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
            : 'bg-slate-50 text-slate-400 border-slate-100'
            }`}>
            <span className={`w-1 h-1 rounded-full ${member.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
            {member.status}
          </span>
        </div>

        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-6">
          {member.role} &nbsp; • &nbsp; {member.exp} &nbsp; • &nbsp; {member.location}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full">
          <button className="flex-1 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold py-2.5 rounded-lg tracking-widest uppercase transition-all shadow-md shadow-primary/10">
            MESSAGE
          </button>
          <button className="flex-1 border border-slate-200 text-slate-600 text-[10px] font-bold py-2.5 rounded-lg tracking-widest uppercase hover:bg-slate-50 transition-all">
            PROFILE
          </button>
          <button className="border border-slate-200 text-slate-400 p-2.5 rounded-lg hover:border-primary/30 hover:text-primary transition-all">
            <Calendar size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
