import React, { useState } from 'react';
import {
  Search, SlidersHorizontal, Upload, FolderPlus, Folder, FileText,
  Download, Share2, Trash2, ChevronsUpDown, FileSpreadsheet
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const folders = [
  { name: 'Project Documents', count: 3, id: 'project' },
  { name: 'Legal Documents', count: 4, id: 'legal' },
  { name: 'Financial Documents', count: 1, id: 'financial' },
  { name: 'Reports', count: 1, id: 'reports' },
  { name: 'Contracts', count: 1, id: 'contracts' },
];

const stats = [
  { value: '120', label: 'Total Documents' },
  { value: '06', label: 'Recently Added' },
  { value: '24', label: 'Shared With Client' },
  { value: '03', label: 'Pending Approval' },
];

const fileTypeFilters = [
  { label: 'ALL', count: 12 },
  { label: 'PDF', count: 5 },
  { label: 'PPT', count: 2 },
  { label: 'EXCEL', count: 3 },
  { label: 'WORD', count: 5 },
];

const allFiles = [
  { id: 1, name: 'Contract_Agreement.docx', size: '34 mb', uploadedBy: 'Mani Roy', uploadedOn: 'Feb 01, 2026', version: 'V1', type: 'WORD' },
  { id: 2, name: 'Project_Roadmap.pdf', size: '12 mb', uploadedBy: 'Arjun Patel', uploadedOn: 'Jan 26, 2026', version: 'V2', type: 'PDF', highlighted: true },
  { id: 3, name: 'Budget_Forecast_Q1.xlsx', size: '9 mb', uploadedBy: 'Sophia', uploadedOn: 'Jan 17, 2026', version: 'V2', type: 'EXCEL' },
  { id: 4, name: 'Strategy_Presentation.pptx', size: '67 mb', uploadedBy: 'PA Ranjith', uploadedOn: 'Jan 15, 2026', version: 'V1', type: 'PPT' },
  { id: 5, name: 'Market_Analysis_Report.pdf', size: '23 mb', uploadedBy: 'James', uploadedOn: 'Mar 06, 2026', version: 'V1', type: 'PDF' },
  { id: 6, name: 'Vendor_NDA_Template.docx', size: '10 mb', uploadedBy: 'Arjun Raj', uploadedOn: 'Mar 19, 2026', version: 'V3', type: 'WORD' },
];

// ─── File Icon ────────────────────────────────────────────────────────────────
const FileIcon = ({ type }) => {
  const configs = {
    PDF: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
    WORD: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    EXCEL: { icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    PPT: { icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50' },
  };
  const config = configs[type] || configs.WORD;
  const Icon = config.icon;
  return (
    <div className={`w-7 h-7 rounded flex items-center justify-center ${config.bg}`}>
      <Icon size={13} className={config.color} />
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const DocumentsPage = () => {
  const [activeFolder, setActiveFolder] = useState('project');
  const [activeType, setActiveType] = useState('ALL');
  const [selectedRows, setSelectedRows] = useState([1, 2]);
  const [sortCol, setSortCol] = useState(null);
  const [search, setSearch] = useState('');

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const filteredFiles = allFiles.filter((f) =>
    (activeType === 'ALL' || f.type === activeType) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-serif font-bold text-primary mb-1">Document Library</h1>
          <p className="text-xs text-slate-400">Manage project files, reports, and shared documents across all engagements</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-200 rounded-full py-2 pl-4 pr-9 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 w-52"
            />
            <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
          </div>
          <button className="flex items-center gap-2 border border-slate-200 bg-white px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider">
            <SlidersHorizontal size={13} /> Filter
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-xs font-bold hover:bg-primary-dark transition-colors uppercase tracking-wider">
            <Upload size={13} /> Upload File
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 card-shadow rounded-xl px-6 py-5 flex justify-between items-center">
            <div>
              <div className="text-4xl font-bold font-serif text-slate-700 mb-0.5">{s.value}</div>
              <div className="text-[11px] text-slate-400">{s.label}</div>
            </div>
            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center">
              <FileText size={18} className="text-slate-300" strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      {/* All Files Section */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-5">All Files</h2>

        <div className="flex gap-6">
          {/* ── Left: Folders Sidebar ── */}
          <div className="w-52 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-slate-500 font-bold">Folders (10 files)</span>
              <button className="bg-primary text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider uppercase hover:bg-primary-dark transition-colors flex items-center gap-1">
                <FolderPlus size={10} /> New Folder
              </button>
            </div>

            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setActiveFolder(folder.id)}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-xs font-medium
                    ${activeFolder === folder.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                >
                  <Folder size={14} className={activeFolder === folder.id ? 'text-primary' : 'text-slate-400'} />
                  <span className="truncate">{folder.name}</span>
                  <span className={`ml-auto text-[9px] font-bold rounded px-1 ${activeFolder === folder.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                    {String(folder.count).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Files Table ── */}
          <div className="flex-1 min-w-0">
            {/* Type Filter Tabs */}
            <div className="flex items-center gap-1.5 mb-4">
              {fileTypeFilters.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setActiveType(f.label)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold tracking-wider transition-all
                    ${activeType === f.label
                      ? 'bg-primary text-white'
                      : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-100 card-shadow rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <input type="checkbox" className="rounded border-slate-300 accent-primary" />
                    </th>
                    {[
                      { label: 'S.NO', w: 'w-12' },
                      { label: 'FILE NAME', w: 'flex-1' },
                      { label: 'FILE SIZE', w: 'w-24' },
                      { label: 'UPLOADED BY', w: 'w-32' },
                      { label: 'UPLOADED ON', w: 'w-32' },
                      { label: 'VERSION', w: 'w-20' },
                      { label: 'ACTION', w: 'w-24' },
                    ].map((col) => (
                      <th
                        key={col.label}
                        className={`px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 transition-colors ${col.w}`}
                        onClick={() => setSortCol(col.label)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <ChevronsUpDown size={10} className="text-slate-300" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className={`transition-colors hover:bg-slate-50/50
                        ${file.highlighted ? 'bg-primary/5' : ''}
                        ${selectedRows.includes(file.id) ? 'bg-primary/3' : ''}
                      `}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(file.id)}
                          onChange={() => toggleRow(file.id)}
                          className="rounded border-slate-300 accent-primary"
                        />
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 w-12">{file.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <FileIcon type={file.type} />
                          <span className={`text-xs font-medium truncate max-w-[180px] ${file.highlighted ? 'text-primary' : 'text-slate-700'}`}>
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{file.size}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{file.uploadedBy}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{file.uploadedOn}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {file.version}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded hover:bg-primary/5">
                            <Download size={13} />
                          </button>
                          <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded hover:bg-primary/5">
                            <Share2 size={13} />
                          </button>
                          <button className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredFiles.length === 0 && (
                <div className="py-16 text-center text-slate-400 text-sm">
                  No documents found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
