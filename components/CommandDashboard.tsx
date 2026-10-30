import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Database, ArrowLeft,
  Users, Trash2, RefreshCw,
  ScanFace, ShieldAlert, Clock, AlertTriangle,
  FolderOpen, Activity, Plus, Search, Filter,
  TrendingUp, Eye, Zap, Shield, ChevronRight,
  FileText, Calendar, Mars, Venus, CircleDashed
} from 'lucide-react';
import toast from 'react-hot-toast';
import AddSubjectDialog from './AddSubjectDialog';
import CaseDetailModal from './CaseDetailModal';
import {
  listSuspects, deleteSuspect, scanSketchAgainstDatabase,
  SuspectRecord, MatchResult, CATEGORY_LABEL, SuspectCategory
} from '../services/supabaseService';
import { seedCriminals } from '../services/seedCriminals';

interface CommandDashboardProps {
  onBack: () => void;
  currentSketchUrl?: string;
}

// ─── Badge Styles ─────────────────────────────────────────────────────────────

const CATEGORY_BADGE: Record<SuspectCategory, string> = {
  known_offender:     'text-red-400 bg-red-950/40 border-red-700/50',
  missing_person:     'text-amber-400 bg-amber-950/40 border-amber-700/50',
  person_of_interest: 'text-cyan-400 bg-cyan-950/40 border-cyan-700/50',
  generated_sketch:   'text-violet-400 bg-violet-950/40 border-violet-700/50',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  trend?: string;
}> = ({ label, value, icon, accent, iconBg, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-xl border border-slate-800/60 p-5 group hover:border-slate-700/60 transition-all duration-300"
    style={{
      background: 'linear-gradient(135deg, rgba(15,20,32,0.8) 0%, rgba(10,14,24,0.9) 100%)',
      backdropFilter: 'blur(12px)',
    }}
  >
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${accent} flex-shrink-0`}>
        {icon}
      </div>
      {trend && (
        <span className="text-[10px] font-mono text-teal-500 bg-teal-950/40 border border-teal-800/40 px-1.5 py-0.5 rounded flex items-center gap-1">
          <TrendingUp size={8} />{trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className={`text-3xl font-bold font-mono ${accent}`}>{value}</p>
      <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1">{label}</p>
    </div>
    {/* Subtle glow */}
    <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10 blur-xl ${iconBg}`} />
  </motion.div>
);

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
    <div>
      <h2 className="text-base font-bold text-slate-100 tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 font-mono mt-0.5">{subtitle}</p>}
    </div>
    {children && <div className="flex items-center gap-2">{children}</div>}
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800/60 flex items-center justify-center text-slate-700">
      {icon}
    </div>
    <div className="text-center space-y-1">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="text-xs text-slate-600 font-mono max-w-xs">{description}</p>
    </div>
    {action}
  </div>
);

// ─── View: Overview ───────────────────────────────────────────────────────────

const OverviewView: React.FC<{ suspects: SuspectRecord[]; currentSketchUrl?: string }> = ({ suspects, currentSketchUrl }) => {
  const known   = suspects.filter(s => s.category === 'known_offender').length;
  const missing = suspects.filter(s => s.category === 'missing_person').length;
  const poi     = suspects.filter(s => s.category === 'person_of_interest').length;
  const sketches = suspects.filter(s => s.name.startsWith('[SKETCH]')).length;
  const dbSubjects = suspects.filter(s => !s.name.startsWith('[SKETCH]')).length;

  const stats = [
    { label: 'Total Records', value: suspects.length, icon: <Database size={18} />, accent: 'text-cyan-400', iconBg: 'bg-cyan-500/10 border border-cyan-500/20', trend: undefined },
    { label: 'Known Offenders', value: known, icon: <ShieldAlert size={18} />, accent: 'text-red-400', iconBg: 'bg-red-500/10 border border-red-500/20', trend: undefined },
    { label: 'Missing Persons', value: missing, icon: <Activity size={18} />, accent: 'text-amber-400', iconBg: 'bg-amber-500/10 border border-amber-500/20', trend: undefined },
    { label: 'Case Sketches', value: sketches, icon: <FileText size={18} />, accent: 'text-violet-400', iconBg: 'bg-violet-500/10 border border-violet-500/20', trend: undefined },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative rounded-2xl overflow-hidden p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(6,78,59,0.3) 0%, rgba(7,89,133,0.3) 50%, rgba(30,27,75,0.4) 100%)',
          border: '1px solid rgba(34,211,238,0.12)',
        }}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">System Online</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">F.A.C.E.S. Intelligence Hub</h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Forensic Analysis & Composite Evidence System. Monitor suspects, run biometric scans, and manage case sketches from this central command dashboard.
          </p>
          {currentSketchUrl && (
            <div className="mt-4 flex items-center gap-3 bg-black/30 border border-cyan-700/30 rounded-lg px-3 py-2 w-fit">
              <img src={currentSketchUrl} alt="Active sketch" className="w-8 h-8 rounded object-cover border border-slate-700" />
              <div>
                <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Active Composite</p>
                <p className="text-xs text-slate-300">Sketch loaded — ready for database scan</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-2" />
            </div>
          )}
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-full opacity-5"
          style={{ background: 'radial-gradient(ellipse at right, rgba(34,211,238,1) 0%, transparent 70%)' }} />
      </div>

      {/* Stats grid */}
      <div>
        <SectionHeader title="Database Overview" subtitle="Live statistics from the forensic database" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-xl border border-slate-800/50 overflow-hidden"
        style={{ background: 'rgba(15,20,32,0.6)', backdropFilter: 'blur(12px)' }}>
        <div className="px-5 py-4 border-b border-slate-800/50 flex items-center gap-2">
          <Filter size={13} className="text-slate-500" />
          <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest">Category Distribution</span>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Known Offenders',     count: known,     color: 'bg-red-500',    text: 'text-red-400' },
            { label: 'Missing Persons',     count: missing,   color: 'bg-amber-500',  text: 'text-amber-400' },
            { label: 'Persons of Interest', count: poi,       color: 'bg-cyan-500',   text: 'text-cyan-400' },
            { label: 'Generated Sketches',  count: sketches,  color: 'bg-violet-500', text: 'text-violet-400' },
          ].map(row => (
            <div key={row.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">{row.label}</span>
                <span className={`${row.text} font-bold`}>{row.count}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: dbSubjects > 0 ? `${(row.count / Math.max(suspects.length, 1)) * 100}%` : '0%' }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className={`h-full ${row.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {suspects.length === 0 && (
        <EmptyState
          icon={<Database size={32} />}
          title="No records found"
          description="Add subjects to the forensic database to get started."
        />
      )}
    </div>
  );
};

// ─── View: Biometric Database ──────────────────────────────────────────────────

const DatabaseView: React.FC<{
  suspects: SuspectRecord[];
  isLoading: boolean;
  onRefresh: () => void;
}> = ({ suspects, isLoading, onRefresh }) => {
  const [searchQuery,    setSearchQuery]    = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SuspectCategory | 'all'>('all');
  const [genderFilter,   setGenderFilter]   = useState<'all' | 'male' | 'female' | 'unknown'>('all');
  const [isSeeding,      setIsSeeding]      = useState(false);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = suspects.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch   = !q || s.name.toLowerCase().includes(q) || (s.description ?? '').toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    const matchesGender   = genderFilter   === 'all' || (s.gender ?? 'unknown') === genderFilter;
    return matchesSearch && matchesCategory && matchesGender;
  });

  const countCat = (v: SuspectCategory | 'all') =>
    v === 'all' ? suspects.length : suspects.filter(s => s.category === v).length;
  const countGen = (v: 'all' | 'male' | 'female' | 'unknown') =>
    v === 'all' ? suspects.length : suspects.filter(s => (s.gender ?? 'unknown') === v).length;

  const hasFilter = categoryFilter !== 'all' || genderFilter !== 'all' || searchQuery.trim() !== '';
  const clearFilters = () => { setSearchQuery(''); setCategoryFilter('all'); setGenderFilter('all'); };

  const handleSeed = async () => {
    if (!window.confirm('Upload all criminal images from /public/criminals into Supabase? Run once only.')) return;
    setIsSeeding(true);
    const tid = toast.loading('Seeding database...');
    try {
      const { ok, failed } = await seedCriminals();
      toast.success(`Seeded ${ok.length} records${failed.length > 0 ? `, ${failed.length} failed` : ''}.`, { id: tid });
      onRefresh();
    } catch { toast.error('Seeding failed.', { id: tid }); }
    finally { setIsSeeding(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete "${name}"?`)) return;
    const tid = toast.loading(`Deleting "${name}"...`);
    try {
      await deleteSuspect(id);
      toast.success('Deleted.', { id: tid });
      onRefresh();
    } catch { toast.error('Failed to delete.', { id: tid }); }
  };

  // ── Reusable pill components ───────────────────────────────────────────────
  const CatPill = ({ value, label }: { value: SuspectCategory | 'all'; label: string }) => {
    const active = categoryFilter === value;
    const colors: Record<string, string> = {
      all:                 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.1)]',
      known_offender:      'bg-red-950/50  border-red-700/60  text-red-300  shadow-[0_0_10px_rgba(239,68,68,0.1)]',
      missing_person:      'bg-amber-950/50 border-amber-600/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
      person_of_interest:  'bg-violet-950/50 border-violet-700/60 text-violet-300 shadow-[0_0_10px_rgba(139,92,246,0.1)]',
    };
    return (
      <button
        onClick={() => setCategoryFilter(value)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono uppercase tracking-wider transition-all duration-150 ${
          active ? colors[value] : 'text-slate-500 border-slate-800/50 bg-transparent hover:border-slate-700/60 hover:text-slate-400'
        }`}
      >
        {label}
        <span className={`text-[9px] min-w-[18px] text-center px-1 py-0.5 rounded ${active ? 'bg-white/10 font-bold' : 'bg-slate-800/60 text-slate-600'}`}>
          {countCat(value)}
        </span>
      </button>
    );
  };

  const GenPill = ({ value, label, icon }: { value: 'all' | 'male' | 'female' | 'unknown'; label: string; icon: React.ReactNode }) => {
    const active = genderFilter === value;
    const colors: Record<string, string> = {
      all:     'bg-slate-800/70 border-slate-600/60 text-slate-200',
      male:    'bg-blue-950/50 border-blue-700/60 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
      female:  'bg-pink-950/50 border-pink-700/60 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.1)]',
      unknown: 'bg-slate-800/50 border-slate-700/60 text-slate-400',
    };
    return (
      <button
        onClick={() => setGenderFilter(value)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono uppercase tracking-wider transition-all duration-150 ${
          active ? colors[value] : 'text-slate-600 border-slate-800/50 bg-transparent hover:border-slate-700/60 hover:text-slate-500'
        }`}
      >
        {icon}
        {label}
        <span className={`text-[9px] min-w-[18px] text-center px-1 py-0.5 rounded ${active ? 'bg-white/10 font-bold' : 'bg-slate-800/60 text-slate-600'}`}>
          {countGen(value)}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Biometric Database"
        subtitle={`${suspects.length} subjects in the forensic registry`}
      >
        <button onClick={onRefresh} disabled={isLoading}
          className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 rounded-lg border border-slate-800/60 hover:border-slate-700/60 transition-all">
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>
        <button onClick={handleSeed} disabled={isSeeding || isLoading}
          className="px-3 py-1.5 text-xs font-mono text-amber-500 hover:text-amber-300 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-800/40 hover:border-amber-700/50 rounded-lg transition-all disabled:opacity-40">
          {isSeeding ? 'Seeding...' : 'Seed DB'}
        </button>
        <AddSubjectDialog onSuccess={onRefresh} />
      </SectionHeader>

      {/* ── Filter panel ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-800/50 overflow-hidden"
        style={{ background: 'rgba(10,14,24,0.75)', backdropFilter: 'blur(14px)' }}>

        {/* Search row */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-800/50">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full bg-slate-900/60 border border-slate-800/50 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-700/50 focus:ring-1 focus:ring-cyan-700/20 font-mono transition-all"
            />
          </div>
        </div>

        {/* Category filter row */}
        <div className="px-4 py-3 border-b border-slate-800/50">
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-2">Classification</p>
          <div className="flex flex-wrap gap-2">
            <CatPill value="all"                label="All" />
            <CatPill value="known_offender"     label="Known Offender" />
            <CatPill value="missing_person"     label="Missing Person" />
            <CatPill value="person_of_interest" label="Person of Interest" />
          </div>
        </div>

        {/* Gender filter row */}
        <div className="px-4 py-3">
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-2">Gender</p>
          <div className="flex flex-wrap gap-2">
            <GenPill value="all"     label="All"     icon={<Filter       size={10} />} />
            <GenPill value="male"    label="Male"    icon={<Mars         size={10} />} />
            <GenPill value="female"  label="Female"  icon={<Venus        size={10} />} />
            <GenPill value="unknown" label="Unknown" icon={<CircleDashed size={10} />} />
          </div>
        </div>

        {/* Result summary + clear */}
        {hasFilter && (
          <div className="px-4 py-2 border-t border-slate-800/40 flex items-center justify-between"
            style={{ background: 'rgba(6,10,18,0.5)' }}>
            <span className="text-[10px] font-mono text-slate-600">
              <span className="text-cyan-400 font-bold">{filtered.length}</span> of {suspects.length} subjects
            </span>
            <button onClick={clearFilters}
              className="text-[10px] font-mono text-slate-600 hover:text-cyan-400 transition-colors uppercase tracking-wider">
              Clear all ×
            </button>
          </div>
        )}
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <EmptyState icon={<RefreshCw size={28} className="animate-spin text-cyan-600" />}
          title="Loading records..." description="Fetching subjects from the forensic database." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Database size={32} />}
          title={hasFilter ? 'No matching subjects' : 'No subjects yet'}
          description={hasFilter ? 'No records match your current filters.' : 'Add the first subject to get started.'}
          action={hasFilter
            ? <button onClick={clearFilters} className="text-sm font-mono text-cyan-500 hover:text-cyan-300 transition-colors">Clear all filters</button>
            : <AddSubjectDialog onSuccess={onRefresh} />
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((s, i) => (
              <motion.div key={s.id} layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="group relative rounded-xl border border-slate-800/50 overflow-hidden hover:border-slate-700/70 transition-all duration-300"
                style={{ background: 'linear-gradient(160deg,rgba(15,20,32,0.9) 0%,rgba(10,14,24,0.95) 100%)', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  {s.image_url
                    ? <img src={s.image_url} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center text-slate-800"><Users size={40} /></div>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(s.id, s.name)}
                      className="p-1.5 bg-red-950/80 text-red-400 hover:bg-red-900 rounded-lg border border-red-800/50 transition-colors">
                      <Trash2 size={11} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`text-[9px] font-mono uppercase tracking-widest border px-1.5 py-0.5 rounded-md ${CATEGORY_BADGE[s.category] ?? CATEGORY_BADGE.person_of_interest}`}>
                      {CATEGORY_LABEL[s.category] ?? s.category}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3 space-y-1.5">
                  <p className="text-sm font-semibold text-slate-200 truncate">{s.name}</p>
                  {s.description && <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{s.description}</p>}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    <div className="flex items-center gap-1">
                      <Calendar size={9} className="text-slate-700" />
                      <span className="text-[10px] font-mono text-slate-700">{new Date(s.created_at).toLocaleDateString()}</span>
                    </div>
                    {s.gender && s.gender !== 'unknown' && (
                      <span className={`flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider border px-1.5 py-0.5 rounded-md ${
                        s.gender === 'male' ? 'text-blue-400 border-blue-800/50 bg-blue-950/30' : 'text-pink-400 border-pink-800/50 bg-pink-950/30'
                      }`}>
                        {s.gender === 'male' ? <Mars size={9} /> : <Venus size={9} />}
                        {s.gender}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};




// ─── View: Case History ────────────────────────────────────────────────────────

const CaseHistoryView: React.FC<{
  suspects: SuspectRecord[];
  isLoading: boolean;
  onRefresh: () => void;
}> = ({ suspects, isLoading, onRefresh }) => {
  const [selectedCase, setSelectedCase] = useState<SuspectRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sketches = suspects
    .filter(s => s.name.startsWith('[SKETCH]'))
    .map(s => ({ ...s, name: s.name.replace('[SKETCH] ', '') }));

  const filtered = sketches.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete case "${name}"?`)) return;
    const tid = toast.loading('Deleting case record...');
    try {
      await deleteSuspect(id);
      toast.success('Case deleted.', { id: tid });
      onRefresh();
    } catch { toast.error('Failed to delete.', { id: tid }); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Case History"
        subtitle={`${sketches.length} saved composite sketch${sketches.length !== 1 ? 'es' : ''}`}
      >
        <button onClick={onRefresh} disabled={isLoading}
          className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 rounded-lg border border-slate-800/60 hover:border-slate-700/60 transition-all">
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </SectionHeader>

      {/* Search */}
      {sketches.length > 0 && (
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search case files..."
            className="w-full bg-slate-900/60 border border-slate-800/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-700/60 focus:ring-1 focus:ring-cyan-700/30 font-mono transition-all"
          />
        </div>
      )}

      {isLoading ? (
        <EmptyState icon={<RefreshCw size={28} className="animate-spin text-cyan-600" />}
          title="Loading cases..." description="Fetching case records." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={32} />}
          title={searchQuery ? 'No results' : 'No case files yet'}
          description={searchQuery ? 'Try a different search term.' : 'Save a generated sketch to create your first case file.'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.22, delay: i * 0.05 }}
                onClick={() => setSelectedCase(s)}
                className="group relative rounded-xl border border-slate-800/50 overflow-hidden cursor-pointer hover:border-cyan-700/40 transition-all duration-300"
                style={{
                  background: 'linear-gradient(160deg, rgba(15,20,32,0.9) 0%, rgba(10,14,24,0.95) 100%)',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                  style={{ boxShadow: 'inset 0 0 30px rgba(34,211,238,0.04)' }} />

                {/* Photo */}
                <div className="relative aspect-[3/2] bg-slate-950 overflow-hidden">
                  {s.image_url ? (
                    <img src={s.image_url} alt={s.name} className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-800"><Users size={40} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-slate-900/90 border border-cyan-700/50 rounded-lg px-3 py-2 flex items-center gap-2 text-xs font-mono text-cyan-300">
                      <Eye size={12} />
                      View Case File
                    </div>
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-500/40" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-500/40" />

                  {/* Delete btn */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={e => { e.stopPropagation(); handleDelete(s.id, s.name); }}>
                    <button className="p-1.5 bg-red-950/80 text-red-400 hover:bg-red-900 rounded-lg border border-red-800/50 transition-colors">
                      <Trash2 size={11} />
                    </button>
                  </div>

                  {/* Case badge */}
                  <div className="absolute top-2 left-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest border border-violet-700/40 bg-violet-950/60 text-violet-400 px-1.5 py-0.5 rounded-md">
                      Case Sketch
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-200 leading-tight">{s.name}</p>
                    <ChevronRight size={14} className="text-slate-700 group-hover:text-cyan-500 transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                  {s.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{s.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/50">
                    <div className="flex items-center gap-1">
                      <Calendar size={9} className="text-slate-700" />
                      <span className="text-[10px] font-mono text-slate-600">
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-700 border border-slate-800 px-1.5 py-0.5 rounded">
                      #{s.id.slice(0, 6).toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Case Detail Modal */}
      <CaseDetailModal
        suspect={selectedCase}
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </div>
  );
};

// ─── View: Match / Scan ────────────────────────────────────────────────────────

const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => {
  const color = score >= 75 ? 'bg-teal-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  const text  = score >= 75 ? 'text-teal-400' : score >= 50 ? 'text-amber-400' : 'text-red-400';
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
      <span className={`text-xs font-mono font-bold ${text} w-12 text-right`}>{score.toFixed(1)}%</span>
    </div>
  );
};

const MatchScanView: React.FC<{
  suspects: SuspectRecord[];
  currentSketchUrl?: string;
}> = ({ suspects, currentSketchUrl }) => {
  const [results, setResults]   = useState<MatchResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [ran, setRan]           = useState(false);

  const runScan = async () => {
    if (!currentSketchUrl) {
      toast.error('No composite sketch active. Complete an interview first.');
      return;
    }
    if (suspects.filter(s => s.image_url).length === 0) {
      toast.error('No subjects with photos in the database.');
      return;
    }
    setScanning(true);
    setResults([]);
    setProgress({ done: 0, total: 0 });
    const tid = toast.loading('Scanning forensic database...');
    try {
      const res = await scanSketchAgainstDatabase(currentSketchUrl, (done, total) => setProgress({ done, total }));
      setResults(res);
      setRan(true);
      const matches = res.filter(r => r.match).length;
      toast.success(`Scan complete — ${matches} match${matches !== 1 ? 'es' : ''} found.`, { id: tid });
    } catch (err) {
      console.error(err);
      toast.error('Database scan failed.', { id: tid });
    } finally { setScanning(false); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Biometric Match Scan" subtitle="Compare the active composite against all database subjects">
        <button
          onClick={runScan}
          disabled={scanning}
          className="flex items-center gap-2 bg-cyan-700/20 hover:bg-cyan-700/30 disabled:opacity-50 text-cyan-300 border border-cyan-700/50 px-4 py-2 rounded-xl text-sm font-mono uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
        >
          <ScanFace size={15} className={scanning ? 'animate-pulse' : ''} />
          {scanning ? 'Scanning...' : 'Run DB Scan'}
        </button>
      </SectionHeader>

      {/* Sketch preview */}
      <div className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${currentSketchUrl ? 'border-cyan-800/30 bg-cyan-950/10' : 'border-amber-800/20 bg-amber-950/10'}`}>
        {currentSketchUrl ? (
          <>
            <img src={currentSketchUrl} alt="Active sketch" className="w-16 h-16 rounded-lg object-cover border border-slate-700" />
            <div>
              <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">Active Composite Loaded</p>
              <p className="text-sm text-slate-300">Sketch ready for biometric comparison</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </>
        ) : (
          <>
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-500/80 font-mono">
              No active sketch — complete an AI interview to generate a composite first.
            </p>
          </>
        )}
      </div>

      {/* Progress bar while scanning */}
      {scanning && progress.total > 0 && (
        <div className="space-y-2 rounded-xl border border-slate-800/50 bg-slate-900/40 p-4">
          <div className="flex justify-between text-xs font-mono text-slate-500">
            <span>Comparing against subjects...</span>
            <span className="text-cyan-400">{progress.done} / {progress.total}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%` }}
              className="h-full bg-cyan-600 rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {ran && !scanning && (
        results.length === 0 ? (
          <EmptyState icon={<Search size={28} />} title="No subjects to compare" description="Add subjects with photos to the database first." />
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">Results — sorted by confidence</p>
            {results.map((r, i) => (
              <motion.div
                key={r.suspect.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-xl border p-4 transition-all ${r.match ? 'border-teal-700/40 bg-teal-950/10' : 'border-slate-800/50 bg-slate-900/30'}`}
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnails */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="relative w-14 h-14 rounded-lg border border-slate-700 overflow-hidden bg-slate-950">
                      {currentSketchUrl && <img src={currentSketchUrl} alt="Sketch" className="w-full h-full object-cover" />}
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[7px] text-cyan-400 font-mono text-center py-0.5">SKETCH</div>
                    </div>
                    <span className="text-slate-700 text-sm">↔</span>
                    <div className="relative w-14 h-14 rounded-lg border border-slate-700 overflow-hidden bg-slate-950">
                      {r.suspect.image_url
                        ? <img src={r.suspect.image_url} alt={r.suspect.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Users size={18} className="text-slate-700" /></div>}
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[7px] text-violet-400 font-mono text-center py-0.5">DB</div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{r.suspect.name}</p>
                        <span className={`text-[9px] font-mono uppercase border px-1.5 py-0.5 rounded-md ${CATEGORY_BADGE[r.suspect.category]}`}>
                          {CATEGORY_LABEL[r.suspect.category]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 text-[10px] font-mono text-slate-600">
                        <Clock size={10} />
                        {new Date(r.suspect.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <ConfidenceBar score={r.confidence_score} />

                    <div>
                      {r.match ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-teal-400 bg-teal-950/30 border border-teal-800/40 px-2 py-0.5 rounded-md">
                          <ShieldAlert size={9} /> Potential Match
                        </span>
                      ) : r.confidence_score >= 50 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-950/30 border border-amber-800/40 px-2 py-0.5 rounded-md">
                          <AlertTriangle size={9} /> Inconclusive
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-slate-500 bg-slate-800/50 border border-slate-700/50 px-2 py-0.5 rounded-md">
                          No Match
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <p className="text-[11px] text-slate-700 font-mono text-center pt-2 border-t border-slate-800">
              ⚠ Cross-domain matching (2D sketch → photograph) requires human expert verification.
            </p>
          </div>
        )
      )}

      {!ran && !scanning && (
        <EmptyState
          icon={<ScanFace size={32} />}
          title="Ready to scan"
          description="Run a database scan to compare the active composite sketch against all registered subjects."
        />
      )}
    </div>
  );
};

// ─── Nav Tabs ──────────────────────────────────────────────────────────────────

type TabId = 'overview' | 'database' | 'case_history' | 'matches';

const NAV_TABS: { id: TabId; label: string; shortLabel: string; icon: React.ReactNode; description: string }[] = [
  { id: 'overview',     label: 'Overview',           shortLabel: 'Home',     icon: <LayoutDashboard size={16} />, description: 'System status & stats' },
  { id: 'database',     label: 'Biometric Database', shortLabel: 'Database', icon: <Database size={16} />,       description: 'Manage subjects' },
  { id: 'case_history', label: 'Case History',       shortLabel: 'Cases',    icon: <FolderOpen size={16} />,     description: 'Saved sketches' },
  { id: 'matches',      label: 'Match / Scan',       shortLabel: 'Scan',     icon: <ScanFace size={16} />,       description: 'Run biometric scan' },
];

// ─── Main Component ────────────────────────────────────────────────────────────

const CommandDashboard: React.FC<CommandDashboardProps> = ({ onBack, currentSketchUrl }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [suspects, setSuspects]   = useState<SuspectRecord[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);

  const fetchSuspects = useCallback(async () => {
    setIsLoadingDb(true);
    try {
      setSuspects(await listSuspects());
    } catch (err) {
      console.error(err);
      toast.error('Failed to load forensic database.');
    } finally {
      setIsLoadingDb(false);
    }
  }, []);

  useEffect(() => { fetchSuspects(); }, [fetchSuspects]);

  const dbSubjects = suspects.filter(s => !s.name.startsWith('[SKETCH]'));
  const sketches   = suspects.filter(s => s.name.startsWith('[SKETCH]'));

  return (
    <div className="h-full flex flex-col text-white overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #080c14 0%, #0a0e18 40%, #060910 100%)' }}>

      {/* Top Bar */}
      <div className="flex-shrink-0 border-b border-slate-800/50 px-5 py-3 flex items-center justify-between gap-4"
        style={{ background: 'rgba(8,12,20,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors text-xs font-mono group bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>HOME</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Shield size={18} className="text-cyan-500" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 tracking-widest uppercase font-mono">
                F.A.C.E.S.
              </span>
              <span className="text-xs text-slate-600 font-mono ml-2 hidden sm:inline">Command Dashboard</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {currentSketchUrl && (
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-500 bg-cyan-950/30 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Composite Active
            </div>
          )}
          <span className="text-[10px] font-mono text-slate-600 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Side Nav */}
        <aside className="flex-shrink-0 w-16 sm:w-56 border-r border-slate-800/40 flex flex-col py-4"
          style={{ background: 'rgba(8,12,20,0.6)', backdropFilter: 'blur(12px)' }}>
          <nav className="space-y-1 px-2 flex-1">
            {NAV_TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                      : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-300 border border-transparent hover:border-slate-800/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-cyan-500/5"
                      style={{ boxShadow: 'inset 0 0 20px rgba(34,211,238,0.05)' }}
                    />
                  )}
                  <span className={`flex-shrink-0 relative z-10 ${isActive ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {tab.icon}
                  </span>
                  <div className="hidden sm:block relative z-10 min-w-0">
                    <p className="text-xs font-semibold font-mono uppercase tracking-wide truncate">{tab.label}</p>
                    <p className={`text-[10px] font-mono truncate mt-0.5 ${isActive ? 'text-cyan-500/70' : 'text-slate-700'}`}>{tab.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* System status footer */}
          <div className="mt-4 mx-3 hidden sm:block">
            <div className="rounded-xl border border-slate-800/50 p-3 space-y-2"
              style={{ background: 'rgba(15,20,32,0.6)' }}>
              <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest text-center">System Status</p>
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-teal-500">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                Operational
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-700">
                <span>DB Records</span>
                <span className="text-slate-500">{dbSubjects.length}</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-700">
                <span>Case Files</span>
                <span className="text-slate-500">{sketches.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(51,65,85,0.5) transparent',
          }}>
          <div className="p-5 md:p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {activeTab === 'overview' && (
                  <OverviewView suspects={suspects} currentSketchUrl={currentSketchUrl} />
                )}
                {activeTab === 'database' && (
                  <DatabaseView suspects={dbSubjects} isLoading={isLoadingDb} onRefresh={fetchSuspects} />
                )}
                {activeTab === 'case_history' && (
                  <CaseHistoryView suspects={suspects} isLoading={isLoadingDb} onRefresh={fetchSuspects} />
                )}
                {activeTab === 'matches' && (
                  <MatchScanView suspects={suspects} currentSketchUrl={currentSketchUrl} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommandDashboard;
