import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Circle,
  Users,
  Calendar,
  Loader2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { useGetProjectDashboardQuery } from '../../../../services/apiSlice';
import { cn, formatCurrency, formatDate } from '../../../../utils/utils';
import { StatusBadge } from '../components/StatusBadge';
import { MetricCard as QuickStat } from '../components/MetricCard';
import { MetricSmall as MiniStat } from '../components/MetricSmall';
import { PhaseTimeline } from '../components/PhaseTimeline';
import { PhaseCard } from '../components/PhaseCard';

const DONUT_COLORS = ['#7B2C34', '#E2E8F0'];
const PAYMENT_COLORS = ['#059669', '#F59E0B', '#E2E8F0'];

/* ── FinancialItem is just a MetricSmall with slightly different label style ── */
const FinancialItem = ({ label, value, highlight }) => {
  const highlightClass = highlight === 'emerald' ? 'text-emerald-600' : highlight === 'amber' ? 'text-amber-500' : 'text-slate-800';
  return <MiniStat label={label} value={value} color={highlightClass} />;
};

/* ═══════════════════ MAIN PAGE ═══════════════════ */
const ProjectOverviewPage = () => {
  const { projectNo } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useGetProjectDashboardQuery(projectNo, {
    skip: !projectNo,
  });

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading project details…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-sm text-slate-600 font-medium">Failed to load project</p>
        <p className="text-xs text-slate-400">{error?.data?.detail || 'Please try again later.'}</p>
        <button
          onClick={() => navigate('/client/dashboard')}
          className="mt-2 px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!project) return null;

  const {
    projectNo: pNo,
    description,
    startingDate,
    status,
    sector,
    clientType,
    projectManagerPrimus,
    overallProjectValue,
    members = [],
    phases = [],
    progress_percent = 0,
    total_actual_amount = 0,
    total_remaining_amount = 0,
    payment_completed_percent = 0,
    payment_pending_percent = 0,
  } = project;

  const completedPhases = phases.filter((p) => p.status === 'completed').length;
  const ongoingPhases = phases.filter((p) => p.status === 'ongoing').length;
  const pendingPhases = phases.filter((p) => p.status === 'pending').length;

  /* progress donut data */
  const progressData = [
    { name: 'Complete', value: progress_percent || 0 },
    { name: 'Remaining', value: 100 - (progress_percent || 0) },
  ];

  /* payment donut data */
  const paymentData = [
    { name: 'Paid', value: payment_completed_percent || 0 },
    { name: 'Pending', value: payment_pending_percent || 0 },
    { name: 'Other', value: Math.max(0, 100 - (payment_completed_percent || 0) - (payment_pending_percent || 0)) },
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* ── Back navigation ── */}
      <button
        onClick={() => navigate('/client/dashboard')}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary mb-6 group transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* ── Project Header ── */}
      <div className="bg-white rounded-2xl border border-slate-100 p-8 mb-8 shadow-[inset_0px_1px_2px_#00000008]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-wider">
                {pNo}
              </span>
              <StatusBadge status={status} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{description}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              {sector && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {sector}
                </span>
              )}
              {clientType && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {clientType}
                </span>
              )}
              {startingDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  Started {formatDate(startingDate)}
                </span>
              )}
            </div>
          </div>

          {/* Right side info */}
          <div className="flex flex-col gap-3 lg:items-end">
            {projectManagerPrimus && (
              <div className="text-xs">
                <span className="text-slate-400">Project Manager: </span>
                <span className="font-bold text-slate-700">{projectManagerPrimus}</span>
              </div>
            )}
            <div className="text-xs">
              <span className="text-slate-400">Total Value: </span>
              <span className="font-bold text-slate-700">{formatCurrency(overallProjectValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <QuickStat label="Total Phases" value={phases.length} icon={TrendingUp} />
        <QuickStat label="Completed" value={completedPhases} icon={CheckCircle2} />
        <QuickStat label="Ongoing" value={ongoingPhases} icon={Clock} />
        <QuickStat label="Team Members" value={members.length} icon={Users} />
      </div>

      {/* ── Phase Timeline ── */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Project Phases</h2>

        {phases.length > 0 ? (
          <>
            {/* Horizontal timeline */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 mb-6 shadow-[inset_0px_1px_2px_#00000008]">
              <PhaseTimeline phases={phases} />
            </div>

            {/* Phase detail cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {phases.map((phase, idx) => (
                <PhaseCard key={idx} phase={phase} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-sm text-slate-400">No phases data available</p>
          </div>
        )}
      </section>

      {/* ── Bottom Grid: Delivery + Financial ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Delivery Overview */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-800">Delivery Overview</h2>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[inset_0px_1px_2px_#00000008] flex-1">
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {progressData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-slate-800">
                    {progress_percent}%
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Complete</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                <MiniStat label="Completed" value={completedPhases} color="text-emerald-600" />
                <MiniStat label="Ongoing" value={ongoingPhases} color="text-amber-500" />
                <MiniStat label="Pending" value={pendingPhases} color="text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Snapshot */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-800">Financial Snapshot</h2>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[inset_0px_1px_2px_#00000008] flex-1">
            <h3 className="text-lg font-serif italic mb-6 text-slate-600">Payment Overview</h3>

            <div className="flex flex-col items-center mb-8">
              <div className="relative w-40 h-40 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={68}
                      paddingAngle={2}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {paymentData.map((_, index) => (
                        <Cell key={`pay-${index}`} fill={PAYMENT_COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-bold text-emerald-600">
                    {payment_completed_percent}%
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Paid</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <FinancialItem label="Total Billed" value={formatCurrency(total_actual_amount)} />
              <FinancialItem label="Remaining" value={formatCurrency(total_remaining_amount)} />
              <FinancialItem label="Payment Received" value={`${payment_completed_percent}%`} highlight="emerald" />
              <FinancialItem label="Payment Pending" value={`${payment_pending_percent}%`} highlight="amber" />
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-[10px] text-slate-400 font-medium">Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-amber-400" />
                <span className="text-[10px] text-slate-400 font-medium">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Team Members ── */}
      {members.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Team Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {members.map((m, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 shadow-[inset_0px_1px_2px_#00000008]">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {(m.memberName || m.memberID || '?')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-700">
                    {m.memberName || m.memberID}
                  </div>
                  <div className="text-[10px] text-slate-400">{m.memberID}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectOverviewPage;
