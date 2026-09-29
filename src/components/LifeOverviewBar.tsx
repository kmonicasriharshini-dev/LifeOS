import React from 'react';
import {
  Briefcase,
  BookOpen,
  Wallet,
  Target,
  Clock,
  CalendarDays,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';

export const LifeOverviewBar: React.FC = () => {
  const { computedMetrics, state, setActiveSection } = useLifeOS();

  return (
    <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-5 border border-[#EDE8F5] shadow-xs mb-6">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B29AE6]" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#5D5F74]">
            My Life Right Now
          </h2>
        </div>
        <span className="text-xs text-[#8B8D9F]">
          Connected by <span className="font-semibold text-[#523A73]">LifeOS AI</span>
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Career */}
        <button
          onClick={() => setActiveSection('career')}
          className="p-3 rounded-xl bg-[#F7F2FD] border border-[#E9DDFB] hover:border-[#D3BEF5] transition text-left cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 text-xs text-[#6B5A85] mb-1">
            <Briefcase className="w-3.5 h-3.5 text-[#8869B8]" />
            <span className="font-medium">Career</span>
          </div>
          <div className="text-sm font-bold text-[#2F3142] group-hover:text-[#523A73] transition truncate">
            {computedMetrics.careerStatus}
          </div>
          <div className="text-[11px] text-[#7A6B92] truncate">{state.career.targetRole}</div>
        </button>

        {/* Learning */}
        <button
          onClick={() => setActiveSection('learning')}
          className="p-3 rounded-xl bg-[#F0FAF3] border border-[#DDF3E4] hover:border-[#BEE8CA] transition text-left cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 text-xs text-[#3E6B4E] mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#4D8C62]" />
            <span className="font-medium">Learning</span>
          </div>
          <div className="text-sm font-bold text-[#2F3142] group-hover:text-[#235835] transition">
            {computedMetrics.learningOverallProgress}%
          </div>
          <div className="text-[11px] text-[#558264] truncate">
            {state.learning.length} active tracks
          </div>
        </button>

        {/* Finance */}
        <button
          onClick={() => setActiveSection('finance')}
          className="p-3 rounded-xl bg-[#FFF6F0] border border-[#FBE4D5] hover:border-[#F4CDB7] transition text-left cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 text-xs text-[#8A5B3D] mb-1">
            <Wallet className="w-3.5 h-3.5 text-[#B27047]" />
            <span className="font-medium">Finance</span>
          </div>
          <div className="text-sm font-bold text-[#2F3142] group-hover:text-[#7A4523] transition truncate">
            {state.finance.currency}
            {computedMetrics.remainingBudget.toLocaleString()} net
          </div>
          <div className="text-[11px] text-[#936647] truncate">
            {state.finance.currency}
            {state.finance.currentSavings.toLocaleString()} saved
          </div>
        </button>

        {/* Goals */}
        <button
          onClick={() => setActiveSection('goals')}
          className="p-3 rounded-xl bg-[#FDF2F5] border border-[#F7DCE5] hover:border-[#F2BED0] transition text-left cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 text-xs text-[#874A60] mb-1">
            <Target className="w-3.5 h-3.5 text-[#B85777]" />
            <span className="font-medium">Goals</span>
          </div>
          <div className="text-sm font-bold text-[#2F3142] group-hover:text-[#6C3448] transition">
            {computedMetrics.activeGoalsCount} Active
          </div>
          <div className="text-[11px] text-[#8C5569] truncate">Internship priority</div>
        </button>

        {/* This Week */}
        <button
          onClick={() => setActiveSection('schedule')}
          className="p-3 rounded-xl bg-[#F3F8FE] border border-[#DCEBFA] hover:border-[#B7D6F7] transition text-left cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 text-xs text-[#406894] mb-1">
            <Clock className="w-3.5 h-3.5 text-[#5489C7]" />
            <span className="font-medium">This Week</span>
          </div>
          <div className="text-sm font-bold text-[#2F3142] group-hover:text-[#2B4E74] transition">
            {computedMetrics.weeklyAvailableHours}h Available
          </div>
          <div className="text-[11px] text-[#5C7D9F] truncate">Outside commitments</div>
        </button>

        {/* Upcoming */}
        <button
          onClick={() => setActiveSection('schedule')}
          className="p-3 rounded-xl bg-[#F8F5FD] border border-[#E9DDFB] hover:border-[#D5C2F5] transition text-left cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 text-xs text-[#624F80] mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-[#7E65A8]" />
            <span className="font-medium">Upcoming</span>
          </div>
          <div className="text-sm font-bold text-[#2F3142] group-hover:text-[#4A3866] transition">
            {computedMetrics.upcomingDeadlinesCount} Deadlines
          </div>
          <div className="text-[11px] text-[#7E6D99] truncate">Tracked on calendar</div>
        </button>
      </div>
    </div>
  );
};
