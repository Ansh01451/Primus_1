import React, { useState, useRef } from 'react';
import { Search, SlidersHorizontal, Star, Upload, ChevronDown, MessageSquare, BarChart2, CheckCircle } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const stats = [
  { value: '120', label: 'Total Feedback', icon: MessageSquare },
  { value: '4.6', label: 'Average Rating', icon: BarChart2 },
  { value: '24', label: 'Resolved', icon: CheckCircle },
];

const ratingDimensions = [
  { key: 'communication', label: 'Communication' },
  { key: 'expertise', label: 'Expertise' },
  { key: 'timeliness', label: 'Timeliness' },
  { key: 'overall', label: 'Overall Satisfaction' },
];

const categories = ['Delivery Quality', 'Communication', 'Technical Support', 'Project Management', 'Other'];
const projects = ['ERP Migration', 'UAT Phase', 'Go-Live', 'Digital Strategy'];
const members = ['Arjun Patel', 'Mani Roy', 'Sophia', 'PA Ranjith', 'James'];
const visibilityOptions = ['Internal Team', 'Project Manager', 'All Stakeholders', 'Private'];

// ─── Star Rating Component ────────────────────────────────────────────────────
const StarRating = ({ value, onChange, label }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        {label} <span className="text-slate-300">{value}/5</span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={22}
              className={`transition-colors ${
                star <= (hovered || value)
                  ? 'fill-primary text-primary'
                  : 'text-slate-200 fill-slate-100'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Select Component ─────────────────────────────────────────────────────────
const Select = ({ label, options, value, onChange, required }) => (
  <div className="flex-1">
    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-4 pr-8 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer"
      >
        <option value="">Select {label}...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const FeedbackPage = () => {
  const [ratings, setRatings] = useState({ communication: 0, expertise: 5, timeliness: 0, overall: 0 });
  const [category, setCategory] = useState('');
  const [project, setProject] = useState('');
  const [member, setMember] = useState('');
  const [visibility, setVisibility] = useState('Internal Team');
  const [feedbackText, setFeedbackText] = useState('');
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handleRating = (dimension, val) => {
    setRatings((prev) => ({ ...prev, [dimension]: val }));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const handleSubmit = () => {
    if (!category || !project || !member) {
      alert('Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    // Reset form
    setCategory('');
    setProject('');
    setMember('');
    setVisibility('Internal Team');
    setFeedbackText('');
    setFiles([]);
    setRatings({ communication: 0, expertise: 0, timeliness: 0, overall: 0 });
  };

  const handleSaveDraft = () => {
    console.log('Draft saved', { category, project, member, visibility, ratings, feedbackText });
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-primary mb-1">Share Your Feedback</h1>
          <p className="text-xs text-slate-400">Your insights help improve the consulting experience and project outcomes.</p>
        </div>
        <button className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider">
          <SlidersHorizontal size={13} /> Filter
        </button>
      </div>

      {/* Success Toast */}
      {submitted && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-5 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-500" />
          Your feedback has been submitted successfully!
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white border border-slate-100 card-shadow rounded-xl px-6 py-5 flex justify-between items-center">
              <div>
                <div className="text-4xl font-bold font-serif text-slate-700 mb-0.5">{s.value}</div>
                <div className="text-[11px] text-slate-400">{s.label}</div>
              </div>
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-slate-300" strokeWidth={1.5} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-100 card-shadow rounded-2xl p-8">
        <h2 className="text-base font-bold text-slate-800 mb-1">Submit New Feedback</h2>
        <p className="text-xs text-slate-400 mb-8">Rate your consulting experience across multiple dimensions</p>

        {/* Row 1: Category + Project */}
        <div className="flex gap-6 mb-5">
          <Select label="Feedback Category" options={categories} value={category} onChange={setCategory} required />
          <Select label="Project" options={projects} value={project} onChange={setProject} required />
        </div>

        {/* Row 2: Team Member + Visibility */}
        <div className="flex gap-6 mb-8">
          <Select label="Team Member" options={members} value={member} onChange={setMember} required />
          <Select label="Visibility" options={visibilityOptions} value={visibility} onChange={setVisibility} />
        </div>

        {/* Star Ratings */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-4">Rate Your Experience</p>
          <div className="grid grid-cols-4 divide-x divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {ratingDimensions.map((dim) => (
              <div key={dim.key} className="py-5 px-4 flex items-center justify-center hover:bg-slate-50 transition-colors">
                <StarRating
                  label={dim.label}
                  value={ratings[dim.key]}
                  onChange={(val) => handleRating(dim.key, val)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div className="mb-6">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Your Feedback
          </label>
          <textarea
            rows={5}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Provide a Detailed Description of the Issue..."
            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
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
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl py-10 px-6 flex flex-col items-center justify-center cursor-pointer transition-all
              ${dragging ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/40 hover:bg-slate-50/50'}`}
          >
            <input ref={fileInputRef} type="file" multiple className="hidden" accept=".pdf,.png,.jpg,.xlsx" onChange={handleFileSelect} />
            <Upload size={22} className="text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">
              <span className="text-primary font-bold cursor-pointer hover:underline">Click to upload</span>
              &nbsp;or drag & drop files here PDF, PNG, JP
            </p>
            <p className="text-[11px] text-slate-400 mt-1">PDF, PNG, JPG, XLSX — max 20MB</p>
          </div>

          {/* Attached files list */}
          {files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600">
                  <Upload size={11} className="text-primary" />
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 ml-1">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => { setCategory(''); setProject(''); setMember(''); setFeedbackText(''); setFiles([]); setRatings({ communication: 0, expertise: 0, timeliness: 0, overall: 0 }); }}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider px-4 py-2 rounded hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            className="border border-slate-200 text-slate-600 text-xs font-bold px-5 py-2.5 rounded tracking-wider uppercase hover:bg-slate-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary text-white text-xs font-bold px-6 py-2.5 rounded tracking-wider uppercase hover:bg-primary-dark transition-colors"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
