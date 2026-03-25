import React, { useState, useRef } from 'react';
import {
  Search, SlidersHorizontal, Ticket, Inbox, CheckCircle2,
  Clock, User, Mail, Phone, Video, AlertTriangle, Upload, ChevronDown
} from 'lucide-react';

// ─── Mock Stats ───────────────────────────────────────────────────────────────
const stats = [
  {
    badge: '2 High priority', badgeColor: 'bg-primary/10 text-primary',
    value: '09', label: 'Open Tickets', icon: Inbox,
  },
  {
    badge: 'This quarter', badgeColor: 'bg-slate-100 text-slate-500',
    value: '12', label: 'Resolved Tickets', icon: CheckCircle2,
  },
  {
    badge: 'SLA: 8 hrs', badgeColor: 'bg-slate-100 text-slate-500',
    value: '04 Hrs', label: 'Avg Response Time', icon: Clock,
  },
  {
    badge: '● Online', badgeColor: 'bg-emerald-50 text-emerald-600',
    value: 'Amith Shaw', label: 'Primary Contact', icon: User, isContact: true,
  },
];

const slaData = [
  { label: 'Low', color: 'bg-slate-400', time: '48 hrs' },
  { label: 'Medium', color: 'bg-amber-400', time: '24 hrs' },
  { label: 'High', color: 'bg-red-500', time: '8 hrs' },
  { label: 'Critical', color: 'bg-red-700', time: '1 hrs' },
];

const urgencyLevels = [
  { label: 'Low', color: 'bg-slate-300' },
  { label: 'Medium', color: 'bg-amber-400' },
  { label: 'High', color: 'bg-red-500' },
  { label: 'Critical', color: 'bg-red-700' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
const ReachOutPage = () => {
  const [urgency, setUrgency] = useState('Medium');
  const [subject, setSubject] = useState('Steering Committee');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [project, setProject] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-primary mb-1">Reach Out</h1>
          <p className="text-xs text-slate-400">Need guidance? We&apos;re here to resolve project issues quickly.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              className="bg-white border border-slate-200 rounded-full py-2 pl-4 pr-9 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 w-48"
            />
            <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
          </div>
          <button className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider">
            <SlidersHorizontal size={13} /> Filter
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-xs font-bold hover:bg-primary-dark transition-colors uppercase tracking-wider">
            <Ticket size={13} /> Ticket Tracker
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white border border-slate-100 card-shadow rounded-xl px-6 py-5 flex justify-between items-start">
              <div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded mb-3 inline-block ${s.badgeColor}`}>
                  {s.badge}
                </span>
                <div className={`font-bold text-slate-700 mb-1 ${s.isContact ? 'text-xl' : 'text-4xl font-serif'}`}>
                  {s.value}
                </div>
                <div className="text-[11px] text-slate-400">{s.label}</div>
              </div>
              <Icon size={22} className="text-slate-300 mt-1" strokeWidth={1.5} />
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-[1fr_320px] gap-8">
        {/* ── Left: Submit a Request Form ── */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Submit a Request</h2>
          <p className="text-xs text-slate-400 mb-6">Describe your issue and our team will respond promptly</p>

          <div className="bg-white border border-slate-100 card-shadow rounded-2xl p-8">
            <h3 className="text-sm font-bold text-slate-700 mb-1">New Support Request</h3>
            <p className="text-[10px] text-slate-400 mb-6">All fields marked are required</p>

            {/* Category + Project */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Issue Category <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-4 pr-8 text-xs text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">Select Category...</option>
                    <option>Technical Issue</option>
                    <option>Budget Query</option>
                    <option>Schedule Concern</option>
                    <option>Vendor Issue</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Project <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-4 pr-8 text-xs text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/20 appearance-none"
                  >
                    <option value="">Select Project...</option>
                    <option>ERP Migration</option>
                    <option>UAT Phase</option>
                    <option>Go-Live</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Subject <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Urgency Level */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                Urgency level <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {urgencyLevels.map((u) => (
                  <button
                    key={u.label}
                    onClick={() => setUrgency(u.label)}
                    className={`flex flex-col items-center gap-2 py-3 rounded-lg border transition-all text-xs font-bold
                      ${urgency === u.label
                        ? 'border-primary/20 bg-primary/5 text-primary'
                        : 'border-slate-100 bg-white text-slate-400 hover:bg-slate-50'
                      }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${u.color}`}></span>
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a Detailed Description of the Issue..."
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-xs text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Attachments */}
            <div className="mb-8">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Attachments
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl py-8 px-6 flex flex-col items-center justify-center cursor-pointer transition-colors
                  ${dragging ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/40'}`}
              >
                <input ref={fileInputRef} type="file" multiple className="hidden" accept=".pdf,.png,.jpg,.xlsx" />
                <Upload size={20} className="text-slate-300 mb-2" />
                <p className="text-xs text-slate-500">
                  <span className="text-primary font-bold cursor-pointer">Click to upload</span>
                  &nbsp;or drag & drop files here PDF, PNG, JP
                </p>
                <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG, XLSX — max 20MB</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3">
              <button className="text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider">
                Cancel
              </button>
              <button className="border border-slate-200 text-slate-600 text-xs font-bold px-5 py-2 rounded tracking-wider uppercase hover:bg-slate-50 transition-colors">
                Save Draft
              </button>
              <button className="bg-primary text-white text-xs font-bold px-5 py-2 rounded tracking-wider uppercase hover:bg-primary-dark transition-colors">
                Submit Request
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Support Contact ── */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Your Support Contact</h2>
          <p className="text-xs text-slate-400 mb-6">Direct line to your engagement team</p>

          <div className="bg-white border border-slate-100 card-shadow rounded-2xl p-6 flex flex-col gap-6">
            {/* Assigned Consultant */}
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-4">Assigned Consultant</p>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                  alt="Arjun Patel"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">Arjun Patel</span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Online
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>Policy Analyst</span>
                    <span>•</span>
                    <span>4 Years Exp</span>
                    <span>•</span>
                    <span>Mumbai</span>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
                    <a href="mailto:amit.sharma@primus.com" className="text-xs text-primary hover:underline">
                      amit.sharma@primus.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                    <p className="text-xs text-slate-700">+1 (261) 555-0194</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button className="w-full bg-primary text-white text-xs font-bold py-2.5 rounded-lg tracking-wider uppercase hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                <Video size={13} /> Schedule a Meeting
              </button>
              <button className="w-full border border-primary text-primary text-xs font-bold py-2.5 rounded-lg tracking-wider uppercase hover:bg-primary/5 transition-colors">
                Escalate Issue
              </button>
            </div>

            {/* Response SLA */}
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Response SLA</p>
              <div className="space-y-2.5">
                {slaData.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${s.color}`}></span>
                      <span className="text-xs text-slate-600">{s.label}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReachOutPage;
