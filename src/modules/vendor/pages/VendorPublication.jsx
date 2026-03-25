import React, { useState, useMemo } from 'react';
import { useGetVendorPublicationsQuery } from '../services/vendorApi';
import {
  Search, ArrowUpDown, SlidersHorizontal, Bookmark, ArrowRight,
  Clock, FileText, BookOpen
} from 'lucide-react';

// NOTE: VendorPublication uses the same /primus/in-news API as client (per requirements).
// The vendorApi.js maps getVendorPublications to the same endpoint intentionally.
// If the backend ever provides a vendor-specific publications endpoint, only vendorApi.js needs updating.

const typeColors = {
  Whitepaper: 'bg-blue-50 text-blue-700',
  Research: 'bg-purple-50 text-purple-700',
  Article: 'bg-amber-50 text-amber-700',
  'Case Study': 'bg-emerald-50 text-emerald-700',
  Report: 'bg-slate-100 text-slate-600',
  News: 'bg-slate-100 text-slate-600',
};

// ─── Publication Card ──────────────────────────────────────────────────────────
const PublicationCard = ({ pub }) => {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="bg-white border border-slate-100 card-shadow rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div className="relative h-44 overflow-hidden">
        <img src={pub.image} alt={pub.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-md flex items-center justify-center hover:bg-white transition-colors"
        >
          <Bookmark size={13} className={bookmarked ? 'fill-primary text-primary' : 'text-slate-500'} />
        </button>
        <span className={`absolute bottom-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded ${typeColors[pub.type] || 'bg-slate-100 text-slate-600'}`}>
          {pub.type}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-1.5 leading-snug">{pub.title}</h3>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{pub.description}</p>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock size={10} />{pub.readTime}</span>
            <span className="flex items-center gap-1"><FileText size={10} />{pub.date}</span>
          </div>
          <a
            href={pub.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-bold hover:underline text-[10px] flex items-center gap-1"
          >
            Read <ArrowRight size={10} />
          </a>
        </div>
      </div>
    </div>
  );
};

// ─── Main Vendor Publications Page ────────────────────────────────────────────
const VendorPublication = () => {
  const { data: newsData, isLoading, isError } = useGetVendorPublicationsQuery();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [featuredBookmarked, setFeaturedBookmarked] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');

  const publicationsData = useMemo(() => {
    if (!newsData?.items) return [];
    return newsData.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.excerpt || `Recent insights in ${item.sector}`,
      image: item.img || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&h=400&fit=crop',
      type: item.sector || 'News',
      date: item.date_text,
      readTime: '8 mins',
      link: item.link,
    }));
  }, [newsData]);

  const categories = useMemo(() => {
    const counts = { ALL: publicationsData.length };
    publicationsData.forEach((pub) => {
      counts[pub.type] = (counts[pub.type] || 0) + 1;
    });
    return Object.entries(counts).map(([label, count]) => ({ label: label.toUpperCase(), count }));
  }, [publicationsData]);

  const filteredPublications = useMemo(() => {
    let result = publicationsData.filter((pub) => {
      const matchesCategory = activeCategory === 'ALL' || pub.type.toUpperCase() === activeCategory;
      const matchesSearch = pub.title.toLowerCase().includes(search.toLowerCase())
        || pub.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    return result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      const dateA = a.date ? new Date(a.date.split('-').reverse().join('-')) : new Date(0);
      const dateB = b.date ? new Date(b.date.split('-').reverse().join('-')) : new Date(0);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [publicationsData, activeCategory, search, sortBy]);

  const featuredPublicationData = publicationsData[0];

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading publications...</div>;
  if (isError) return <div className="p-12 text-center text-red-500">Error loading publications. Please try again later.</div>;

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-primary mb-1">Publication</h1>
          <p className="text-xs text-slate-400">Explore research, insights, and thought leadership</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-200 rounded-full py-2 pl-4 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 w-48 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-8 top-2.5 text-slate-300 hover:text-slate-500">×</button>
            )}
            <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider min-w-[100px] justify-between">
              <span className="flex items-center gap-2">
                <ArrowUpDown size={13} /> {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'A-Z'}
              </span>
            </button>
            <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-slate-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-1">
                {['newest', 'oldest', 'title'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSortBy(opt)}
                    className={`w-full text-left px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 ${sortBy === opt ? 'text-primary' : 'text-slate-500'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider">
            <SlidersHorizontal size={13} /> Filter
          </button>
        </div>
      </div>

      {/* Featured Publication */}
      {search === '' && activeCategory === 'ALL' && featuredPublicationData && (
        <div className="bg-white border border-slate-100 card-shadow rounded-2xl overflow-hidden mb-8">
          <div className="grid grid-cols-[1fr_300px]">
            <div className="relative h-72">
              <img src={featuredPublicationData.image} alt="Featured" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              <button
                onClick={() => setFeaturedBookmarked(!featuredBookmarked)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-md flex items-center justify-center hover:bg-white transition-colors"
              >
                <Bookmark size={15} className={featuredBookmarked ? 'fill-primary text-primary' : 'text-slate-500'} />
              </button>
            </div>
            <div className="p-6 border-l border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Publication Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Published</p>
                    <p className="text-xs font-bold text-slate-700">{featuredPublicationData.date}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Reading Time</p>
                    <p className="text-xs font-bold text-slate-700">{featuredPublicationData.readTime}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Sector</p>
                    <p className="text-xs font-bold text-slate-700">{featuredPublicationData.type}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Source</p>
                    <p className="text-xs font-bold text-slate-700">Primus Partners</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-2">Title</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{featuredPublicationData.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <a
                  href={featuredPublicationData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-primary text-white text-[10px] font-bold py-2.5 rounded tracking-wider uppercase hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5"
                >
                  Read Article <ArrowRight size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-1 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.label)}
            className={`px-4 py-2 rounded text-[10px] font-bold tracking-wider transition-all
              ${activeCategory === cat.label
                ? 'bg-primary text-white'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Publications</h2>
        <p className="text-xs text-slate-400 mb-6">Browse all available research and insights</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublications.map((pub) => (
            <PublicationCard key={pub.id} pub={pub} />
          ))}
        </div>
        {filteredPublications.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 mt-4">
            <BookOpen size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium">No publications found matching your search.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('ALL'); }}
              className="text-primary text-xs font-bold uppercase mt-4 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorPublication;
