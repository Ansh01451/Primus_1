import React, { useState, useRef } from 'react';
import { Star, Upload, ChevronDown, MessageSquare, BarChart2, CheckCircle } from 'lucide-react';
import { useSubmitVendorFeedbackMutation } from '../services/vendorApi';

// ─── Vendor-specific stats ─────────────────────────────────────────────────────
const stats = [
  { value: '48', label: 'Total Feedback', icon: MessageSquare },
  { value: '4.4', label: 'Average Rating', icon: BarChart2 },
];

const ratingDimensions = [
  { key: 'service_quality', label: 'Service Quality' },
  { key: 'communication', label: 'Communication' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'overall', label: 'Overall' },
];

const categories = ['Service Quality', 'Delivery Performance', 'Communication', 'Billing Accuracy', 'Other'];

// ─── Star Rating Component (shared UI pattern) ─────────────────────────────────
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

// ─── Select Component ──────────────────────────────────────────────────────────
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

// ─── Main Vendor Feedback Page ─────────────────────────────────────────────────
const VendorFeedback = () => {
  const [ratings, setRatings] = useState({ service_quality: 0, communication: 0, delivery: 0, overall: 0 });
  const [category, setCategory] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  // Vendor-specific mutation — separate from client feedback endpoint
  const [submitFeedback, { isLoading: isSubmitting }] = useSubmitVendorFeedbackMutation();

  const handleRating = (dimension, val) => {
    setRatings((prev) => ({ ...prev, [dimension]: val }));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const handleSubmit = async () => {
    if (!category) {
      alert('Please select a feedback category.');
      return;
    }
    try {
      await submitFeedback({ category, ratings, feedbackText });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setCategory(''); setFeedbackText(''); setFiles([]);
      setRatings({ service_quality: 0, communication: 0, delivery: 0, overall: 0 });
    } catch {
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      <div className="mb-10">
        <h1 className="text-5xl font-serif font-bold text-primary mb-1">Share Your Feedback</h1>
        <p className="text-xs text-slate-400">Your insights help us improve vendor engagement and project outcomes.</p>
      </div>

      {/* Success Toast */}
      {submitted && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-5 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-500" />
          Your feedback has been submitted successfully!
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-10">
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
        <p className="text-xs text-slate-400 mb-8">Rate your vendor engagement experience across multiple dimensions</p>

        <div className="flex gap-6 mb-8">
          <Select label="Feedback Category" options={categories} value={category} onChange={setCategory} required />
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
            placeholder="Provide a detailed description of your experience..."
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
            <input ref={fileInputRef} type="file" multiple className="hidden" accept=".pdf,.png,.jpg,.xlsx"
              onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files)])} />
            <Upload size={22} className="text-slate-300 mb-2" />
            <p className="text-sm text-slate-500">
              <span className="text-primary font-bold cursor-pointer hover:underline">Click to upload</span>
              &nbsp;or drag & drop files here
            </p>
            <p className="text-[11px] text-slate-400 mt-1">PDF, PNG, JPG, XLSX — max 20MB</p>
          </div>
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

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => { setCategory(''); setFeedbackText(''); setFiles([]); setRatings({ service_quality: 0, communication: 0, delivery: 0, overall: 0 }); }}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider px-4 py-2 rounded hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button className="border border-slate-200 text-slate-600 text-xs font-bold px-5 py-2.5 rounded tracking-wider uppercase hover:bg-slate-50 transition-colors">
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary text-white text-xs font-bold px-6 py-2.5 rounded tracking-wider uppercase hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorFeedback;
