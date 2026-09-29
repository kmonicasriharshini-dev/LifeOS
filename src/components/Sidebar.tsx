import React from 'react';
import {
  LayoutDashboard,
  Target,
  BookOpen,
  Briefcase,
  Wallet,
  Calendar,
  TrendingUp,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { LifeOSState } from '../types';

export const Sidebar: React.FC = () => {
  const { state, setActiveSection, resetToDemo, computedMetrics } = useLifeOS();

  const navigationItems: {
    id: LifeOSState['activeSection'];
    label: string;
    icon: React.ReactNode;
    colorClass: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Life Dashboard',
      icon: <LayoutDashboard className="w-4.5 h-4.5" />,
      colorClass: 'hover:bg-[#E9DDFB]/60 text-[#3C3A4F]',
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: <Target className="w-4.5 h-4.5" />,
      colorClass: 'hover:bg-[#F7DCE5]/60 text-[#3C3A4F]',
    },
    {
      id: 'learning',
      label: 'Learning',
      icon: <BookOpen className="w-4.5 h-4.5" />,
      colorClass: 'hover:bg-[#DDF3E4]/60 text-[#3C3A4F]',
    },
    {
      id: 'career',
      label: 'Career',
      icon: <Briefcase className="w-4.5 h-4.5" />,
      colorClass: 'hover:bg-[#DCEBFA]/60 text-[#3C3A4F]',
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <Wallet className="w-4.5 h-4.5" />,
      colorClass: 'hover:bg-[#FBE4D5]/60 text-[#3C3A4F]',
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <Calendar className="w-4.5 h-4.5" />,
      colorClass: 'hover:bg-[#E9DDFB]/60 text-[#3C3A4F]',
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <TrendingUp className="w-4.5 h-4.5" />,
      colorClass: 'hover:bg-[#DDF3E4]/60 text-[#3C3A4F]',
    },
    {
      id: 'ai_agent',
      label: 'AI Agent',
      icon: <Sparkles className="w-4.5 h-4.5" />,
      colorClass: 'hover:bg-[#F7DCE5]/60 text-[#3C3A4F]',
    },
  ];

  return (
    <aside className="w-64 bg-[#FFFDFB] border-r border-[#EFE9F5] flex flex-col justify-between p-4 select-none shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E9DDFB] via-[#F7DCE5] to-[#DDF3E4] flex items-center justify-center shadow-xs border border-white">
            <Sparkles className="w-5 h-5 text-[#4E4467]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#2F3142]">LifeOS</h1>
            <p className="text-[11px] font-medium text-[#7D7F92]">One System for Life</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = state.activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#EFE7FB] text-[#2F2942] font-semibold shadow-xs'
                    : 'text-[#585A6E] hover:text-[#2F3142] hover:bg-[#F9F6FC]'
                }`}
              >
                <span
                  className={`p-1 rounded-lg ${
                    isActive ? 'bg-white shadow-xs text-[#5D4E75]' : 'text-[#7D7F92]'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.id === 'ai_agent' && state.pendingProposal && (
                  <span className="w-2 h-2 rounded-full bg-[#E88B9E] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile & reset demo widget */}
      <div className="pt-4 border-t border-[#EFE9F5] space-y-3">
        {/* Status card */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#FAF7FF] to-[#FFF9FB] border border-[#EFE9F5]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#3C3A4F]">{state.user.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DDF3E4] text-[#235835] font-semibold">
              {computedMetrics.careerStatus}
            </span>
          </div>
          <p className="text-[11px] text-[#787A8D] truncate">{state.user.role}</p>
        </div>

        <button
          onClick={resetToDemo}
          title="Reset to Alex Demo Profile"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#6B6D82] hover:text-[#2F3142] hover:bg-[#F4EFFB] transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#8A7A9E]" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
