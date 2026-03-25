import React, { useState, useRef } from 'react';
import {
  Search, SlidersHorizontal, Inbox, CheckCircle2,
  Upload, ChevronDown
} from 'lucide-react';
import { useSubmitVendorReachOutMutation } from '../services/vendorApi';

// ─── Vendor-specific stat data ─────────────────────────────────────────────────
const stats = [
  {
    badge: '1 High priority', badgeColor: 'bg-primary/10 text-primary',
    value: '05', label: 'Open Tickets', icon: Inbox,
  },
  {
    badge: 'This quarter', badgeColor: 'bg-slate-100 text-slate-500',
    value: '08', label: 'Resolved Tickets', icon: CheckCircle2,
  },
];

const slaData = [
  { label: 'Low', color: 'bg-slate-400', time: '48 hrs' },
  { label: 'Medium', color: 'bg-amber-400', time: '24 hrs' },
  { label: 'High', color: 'bg-red-500', time: '8 hrs' },
  { label: 'Critical', color: 'bg-red-700', time: '2 hrs' },
];

const urgencyLevels = [
  { label: 'Low', color: 'bg-slate-300' },
  { label: 'Medium', color: 'bg-amber-400' },
  { label: 'High', color: 'bg-red-500' },
  { label: 'Critical', color: 'bg-red-700' },
];

// ─── Main Vendor Reach Out Page ────────────────────────────────────────────────
const VendorReachOut = () => {
  const [urgency, setUrgency] = useState('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Vendor-specific mutation — completely separate from client reach out
  const [submitTicket, { isLoading: isSubmitting }] = useSubmitVendorReachOutMutation();

  const handleSubmit = async () => {
    if (!subject || !category) {
      alert('Please fill in required fields.');
      return;
    }
    try {
      await submitTicket({ subject, category, urgency, description });
      alert('Vendor support ticket submitted successfully!');
      setSubject('');
      setCategory('');
      setDescription('');
      setUrgency('Medium');
    } catch {
      alert('Failed to submit ticket. Please try again.');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-primary mb-1">Reach Out</h1>
          <p className="text-xs text-slate-400">Need guidance? Your vendor manager is here to help.</p>
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
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white border border-slate-100 card-shadow rounded-xl px-6 py-5 flex justify-between items-start">
              <div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded mb-3 inline-block ${s.badgeColor}`}>
                  {s.badge}
                </span>
                <div className="font-bold text-slate-700 mb-1 text-4xl font-serif">
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
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Submit a Request</h2>
        <p className="text-xs text-slate-400 mb-6">Describe your issue and your vendor manager will respond promptly</p>

        <div className="bg-white border border-slate-100 card-shadow rounded-2xl p-8">
          <h3 className="text-sm font-bold text-slate-700 mb-1">New Vendor Support Request</h3>
          <p className="text-[10px] text-slate-400 mb-6">All fields marked * are required</p>

          <div className="mb-5">
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
                <option>Payment Dispute</option>
                <option>Contract Query</option>
                <option>Delivery Issue</option>
                <option>Technical Problem</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Subject <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary/20"
              placeholder="Brief subject of your request..."
            />
          </div>

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
                  <span className={`w-2.5 h-2.5 rounded-full ${u.color}`} />
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of your issue..."
              className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-xs text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

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
                &nbsp;or drag & drop files here
              </p>
              <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG, XLSX — max 20MB</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button className="text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider">
              Cancel
            </button>
            <button className="border border-slate-200 text-slate-600 text-xs font-bold px-5 py-2 rounded tracking-wider uppercase hover:bg-slate-50 transition-colors">
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-white text-xs font-bold px-5 py-2 rounded tracking-wider uppercase hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorReachOut;
