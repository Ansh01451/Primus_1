import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Share2,
  Trash2,
  Ticket,
  ArrowLeft,
  CheckCircle2,
  Wallet,
  Receipt,
  RotateCcw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const overviewData = [
  { label: 'Total Invoice Value', value: '₹1.58 Cr', trend: '+12% vs last quarter', trendColor: 'text-emerald-500', icon: Ticket },
  { label: 'Amount Received', value: '₹92.4 L', trend: '↑ 58% of total', trendColor: 'text-emerald-500', icon: Ticket },
  { label: 'Outstanding Amount', value: '₹38 L', trend: '24% of total due', trendColor: 'text-rose-400', icon: Ticket },
  { label: 'Overdue Amount', value: '₹12.5 L', trend: '! Needs immediate action', trendColor: 'text-rose-500', icon: Ticket },
  { label: 'Invoices Under Review', value: '3', trend: 'Awaiting finance sign-off', trendColor: 'text-slate-400', icon: Ticket },
];

const revenueByProject = [
  { project: 'ERP Transformation', value: 38, total: 50 },
  { project: 'Digital Strategy', value: 65, total: 80 },
  { project: 'AI Consulting', value: 42, total: 60 },
  { project: 'Policy Advisory', value: 28, total: 40 },
  { project: 'Cloud Migration', value: 55, total: 70 },
];

const weeklyActivityData = [
  { name: 'Sun', value: 120 },
  { name: 'Mon', value: 80 },
  { name: 'Tue', value: 210 },
  { name: 'Wed', value: 190 },
  { name: 'Thu', value: 100 },
  { name: 'Fri', value: 300 },
  { name: 'Sat', value: 130 },
];

const snapshots = [
  { label: 'Average Payment Time', value: '12 days', detail: '↓ -2 days improved vs Q4', detailColor: 'text-emerald-500' },
  { label: 'Approval Rate', value: '82%', detail: '↑ +4% vs last quarter', detailColor: 'text-emerald-500' },
  { label: 'Payment Reliability Score', value: '91%', detail: '! On track for excellence', detailColor: 'text-emerald-500' },
  { label: 'Invoice Success Rate', value: '96%', detail: '↑ Best quarter in 2 years', detailColor: 'text-emerald-500' },
];

const sampleInvoices = [
  { id: 'INV-2031', project: 'ERP Upgrade', po: 'PO-2031', qty: 4, amount: '5,230', discount: '230', status: 'Paid', date: 'Feb 01, 2026' },
  { id: 'INV-23234', project: 'Digital Transformation', po: 'PO-2031', qty: 5, amount: '8,47,683', discount: '7,683', status: 'Pending', date: 'Jan 26, 2026' },
  { id: 'INV-4354', project: 'Digital Transformation', po: 'PO-2031', qty: 10, amount: '45,763', discount: '63', status: 'Paid', date: 'Jan 17, 2026' },
  { id: 'INV-5342', project: 'Digital Transformation', po: 'PO-2031', qty: 18, amount: '5,230', discount: '0', status: 'Pending', date: 'Jan 15, 2026' },
  { id: 'INV-8545', project: 'Digital Transformation', po: 'PO-2031', qty: 2, amount: '7,34,823', discount: '4,823', status: 'Paid', date: 'Mar 05, 2026' },
  { id: 'INV-87564', project: 'Digital Transformation', po: 'PO-2031', qty: 10, amount: '9,43,058', discount: '943', status: 'Paid', date: 'Mar 10, 2026' },
];

const detailLineItems = [
  { name: 'Industrial Bearings', qty: 4, price: '5,230', tax: '18%', discount: '230', total: '5,000', status: 'Paid' },
  { name: 'Installation Services', qty: 5, price: '8,47,683', tax: '18%', discount: '0', total: '8,47,683', status: 'Pending' },
  { name: 'Conveyor Belt Assembly', qty: 10, price: '45,763', tax: '18%', discount: '63', total: '45,700', status: 'Paid' },
  { name: 'Maintenance Contract', qty: 18, price: '5,230', tax: '18%', discount: '0', total: '5,230', status: 'Pending' },
  { name: 'Industrial Gearbox', qty: 85, price: '7,34,823', tax: '18%', discount: '4,823', total: '7,30,000', status: 'Paid' },
  { name: 'Hydraulic Pump', qty: 2, price: '25,000', tax: '18%', discount: '500', total: '24,500', status: 'Paid' },
  { name: 'Filter Element', qty: 15, price: '1,200', tax: '12%', discount: '100', total: '1,100', status: 'Paid' },
  { name: 'Seal Kit', qty: 20, price: '850', tax: '12%', discount: '50', total: '800', status: 'Paid' },
  { name: 'O-Ring Set', qty: 50, price: '150', tax: '5%', discount: '0', total: '150', status: 'Paid' },
  { name: 'Valve Assembly', qty: 8, price: '12,400', tax: '18%', discount: '400', total: '12,000', status: 'Paid' },
  { name: 'Sensor Module', qty: 12, price: '4,500', tax: '18%', discount: '200', total: '4,300', status: 'Pending' },
  { name: 'Cable Connector', qty: 100, price: '85', tax: '12%', discount: '5', total: '80', status: 'Paid' },
];

const InvoiceDetailsView = ({ invoice, onBack }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = useMemo(() => {
    if (activeTab === 'ALL') return detailLineItems;
    return detailLineItems.filter(item => item.status.toUpperCase() === activeTab);
  }, [activeTab]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  return (
    <div className="bg-[#FDFCFB] min-h-screen px-4 py-8 max-w-[1600px] mx-auto overflow-hidden animate-in fade-in slide-in-from-right-10 duration-500">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#7B2C34] font-bold text-sm mb-8 hover:opacity-80 transition-opacity"
      >
        <ArrowLeft size={16} /> Back to Payment Tracking
      </button>

      {/* Invoice Header Card */}
      <Card className="p-8 mb-6 border-none shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h1 className="text-4xl font-serif font-bold text-[#7B2C34]">{invoice.id}</h1>
            <div className="flex gap-3">
              <span className="bg-slate-50 text-slate-400 font-bold text-[10px] px-3 py-1.5 rounded-full border border-slate-100 uppercase tracking-widest">Linked PO: {invoice.po}</span>
              <span className="bg-slate-50 text-slate-400 font-bold text-[10px] px-3 py-1.5 rounded-full border border-slate-100 uppercase tracking-widest">ERP Upgrade</span>
            </div>
            <p className="text-slate-400 text-xs font-semibold">Delta Tech Solutions - GSTIN: 29AAXFD1234C1Z2</p>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-50 pr-4 pl-2 py-1.5 rounded-full mb-4 border border-amber-100">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div> Payment Pending
            </div>
            <div className="space-y-1">
              <p className="text-slate-300 text-[11px] font-bold uppercase">Created by Amit Sharma</p>
              <p className="text-slate-300 text-[11px] font-bold uppercase tracking-tighter">Last updated Aug 07, 2025</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Invoice Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Subtotal', value: '₹60,000', detail: 'Before tax and deductions', icon: Wallet },
          { label: 'Tax Amount', value: '₹10,800', detail: 'GST @ 18% applied', icon: RotateCcw },
          { label: 'Discount', value: '-₹1,000', detail: 'Negotiated discount applied', icon: Receipt },
        ].map((item, i) => (
          <Card key={i} className="p-6 flex flex-col justify-between relative group hover:shadow-md transition-all h-32">
            <div>
              <div className="text-2xl font-bold text-slate-800 mb-0.5">{item.value}</div>
              <div className="text-xs font-bold text-slate-500 mb-2">{item.label}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.detail}</div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <item.icon size={16} className="text-[#7B2C34]/20" />
            </div>
          </Card>
        ))}
        <Card className="p-6 flex flex-col justify-between relative bg-[#4D1A1F] h-32 text-white border-none shadow-lg">
          <div>
            <div className="text-2xl font-bold mb-0.5">₹69,800</div>
            <div className="text-xs font-bold opacity-70 mb-2">Net Payable</div>
            <div className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">Final amount due - Aug 20</div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Ticket size={16} className="text-white/40" />
          </div>
        </Card>
      </div>

      {/* Payment Timeline */}
      <Card className="p-10 mb-8 border-none shadow-sm">
        <h3 className="text-lg font-serif font-bold text-slate-700 mb-10">Payment Timeline</h3>
        <div className="flex items-center justify-between relative max-w-[1200px] mx-auto">
          <div className="absolute top-[22px] left-[5%] right-[5%] h-[2px] bg-slate-100 z-0"></div>
          {[
            { label: 'Invoice Created', date: 'Aug 05', completed: true },
            { label: 'Submitted', date: 'Aug 05', completed: true },
            { label: 'Under Review', date: 'Aug 07', completed: true },
            { label: 'Approved', step: 4, completed: false },
            { label: 'Payment Initiated', step: 5, completed: false },
            { label: 'Paid', step: 6, completed: false },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 relative z-10">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all ${item.completed ? 'bg-[#7B2C34] border-[#7B2C34] text-white' : 'bg-white border-slate-200 text-slate-300'
                }`}>
                {item.completed ? <CheckCircle2 size={24} /> : <span className="text-sm font-bold">{item.step}</span>}
              </div>
              <div className="text-center w-32">
                <p className={`text-[11px] font-bold uppercase tracking-tight ${item.completed ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</p>
                {item.date && <p className="text-[10px] font-bold text-[#7B2C34] mt-0.5">{item.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Line Items Section */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-serif font-bold text-slate-700">Line Items</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detailed invoice breakdown — {filteredItems.length} items</p>
        </div>
        <Button variant="primary" className="bg-[#7B2C34] h-9 px-6 normal-case text-xs font-bold tracking-widest">EXPORT</Button>
      </div>

      <Card className="overflow-hidden border-none shadow-sm rounded-xl mb-12">
        <div className="flex items-center gap-8 border-b border-slate-100 px-6 py-4 overflow-x-auto no-scrollbar">
          {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`text-[11px] font-bold tracking-widest pb-1 transition-all relative ${activeTab === tab ? 'text-[#7B2C34]' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-[#7B2C34]"></div>}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc]/50 border-b border-slate-50">
              <tr>
                {['PRODUCT / SERVICE', 'QTY', 'UNIT PRICE', 'TAX %', 'DISCOUNT', 'TOTAL PRICE', 'STATUS'].map((head) => (
                  <th key={head} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {head} {['QTY', 'TOTAL PRICE'].includes(head) && <ArrowUpDown size={10} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-600 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-500 whitespace-nowrap">{item.qty}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-500 whitespace-nowrap">₹{item.price}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-400 whitespace-nowrap">{item.tax}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-400 whitespace-nowrap">{item.discount}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-800 whitespace-nowrap">₹{item.total}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${item.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredItems.length)} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} items
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ArrowLeft size={14} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#7B2C34] text-white' : 'border border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all rotate-180"
              >
                <ArrowLeft size={14} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const PaymentTracking = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredInvoices = useMemo(() => {
    if (activeTab === 'ALL') return sampleInvoices;
    return sampleInvoices.filter(inv => inv.status.toUpperCase() === activeTab);
  }, [activeTab]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  if (viewingInvoice) {
    return <InvoiceDetailsView invoice={viewingInvoice} onBack={() => setViewingInvoice(null)} />;
  }

  return (
    <div className="bg-[#FDFCFB] min-h-screen px-4 py-8 max-w-[1600px] mx-auto overflow-hidden animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#7B2C34] mb-1">Payment Tracking</h1>
          <p className="text-sm text-slate-400 font-medium">Track invoice payments, monitor outstanding amounts, and manage financial progress.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search Meeting"
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-48 focus:outline-none focus:border-[#7B2C34]/30"
            />
          </div>
          <Button variant="secondary" className="bg-white normal-case font-medium text-slate-500 h-10 px-4 flex gap-2 border-rose-100">
            <Filter size={16} /> FILTER
          </Button>
          <Button variant="primary" className="bg-[#7B2C34] h-10 px-4 normal-case text-xs font-bold tracking-widest whitespace-nowrap">
            EXPORT REPORT
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <h2 className="text-lg font-bold text-slate-700 mb-4 px-2">Financial Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {overviewData.map((stat, idx) => (
          <Card key={idx} className="p-5 flex flex-col justify-between relative group hover:shadow-lg transition-all duration-300">
            <div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-400 mb-2">{stat.label}</div>
              <div className={`text-[10px] font-bold ${stat.trendColor}`}>{stat.trend}</div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-slate-50/80 flex items-center justify-center border border-slate-100 group-hover:bg-[#7B2C34]/5 transition-colors">
              <stat.icon size={20} className="text-[#7B2C34]/30" />
            </div>
          </Card>
        ))}
      </div>

      {/* Payment Insights Section */}
      <h2 className="text-lg font-bold text-slate-700 mb-4 px-2">Payment Insights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold text-[#7B2C34] uppercase tracking-wide mb-1">Invoice Payment Progress</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase">₹1.58 Cr Total</p>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">158 invoices</span>
            </div>
            <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden flex mb-4">
              <div className="bg-[#2D8E63] h-full" style={{ width: '65%' }}></div>
              <div className="bg-[#EAB308] h-full" style={{ width: '25%' }}></div>
              <div className="bg-[#E14D4D] h-full" style={{ width: '10%' }}></div>
            </div>
            <div className="flex gap-6">
              {[
                { label: 'Paid', value: '65%', color: 'bg-[#2D8E63]' },
                { label: 'Pending', value: '25%', color: 'bg-[#EAB308]' },
                { label: 'Overdue', value: '10%', color: 'bg-[#E14D4D]' }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.label} &nbsp; {item.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#7B2C34] uppercase tracking-wide mb-1">Revenue by Project</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Invoice value distribution</p>
            </div>
            <div className="space-y-6">
              {revenueByProject.map(item => (
                <div key={item.project}>
                  <div className="flex justify-between text-[10px] font-bold text-slate-700 uppercase mb-2">
                    <span>{item.project}</span>
                    <span>₹{item.value}L</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-[#7B2C34] h-full transition-all duration-1000"
                      style={{ width: `${(item.value / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-sm font-bold text-[#7B2C34] uppercase tracking-wide mb-1">Invoices Activity</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase">Invoice Timeline Overview</p>
            </div>
            <Button variant="secondary" className="h-8 px-3 text-[10px] font-bold tracking-widest border-rose-100">
              DOWNLOAD REPORT
            </Button>
          </div>
          <div className="flex-1 min-h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'transparent' }} content={() => null} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                  {weeklyActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#7B2C34" fillOpacity={index === 5 ? 1 : 0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Financial Snapshot Section */}
      <h2 className="text-lg font-bold text-slate-700 mb-4 px-2">Financial Snapshot</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {snapshots.map((item, idx) => (
          <Card key={idx} className="p-5 flex flex-col justify-between relative group hover:shadow-md transition-all">
            <div>
              <div className="text-2xl font-bold text-slate-800 mb-1">{item.value}</div>
              <div className="text-xs font-semibold text-slate-400 mb-3">{item.label}</div>
              <div className={`text-[10px] font-bold ${item.detailColor}`}>{item.detail}</div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Ticket size={16} className="text-[#7B2C34]/20" />
            </div>
          </Card>
        ))}
      </div>

      {/* Invoice Register Section */}
      <h2 className="text-lg font-bold text-slate-700 mb-4 px-2">Invoice Register</h2>
      <Card className="overflow-hidden border-none shadow-sm rounded-xl mb-12">
        <div className="flex items-center gap-8 border-b border-slate-100 px-6 py-4 overflow-x-auto no-scrollbar">
          {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`text-[11px] font-bold tracking-widest pb-1 transition-all relative ${activeTab === tab ? 'text-[#7B2C34]' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-[#7B2C34]"></div>}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc]/50 border-b border-slate-50">
              <tr>
                {['INVOICE ID', 'PROJECT', 'PO NUMBER', 'QTY', 'AMOUNT', 'DISCOUNT', 'STATUS', 'DUE DATE', 'ACTION'].map((head) => (
                  <th key={head} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {head} {['QTY', 'AMOUNT', 'INVOICE ID'].includes(head) && <ArrowUpDown size={10} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedInvoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-600 whitespace-nowrap">{inv.id}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-400 whitespace-nowrap">{inv.project}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-400 whitespace-nowrap">{inv.po}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-600">{inv.qty}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-700">₹{inv.amount}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-400">{inv.discount}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">{inv.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="text-[#7B2C34]/40 hover:text-[#7B2C34] transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="text-[#7B2C34]/40 hover:text-[#7B2C34] transition-colors"><Download size={16} /></button>
                      <button className="text-[#7B2C34]/40 hover:text-[#7B2C34] transition-colors"><Share2 size={16} /></button>
                      <button className="text-[#7B2C34]/40 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredInvoices.length)} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all"
              >
                <ArrowLeft size={14} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#7B2C34] text-white border-[#7B2C34]' : 'border border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all rotate-180"
              >
                <ArrowLeft size={14} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentTracking;