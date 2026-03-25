import React, { useState } from 'react';
import { Search, SlidersHorizontal, Clock, Video, Users, MapPin, ChevronLeft, ChevronRight, CalendarDays, Plus } from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const avatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=40&h=40&fit=crop&crop=face',
];

const upcomingMeetings = [
  {
    id: 1, type: 'Steering Committee', label: 'Upcoming Meeting',
    title: 'Project Steering Committee',
    date: '16 March', time: '10:00 am', duration: '60 mins', mode: 'Zoom', participants: 5,
    avatars: avatars.slice(0, 3),
  },
  {
    id: 2, type: 'Workshop', label: 'Upcoming Meeting',
    title: 'Digital Strategy Workshop',
    date: '16 March', time: '10:00 am', duration: '60 mins', mode: 'Office', participants: 8,
    avatars: avatars.slice(1, 5),
  },
  {
    id: 3, type: 'Steering Committee', label: 'Upcoming Meeting',
    title: 'Vendor Sync — Legal Review',
    date: '16 March', time: '10:00 am', duration: '60 mins', mode: 'Zoom', participants: 5,
    avatars: avatars.slice(0, 3),
  },
  {
    id: 4, type: 'Workshop', label: 'Upcoming Meeting',
    title: 'Weekly Project Review',
    date: '16 March', time: '10:00 am', duration: '60 mins', mode: 'Zoom', participants: 9,
    avatars: avatars.slice(2, 5),
  },
];

// ─── Mini Calendar ────────────────────────────────────────────────────────────
const MiniCalendar = () => {
  const [month, setMonth] = useState(1); // February (0-indexed)
  const [year] = useState(2026);
  const today = 12;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, prev: true });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i });
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, next: true });

  return (
    <div className="bg-white border border-slate-100 card-shadow rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setMonth(m => m - 1)} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
          <ChevronLeft size={16} className="text-slate-500" />
        </button>
        <h3 className="text-base font-bold text-slate-800">{monthNames[month]}</h3>
        <button onClick={() => setMonth(m => m + 1)} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => (
          <button
            key={i}
            className={`text-center text-xs py-1.5 rounded-lg transition-colors
              ${cell.prev || cell.next ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-50'}
              ${cell.day === today && !cell.prev && !cell.next ? 'bg-primary text-white font-bold hover:bg-primary' : ''}
            `}
          >
            {cell.day}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Meeting Card ─────────────────────────────────────────────────────────────
const MeetingCard = ({ meeting }) => {
  const typeColors = {
    'Steering Committee': 'bg-rose-50 text-rose-700',
    'Workshop': 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="bg-white border border-slate-100 card-shadow rounded-xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Badges */}
      <div className="flex items-center justify-between">
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${typeColors[meeting.type] || 'bg-slate-100 text-slate-500'}`}>
          {meeting.type}
        </span>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 flex items-center gap-1">
          <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
          {meeting.label}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-slate-800 leading-snug">{meeting.title}</h4>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><CalendarDays size={10} />{meeting.date}</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Clock size={10} />{meeting.time}</span>
        <span>•</span>
        <span>{meeting.duration}</span>
        <span>•</span>
        <span className="flex items-center gap-1"><MapPin size={10} />{meeting.mode}</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Users size={10} />{meeting.participants} Participants</span>
      </div>

      {/* Avatars */}
      <div className="flex -space-x-2">
        {meeting.avatars.map((src, i) => (
          <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
        ))}
        {meeting.participants > meeting.avatars.length && (
          <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
            +{meeting.participants - meeting.avatars.length}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded tracking-wider uppercase hover:bg-primary-dark transition-colors">
          JOIN
        </button>
        <button className="border border-slate-200 text-slate-600 text-[10px] font-bold px-4 py-1.5 rounded tracking-wider uppercase hover:bg-slate-50 transition-colors">
          AGENDA
        </button>
        <button className="ml-auto text-[10px] text-slate-400 hover:text-primary transition-colors font-medium">
          RESCHEDULE
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MeetingsPage = () => {
  const [timeLeft] = useState('10:00:00');

  const agenda = [
    'Review milestone progress against Q1 targets',
    'Budget update — revised forecasts and variances',
    'Risk assessment and mitigation priorities',
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-primary mb-1">Meetings</h1>
          <p className="text-xs text-slate-400">Manage and schedule project meetings</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search meeting..."
              className="bg-white border border-slate-200 rounded-full py-2 pl-4 pr-9 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 w-48"
            />
            <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
          </div>
          <button className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider">
            <SlidersHorizontal size={13} /> Filter
          </button>
          <button className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider">
            History
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-xs font-bold hover:bg-primary-dark transition-colors uppercase tracking-wider">
            <Plus size={13} /> New Meeting
          </button>
        </div>
      </div>

      {/* Next Meeting Banner */}
      <div className="bg-white border border-slate-100 card-shadow rounded-2xl p-8 mb-10">
        <div className="flex gap-12">
          {/* Left: Details */}
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Next Meeting
            </span>

            <h2 className="text-2xl font-bold text-slate-800 mb-3">Project Steering Committee</h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 mb-6">
              <span>8 March</span>
              <span>•</span>
              <span>10:00 am</span>
              <span>•</span>
              <span>60 mins</span>
              <span>•</span>
              <span>Zoom</span>
              <span>•</span>
              <span>8 Participants</span>
            </div>

            <div className="mb-6">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Agenda</p>
              <ul className="space-y-2">
                {agenda.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-primary text-white text-[10px] font-bold px-6 py-2 rounded tracking-wider uppercase hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Video size={12} /> JOIN MEETING
              </button>
              <button className="border border-slate-200 text-slate-600 text-[10px] font-bold px-6 py-2 rounded tracking-wider uppercase hover:bg-slate-50 transition-colors">
                AGENDA
              </button>
            </div>
          </div>

          {/* Right: Participants + Countdown */}
          <div className="flex flex-col items-end justify-between min-w-[200px]">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 mb-3">Participants</p>
              <div className="flex -space-x-2 justify-end mb-2">
                {avatars.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <p className="text-[10px] text-slate-400">Arjun, Vaibhie Anhali, Sarah</p>
              <p className="text-[10px] text-slate-400">& 3 others</p>
            </div>

            <div className="bg-primary text-white text-center rounded-xl px-8 py-4 mt-6">
              <p className="text-[9px] uppercase tracking-widest font-bold opacity-80 mb-1">STARTS IN</p>
              <p className="text-xl font-bold font-serif tracking-wider">{timeLeft}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar + Upcoming Meetings */}
      <div className="grid grid-cols-[280px_1fr] gap-8">
        {/* Calendar */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Calendar</h2>
          <MiniCalendar />
        </div>

        {/* Upcoming Meetings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Upcoming Meetings</h2>
            <span className="text-xs text-slate-400 font-medium">12 Feb, 2026</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {upcomingMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingsPage;
