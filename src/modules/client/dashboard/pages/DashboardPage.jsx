import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useGetClientDashboardQuery, useGetProjectDashboardQuery } from '../../../../services/apiSlice';
import { setSelectedProjectId } from '../../../../app/dashboardSlice';
import { cn, formatCurrency, formatDate, daysFromNow } from '../../../../utils/utils';
import { MetricCard } from '../components/MetricCard';
import { MetricSmall } from '../components/MetricSmall';
import { PhaseTimeline } from '../components/PhaseTimeline';
import { GoalItem } from '../components/GoalItem';
import { MilestoneItem } from '../components/MilestoneItem';

const DONUT_COLORS = ['#7B2C34', '#F1F5F9'];

/* ═══════════════════ MAIN PAGE ═══════════════════ */
const DashboardPage = () => {
  const dispatch = useDispatch();
  const userEmail = localStorage.getItem('user_email');
  const selectedProjectId = useSelector((state) => state.dashboard.selectedProjectId);
  
  // ── 1. Fetch Client Summary (Projects list) ──
  const { 
    data: clientData, 
    isLoading: isClientLoading, 
    error: clientError 
  } = useGetClientDashboardQuery(userEmail, { skip: !userEmail });

  // ── 2. Fetch Detailed Project Data (for selected project) ──
  // We skip this if we already have initial_project_details for the first project
  const shouldSkipDetails = !selectedProjectId || 
    (clientData?.initial_project_details?.projectNo === selectedProjectId);

  const { 
    data: selectedProjectData, 
    isLoading: isProjectLoading, 
    error: projectError 
  } = useGetProjectDashboardQuery(selectedProjectId, { 
    skip: shouldSkipDetails 
  });

  // Determine which data to show
  const activeProject = selectedProjectId === clientData?.initial_project_details?.projectNo
    ? clientData.initial_project_details
    : selectedProjectData;

  const isAnyLoading = isClientLoading || (isProjectLoading && !shouldSkipDetails);

  // ── Effects ──
  useEffect(() => {
    // Set default project on load if none selected
    if (clientData?.projects?.length > 0 && !selectedProjectId) {
      dispatch(setSelectedProjectId(clientData.projects[0].project_id));
    }
  }, [clientData, selectedProjectId, dispatch]);

  const [showProjectDropdown, setShowProjectDropdown] = React.useState(false);

  const selectedProject = useMemo(() => {
    return clientData?.projects?.find((p) => p.project_id === selectedProjectId);
  }, [clientData, selectedProjectId]);

  // Debugging log (keep briefly for verification)
  useEffect(() => {
    if (activeProject) {
      console.log('Project Details Loaded:', activeProject);
    }
  }, [activeProject]);

  const userName = localStorage.getItem('user_name') || clientData?.client_name || 'User';
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  /* ── Loading state ── */
  if (isClientLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading your dashboard…</p>
      </div>
    );
  }

  /* ── Error state ── */
  if (clientError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-sm text-slate-600 font-medium">Failed to load dashboard</p>
        <p className="text-xs text-slate-400">{clientError?.data?.detail || 'Please try again later.'}</p>
        <button onClick={() => window.location.reload()} className="mt-2 px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  if (!clientData) return null;

  const phases = activeProject?.phases || [];
  const progressPercent = activeProject?.progress_percent || 0;
  const totalActualAmount = activeProject?.total_actual_amount || 0;
  const totalRemainingAmount = activeProject?.total_remaining_amount || 0;
  const paymentCompletedPercent = activeProject?.payment_completed_percent || 0;
  const paymentPendingPercent = activeProject?.payment_pending_percent || 0;
  const overallValue = activeProject?.overallProjectValue || 0;

  // Derived phase counts (keep for summary view if needed, but projectDetails could also provide these)
  const completedPhases = phases.filter((p) => p.status === 'completed').length;
  const ongoingPhases = phases.filter((p) => p.status === 'ongoing').length;
  const pendingPhases = phases.filter((p) => p.status === 'pending').length;

  // Budget used % based on actual billing vs overall value
  const budgetUsedPercent = overallValue > 0 ? Math.round((totalActualAmount / overallValue) * 100) : 0;

  // Donut data for delivery
  const donutData = [
    { name: 'Complete', value: progressPercent },
    { name: 'Remaining', value: 100 - progressPercent },
  ];

  // Build bar data from phases for financial view
  const barData = phases.map((p, i) => ({
    name: p.phaseName?.length > 12 ? p.phaseName.substring(0, 12) + '…' : (p.phaseName || `Phase ${i + 1}`),
    billed: p.actualBillingAmount || 0,
    remaining: p.remainingAmount || 0,
  }));

  // Upcoming milestones = phases not completed, sorted by endDate
  const upcomingMilestones = phases
    .filter((p) => p.status !== 'completed' && p.endDate)
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  // Phase goals = all phases with status
  const phaseGoals = phases.map((p) => ({
    label: p.phaseName,
    status: p.status,
  }));

  // Find the next upcoming milestone
  const nextMilestone = upcomingMilestones[0];
  const nextMilestoneDays = nextMilestone ? daysFromNow(nextMilestone.endDate) : null;

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-slate-800 mb-1">
            Welcome, <span className="font-bold text-primary italic">{userName}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 border border-primary text-primary text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors">
            <Download size={14} /> EXPORT
          </button>
          <span className="text-sm text-slate-400 font-serif italic">{today}</span>
        </div>
      </div>

      {/* ── Project Selector ── */}
      {clientData.projects?.length > 1 && (
        <div className="relative mb-8">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm font-medium text-slate-700 hover:border-primary/30 transition-colors w-full max-w-md"
          >
            <span className="flex-1 text-left truncate">
              {selectedProject?.project_name || 'Select a project'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{selectedProjectId}</span>
            <ChevronDown size={16} className={cn('text-slate-400 transition-transform', showProjectDropdown && 'rotate-180')} />
          </button>

          {showProjectDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 w-full max-w-md overflow-hidden">
              {clientData.projects.map((p) => (
                <button
                  key={p.project_id}
                  onClick={() => {
                    dispatch(setSelectedProjectId(p.project_id));
                    setShowProjectDropdown(false);
                  }}
                  className={cn(
                    'w-full text-left px-5 py-3 text-sm hover:bg-primary/5 transition-colors flex justify-between items-center',
                    p.project_id === selectedProjectId ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600'
                  )}
                >
                  <span className="truncate">{p.project_name}</span>
                  <span className="text-[10px] text-slate-400 font-mono ml-2">{p.project_id}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Loading details ── */}
      {isProjectLoading && !shouldSkipDetails && (
        <div className="flex items-center justify-center py-20 gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="text-sm text-slate-400">Loading project details…</span>
        </div>
      )}

      {/* ── Error loading details ── */}
      {projectError && !isProjectLoading && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center mb-8">
          <p className="text-sm text-red-600 font-medium">Failed to load project details</p>
          <p className="text-xs text-red-400 mt-1">{projectError?.data?.detail || 'Please try again.'}</p>
        </div>
      )}

      {/* ── Project Dashboard Content ── */}
      {activeProject && !(isProjectLoading && !shouldSkipDetails) && (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Schedule Health"
              value={`${progressPercent}%`}
              subtitle={`${completedPhases} of ${phases.length} phases complete`}
              status={progressPercent >= 50 ? 'On Track' : 'Needs Attention'}
              statusType={progressPercent >= 50 ? 'success' : 'warning'}
            />
            <MetricCard
              title="Budget Used"
              value={`${budgetUsedPercent}%`}
              subtitle={`${formatCurrency(totalActualAmount)} used • ${formatCurrency(totalRemainingAmount)} remaining`}
              status={budgetUsedPercent <= 80 ? 'Near Forecast' : 'Over Budget'}
              statusType={budgetUsedPercent <= 80 ? 'warning' : 'danger'}
            />
            <MetricCard
              title="Active Phases"
              value={String(ongoingPhases).padStart(2, '0')}
              subtitle={`${pendingPhases} pending`}
              badges={ongoingPhases > 0 ? [`${ongoingPhases} Ongoing`] : undefined}
            />
            <MetricCard
              title="Next Milestone"
              value={nextMilestone?.phaseName?.substring(0, 20) || '—'}
              subtitle={nextMilestone ? formatDate(nextMilestone.endDate) : 'No upcoming'}
              status={nextMilestoneDays}
              statusType="warning"
            />
          </div>

          {/* Alert Bar */}
          {ongoingPhases > 0 && (
            <div className="bg-[#FFF8E7] border border-[#F5E6CC] px-4 py-3 rounded-lg flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-primary text-white flex items-center justify-center rounded-full text-[10px] font-bold italic shrink-0">
                  i
                </div>
                <p className="text-xs text-slate-700">
                  {ongoingPhases} phase{ongoingPhases > 1 ? 's' : ''} currently in progress.
                  {nextMilestone ? ` Next milestone: ${nextMilestone.phaseName} (${formatDate(nextMilestone.endDate)}).` : ''}
                </p>
              </div>
            </div>
          )}

          {/* Project Journey */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800">Project Journey</h2>
              <span className="text-xs text-slate-400 font-sans">
                {activeProject.description}
                {phases.find((p) => p.status === 'ongoing') ? ` • ${phases.find((p) => p.status === 'ongoing').phaseName}` : ''}
              </span>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 card-shadow">
              {/* Timeline */}
              {phases.length > 0 && (
                <PhaseTimeline phases={phases} />
              )}

              {/* Phase Goals + Upcoming Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                {/* Phase Goals */}
                <div>
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6">Phase Goals</h4>
                  <ul className="space-y-4">
                    {phaseGoals.map((goal, idx) => (
                      <GoalItem
                        key={idx}
                        completed={goal.status === 'completed'}
                        active={goal.status === 'ongoing'}
                        label={goal.label}
                      />
                    ))}
                  </ul>

                  {/* Forecast */}
                  {nextMilestone && (
                    <div className="mt-10 p-4 border border-dashed border-primary/20 bg-primary/5 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">
                          Next: {nextMilestone.phaseName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Target: {formatDate(nextMilestone.endDate)}
                        </div>
                      </div>
                      <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">
                        {progressPercent}% Complete
                      </div>
                    </div>
                  )}
                </div>

                {/* Upcoming Milestones */}
                <div>
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6">Upcoming Milestones</h4>
                  <div className="space-y-2">
                    {upcomingMilestones.length > 0 ? (
                      upcomingMilestones.map((ms, idx) => (
                        <MilestoneItem
                          key={idx}
                          label={ms.phaseName}
                          date={formatDate(ms.endDate)}
                          days={daysFromNow(ms.endDate)}
                        />
                      ))
                    ) : (
                      phases.filter((p) => p.status === 'completed').length === phases.length ? (
                        <p className="text-xs text-emerald-500 font-medium">All phases completed! 🎉</p>
                      ) : (
                        <p className="text-xs text-slate-400">No upcoming milestones with dates</p>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Grid: Delivery Overview & Financial Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Delivery Overview */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-800">Delivery Overview</h2>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 card-shadow flex-1">
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={0}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {donutData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-slate-800">{progressPercent}%</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Complete</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 w-full mt-10">
                    <MetricSmall label="Completed" value={String(completedPhases).padStart(2, '0')} color="text-emerald-500" />
                    <MetricSmall label="Ongoing" value={String(ongoingPhases).padStart(2, '0')} color="text-amber-500" />
                    <MetricSmall label="Pending" value={String(pendingPhases).padStart(2, '0')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Snapshot */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-800">Financial Snapshot</h2>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 card-shadow flex-1">
                <h3 className="text-lg font-serif italic mb-8 text-slate-600">Budget overview</h3>

                {barData.length > 0 ? (
                  <div className="h-64 w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fill: '#94A3B8' }}
                          dy={10}
                          interval={0}
                          angle={-20}
                          textAnchor="end"
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#94A3B8' }}
                          tickFormatter={(v) => {
                            if (v >= 100000) return `${(v / 100000).toFixed(0)}L`;
                            if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
                            return v;
                          }}
                        />
                        <Tooltip
                          cursor={{ fill: '#F8FAFC' }}
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Bar dataKey="billed" fill="#7B2C34" radius={[2, 2, 0, 0]} barSize={12} name="Billed" />
                        <Bar dataKey="remaining" fill="#F59E0B" radius={[2, 2, 0, 0]} barSize={12} name="Remaining" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-sm text-slate-400">No financial data available</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <MetricSmall label="Total Billed" value={formatCurrency(totalActualAmount)} />
                  <MetricSmall label="Remaining" value={formatCurrency(totalRemainingAmount)} color="text-amber-500" />
                  <MetricSmall label="Payment Received" value={`${paymentCompletedPercent}%`} color="text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
