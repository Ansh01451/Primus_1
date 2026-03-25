import React, { useState } from 'react';
import { Download, ArrowUpRight, ArrowRight, ShoppingCart, CheckSquare, Clock, XCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const statCards = [
  {
    value: '38',
    label: 'Total Purchase Orders',
    sub: '+3 this quarter',
    subColor: 'text-emerald-600',
    icon: ShoppingCart,
  },
  {
    value: '26',
    label: 'Approved Purchase Orders',
    sub: '↑ 68% approval rate',
    subColor: 'text-emerald-600',
    icon: CheckSquare,
  },
  {
    value: '38',
    label: 'Pending Purchase Orders',
    sub: '↑ +5 this week',
    subColor: 'text-emerald-600',
    icon: Clock,
  },
  {
    value: '03',
    label: 'Cancelled Purchase Orders',
    sub: '— Same as last month',
    subColor: 'text-slate-400',
    icon: XCircle,
  },
];

const barData = [
  { day: 'Sun', current: 120, previous: 80 },
  { day: 'Mon', current: 310, previous: 200 },
  { day: 'Tue', current: 240, previous: 180 },
  { day: 'Wed', current: 200, previous: 290 },
  { day: 'Thu', current: 170, previous: 130 },
  { day: 'Fri', current: 400, previous: 120 },
  { day: 'Sat', current: 160, previous: 210 },
];

const recentInvoices = [
  { id: 'INV-2031', date: 'Feb 01, 2026', amount: '5,230', status: 'Completed' },
  { id: 'Project_Roadmap.pdf', date: 'Jan 26, 2026', amount: '8,47,683', status: 'Pending' },
  { id: 'Budget_Forecast_Q1.xlsx', date: 'Jan 17, 2026', amount: '45,763', status: 'Completed' },
  { id: 'Strategy_Presentation.pptx', date: 'Jan 15, 2026', amount: '5,230', status: 'Pending' },
  { id: 'Market_Analysis_Report.pdf', date: 'Mar 05, 2026', amount: '7,34,823', status: 'Pending' },
  { id: 'Vendor_NDA_Template.docx', date: 'Mar 19, 2026', amount: '9,43,058', status: 'Completed' },
  { id: 'INV-2032', date: 'Feb 02, 2026', amount: '12,230', status: 'Completed' },
  { id: 'INV-2033', date: 'Feb 03, 2026', amount: '3,450', status: 'Pending' },
  { id: 'INV-2034', date: 'Feb 04, 2026', amount: '6,780', status: 'Completed' },
  { id: 'INV-2035', date: 'Feb 05, 2026', amount: '1,230', status: 'Pending' },
  { id: 'INV-2036', date: 'Feb 06, 2026', amount: '9,890', status: 'Completed' },
  { id: 'INV-2037', date: 'Feb 07, 2026', amount: '4,560', status: 'Completed' },
];

const donutData = [
  { name: 'Approved Invoices', value: 15000, color: '#217140' },
  { name: 'Pending Invoices', value: 38200, color: '#FBB016' },
  { name: 'Cancelled Invoices', value: 2500, color: '#F9575C' },
  { name: 'Completed Invoice', value: 48000, color: '#2F9BFF' },
];

const donutLegend = [
  { label: 'Approved Invoices', amount: '₹15,000', max: '₹50,000', color: '#217140' },
  { label: 'Pending Invoices', amount: '₹38,200', max: '₹50,000', color: '#FBB016' },
  { label: 'Cancelled Invoices', amount: '₹2,500', max: '₹50,000', color: '#F9575C' },
  { label: 'Completed Invoice', amount: '₹48,000', max: '₹50,000', color: '#2F9BFF' },
];

const poDepartments = [
  { dept: 'Purchase Dept', spent: 1415, total: 2000 },
  { dept: 'IT', spent: 1567, total: 5000 },
  { dept: 'Finance', spent: 487, total: 10000 },
  { dept: 'Human Resource', spent: 3890, total: 4000 },
];

const actionItems = [
  {
    tag: '2 Invoices Need Revision',
    desc: 'INV-2034 and INV-2036 have been returned with comments. Please update and resubmit.',
    cta: 'VIEW INVOICE',
  },
  {
    tag: 'Contract Expiring in 5 Days',
    desc: 'Your service agreement for ERP Upgrade expires on June 30. Renew to avoid disruption.',
    cta: 'APPROVE',
  },
  {
    tag: '3 Invoices Awaiting Approval',
    desc: 'INV-2031, INV-2032, INV-2033 are pending review by the finance team.',
    cta: 'SEND FOR APPROVAL',
  },
];

// ─── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isCompleted = status === 'Completed';
  return (
    <span className={`text-[10px] font-bold ${isCompleted ? 'text-emerald-600' : 'text-amber-500'}`}>
      {status}
    </span>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const VendorDashboard = () => {
  const [invoiceTab, setInvoiceTab] = useState('WEEKLY');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(recentInvoices.length / itemsPerPage);
  const currentInvoices = recentInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const userName = localStorage.getItem('user_name') || 'Madhan';
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-[1400px] mx-auto pb-16">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-5xl font-serif text-slate-800">
          Welcome, <span className="font-bold text-primary">{userName}</span>
        </h1>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded hover:bg-primary/90 transition-colors uppercase tracking-wider">
            <Download size={14} /> EXPORT
          </button>
          <span className="text-sm text-slate-500 font-serif italic">{today}</span>
        </div>
      </div>

      {/* ── Financial Snapshot ── */}
      <h2 className="text-base font-bold text-slate-700 mb-4">Financial Snapshot</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white border border-slate-100 card-shadow rounded-xl px-5 py-5 flex justify-between items-start">
              <div>
                <div className="text-4xl font-bold font-serif text-slate-800 mb-1">{s.value}</div>
                <div className="text-[11px] text-slate-400 mb-2">{s.label}</div>
                <div className={`text-[10px] font-semibold ${s.subColor}`}>{s.sub}</div>
              </div>
              <Icon size={22} className="text-slate-300 mt-1" strokeWidth={1.5} />
            </div>
          );
        })}
      </div>

      {/* ── Row 1: Bar Chart + Recent Invoices Table ── */}
      <div className="grid grid-cols-[1fr_480px] gap-6 mb-8 items-stretch">

        {/* Bar Chart */}
        <div className="bg-white border border-slate-100 card-shadow rounded-2xl p-6 flex flex-col h-full min-h-[480px]">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-sm font-bold text-primary">Invoices Activity</p>
              <p className="text-[10px] text-slate-400">Invoice Timeline Overview</p>
            </div>
            <button className="border border-primary text-primary text-[9px] font-bold px-3 py-1.5 rounded hover:bg-primary/5 transition-colors uppercase tracking-wider">
              DOWNLOAD REPORT
            </button>
          </div>

          <div className="flex-1 mt-6 mb-2 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 0, left: -25, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #F1F5F9' }}
                />
                <Bar dataKey="current" fill="#7B2C34" radius={[4, 4, 0, 0]} barSize={22} name="Current" />
                <Bar dataKey="previous" fill="#E8D0D2" radius={[4, 4, 0, 0]} barSize={22} name="Previous" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Invoices Table */}
        <div className="bg-white border border-slate-100 card-shadow rounded-2xl p-6 flex flex-col h-full min-h-[480px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-bold text-slate-800">Recent Invoices</p>
              <p className="text-[10px] text-slate-400">Easily view your invoices</p>
            </div>
            <div className="flex rounded overflow-hidden border border-slate-200">
              {['WEEKLY', 'MONTHLY', 'YEARLY'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setInvoiceTab(tab)}
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors ${invoiceTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container with Fixed Height and Scroll */}
          <div className="flex-1 overflow-y-auto max-h-[280px] h-[280px] pr-3 custom-scrollbar">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-slate-50/50">
                <tr className="border-b border-slate-100">
                  <th className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider py-3 pr-2">Vendor Invoice</th>
                  <th className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider py-3 pr-2">Date</th>
                  <th className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider py-3 pr-2">Amount</th>
                  <th className="text-left text-[9px] font-bold text-slate-400 uppercase tracking-wider py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.map((inv, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 pr-2 text-[10px] text-slate-600 max-w-[140px] truncate">{inv.id}</td>
                    <td className="py-2.5 pr-2 text-[10px] text-slate-500 whitespace-nowrap">{inv.date}</td>
                    <td className="py-2.5 pr-2 text-[10px] text-slate-700 font-medium">{inv.amount}</td>
                    <td className="py-2.5">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (stays at bottom) */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 shrink-0">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-[10px] font-bold text-slate-400 hover:text-primary disabled:opacity-30 uppercase tracking-widest"
            >
              PREVIOUS
            </button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-all ${currentPage === i + 1
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-400 hover:bg-slate-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-[10px] font-bold text-slate-400 hover:text-primary disabled:opacity-30 uppercase tracking-widest"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Donut Chart + PO Breakdown ── */}
      <div className="grid grid-cols-[1fr_480px] gap-6 mb-10 items-stretch">

        {/* Donut / Invoice Details */}
        <div className="bg-white border border-slate-100 card-shadow rounded-2xl p-6 flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#7B2C34]">Invoices</h3>
            <p className="text-[10px] text-slate-400">Current billing period summary</p>
          </div>

          <div className="flex flex-col items-center flex-1 justify-center">
            {/* Donut Chart Container */}
            <div className="relative w-full max-w-[280px] h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{ fontSize: 10, borderRadius: 8 }}
                    formatter={(value) => [`₹${(value * 500).toLocaleString()}`, 'Amount']}
                  />
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    dataKey="value"
                    paddingAngle={3}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-lg font-serif font-bold text-[#7B2C34] leading-tight">Invoice</p>
                  <p className="text-lg font-serif font-bold text-[#7B2C34] leading-tight">Details</p>
                </div>
              </div>
            </div>

            {/* Horizontal Legend */}
            <div className="grid grid-cols-4 gap-8 w-full mt-8 px-4">
              {donutLegend.map((item) => (
                <div key={item.label} className="flex gap-2">
                  <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{item.label}</p>
                    <p className="text-[13px] font-bold text-slate-800 mt-1">
                      {item.amount} <span className="text-slate-500 font-medium">/ {item.max}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PO Breakdown by Department */}
        <div className="bg-white border border-slate-100 card-shadow rounded-2xl p-6 flex flex-col h-full">
          <p className="text-sm font-bold text-slate-800 mb-0.5">PO Breakdown</p>
          <p className="text-[10px] text-slate-400 mb-8">PO Breakdown by Department</p>

          <div className="flex flex-col gap-8 flex-1 justify-center pb-4">
            {poDepartments.map((dept) => {
              const pct = Math.round((dept.spent / dept.total) * 100);
              return (
                <div key={dept.dept}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">{dept.dept}</span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      ₹{dept.spent.toLocaleString()} / ₹{dept.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Action Center ── */}
      <h2 className="text-xl font-bold text-slate-800 mb-5">Action Center</h2>
      <div className="grid grid-cols-3 gap-5">
        {actionItems.map((item, i) => (
          <div key={i} className="bg-white border border-slate-100 card-shadow rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.tag}</p>
            <p className="text-xs text-slate-600 leading-relaxed flex-1">{item.desc}</p>
            <button className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-wider hover:gap-2.5 transition-all">
              {item.cta} <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default VendorDashboard;
