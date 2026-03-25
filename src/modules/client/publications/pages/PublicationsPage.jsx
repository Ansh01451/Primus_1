import React, { useState, useMemo } from 'react';
import { useGetInNewsQuery } from '../../../../services/apiSlice';
import {
  Search, ArrowUpDown, SlidersHorizontal, Bookmark, Download, Share2, ArrowRight,
  Clock, FileText, BookOpen
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const categories = [
  { label: 'ALL', count: 92 },
  { label: 'WHITEPAPERS', count: 13 },
  { label: 'RESEARCH', count: 22 },
  { label: 'ARTICLES', count: 33 },
  { label: 'CASE STUDIES', count: 65 },
  { label: 'REPORTS', count: 31 },
  { label: 'FAVOURITES', count: 31 },
];

const featuredPublication = {
  title: 'AI in Supply Chain Management',
  image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&h=400&fit=crop',
  published: 'Dec, 25',
  readingTime: '12 mins',
  pages: '12',
  takeaways: [
    'AI-enabled demand forecasting reduces inventory costs by up to 20%',
    'Autonomous procurement systems accelerate cycle times by 45.6',
    'Organizations with AI supply chains outperform peers by 23+ on margin',
  ],
};

const publications = [
  {
    id: 1,
    title: 'Consulting Insights Group',
    description: 'How AI remote collaboration, and new talent models are reshaping the professional...',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=300&fit=crop',
    type: 'Whitepaper',
    date: 'Dec 12, 2025',
    readTime: '8 mins',
  },
  {
    id: 2,
    title: 'Infrastructure Resilience in the Age of Climate Risk',
    description: 'How leading organizations are stress-testing physical and digital infrastructure...',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop',
    type: 'Research',
    date: 'Nov 28, 2025',
    readTime: '12 mins',
  },
  {
    id: 3,
    title: 'Digital Governance Frameworks for 2026',
    description: 'Establishing accountability, transparency, and compliance in AI augmented...',
    image: 'https://images.unsplash.com/photo-1494412685616-a5d310b0f85a?w=600&h=300&fit=crop',
    type: 'Article',
    date: 'Nov 15, 2025',
    readTime: '6 mins',
  },
  {
    id: 4,
    title: 'Future of Public Sector Procurement',
    description: 'Transforming government procurement with AI and analytics solutions...',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=300&fit=crop',
    type: 'Case Study',
    date: 'Oct 22, 2025',
    readTime: '15 mins',
  },
  {
    id: 5,
    title: 'Data Privacy in Enterprise Systems',
    description: 'How modern enterprises are handling sensitive data in compliance with regulations...',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=300&fit=crop',
    type: 'Whitepaper',
    date: 'Oct 5, 2025',
    readTime: '10 mins',
  },
  {
    id: 6,
    title: 'Sustainable Energy Transition Report',
    description: 'Documenting the shift from fossil fuels to renewable energy across industries...',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=300&fit=crop',
    type: 'Report',
    date: 'Sep 18, 2025',
    readTime: '20 mins',
  },
];

const typeColors = {
  Whitepaper: 'bg-blue-50 text-blue-700',
  Research: 'bg-purple-50 text-purple-700',
  Article: 'bg-amber-50 text-amber-700',
  'Case Study': 'bg-emerald-50 text-emerald-700',
  Report: 'bg-slate-100 text-slate-600',
  News: 'bg-slate-100 text-slate-600',
};

// ─── Publication Card ─────────────────────────────────────────────────────────
const PublicationCard = ({ pub }) => {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="bg-white border border-slate-100 card-shadow rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={pub.image} alt={pub.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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

      {/* Content */}
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

// ─── Main Page ────────────────────────────────────────────────────────────────
const PublicationsPage = () => {
  const { data: newsData, isLoading, isError } = useGetInNewsQuery();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [featuredBookmarked, setFeaturedBookmarked] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'title'
  const [search, setSearch] = useState('');

  const publicationsData = useMemo(() => {
    if (!newsData?.items) return [];
    return newsData.items.map(item => ({
      id: item.id,
      title: item.title,
      description: item.excerpt || `Recent insights in ${item.sector}`,
      image: item.img || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&h=400&fit=crop',
      type: item.sector || 'News',
      date: item.date_text,
      readTime: '8 mins', // Scraper doesn't provide this yet
      link: item.link
    }));
  }, [newsData]);

  const categories = useMemo(() => {
    const counts = { ALL: publicationsData.length };
    publicationsData.forEach(pub => {
      counts[pub.type] = (counts[pub.type] || 0) + 1;
    });
    return Object.entries(counts).map(([label, count]) => ({
      label: label.toUpperCase(),
      count
    }));
  }, [publicationsData]);

  const filteredPublications = useMemo(() => {
    let result = publicationsData.filter(pub => {
      const matchesCategory = activeCategory === 'ALL' || pub.type.toUpperCase() === activeCategory;
      const matchesSearch = pub.title.toLowerCase().includes(search.toLowerCase()) || 
                           pub.description.toLowerCase().includes(search.toLowerCase()) ||
                           pub.type.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sorting logic
    return result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      
      // Basic date parsing (e.g. "11-03-2026")
      const dateA = a.date ? new Date(a.date.split('-').reverse().join('-')) : new Date(0);
      const dateB = b.date ? new Date(b.date.split('-').reverse().join('-')) : new Date(0);
      
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [publicationsData, activeCategory, search, sortBy]);

  const handleDownload = (pub) => {
    // Since these are web articles, we'll open the print dialog as a "Save as PDF" fallback
    // or simply notify the user if it's a mock. For now, open the article link.
    if (pub.link) {
      window.open(pub.link, '_blank');
    } else {
      alert("Download as PDF is currently only available for whitepapers.");
    }
  };

  const featuredPublicationData = publicationsData[0] || featuredPublication;

  if (isLoading) return <div className="p-12 text-center text-slate-500">Loading publications...</div>;
  if (isError) return <div className="p-12 text-center text-red-500">Error loading publications. Please try again later.</div>;

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-primary mb-1">Publication</h1>
          <p className="text-xs text-slate-400">Explore research, insights, and thought leadership from the consulting team</p>
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
              <button 
                onClick={() => setSearch('')}
                className="absolute right-8 top-2.5 text-slate-300 hover:text-slate-500"
              >
                ×
              </button>
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

          <button 
            onClick={() => document.getElementById('category-tabs')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider"
          >
            <SlidersHorizontal size={13} /> Filter
          </button>
        </div>
      </div>

      {/* Featured Publication */}
      {search === '' && activeCategory === 'ALL' && (
        <div className="bg-white border border-slate-100 card-shadow rounded-2xl overflow-hidden mb-8">
          <div className="grid grid-cols-[1fr_300px]">
            <div className="relative h-72">
              <img
                src={featuredPublicationData.image}
                alt="Featured"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              <button
                onClick={() => setFeaturedBookmarked(!featuredBookmarked)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-md flex items-center justify-center hover:bg-white transition-colors"
              >
                <Bookmark size={15} className={featuredBookmarked ? 'fill-primary text-primary' : 'text-slate-500'} />
              </button>
            </div>

            <div className="p-6 border-l border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Publications Details</h3>
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
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                    {featuredPublicationData.title}
                  </p>
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
      <div id="category-tabs" className="flex items-center gap-1 mb-8 flex-wrap">
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

      {/* Publications Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Your Publications</h2>
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
              onClick={() => {setSearch(''); setActiveCategory('ALL');}}
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

export default PublicationsPage;
