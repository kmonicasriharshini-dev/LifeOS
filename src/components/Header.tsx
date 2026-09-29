import React from 'react';
import { Sparkles, PlayCircle, HelpCircle } from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';

export const Header: React.FC = () => {
  const { state, setActiveSection, runDemoStep, isAILoading } = useLifeOS();

  const getSectionTitle = () => {
    switch (state.activeSection) {
      case 'dashboard':
        return {
          title: 'Life Dashboard',
          subtitle: "Central intelligence overview of today's commitments, progress, and AI focus.",
        };
      case 'goals':
        return {
          title: 'Life Goals',
          subtitle: 'Major multi-month aspirations turned into dynamically adjusted roadmaps.',
        };
      case 'learning':
        return {
          title: 'Learning & Skills',
          subtitle: 'Targeted skill tracks synchronized with your career goals and weekly bandwidth.',
        };
      case 'career':
        return {
          title: 'Career & Profile',
          subtitle: 'Profile gaps, portfolio projects, and dynamic internship roadmap.',
        };
      case 'finance':
        return {
          title: 'Finance & Budget',
          subtitle: 'Personal planning and cashflow budgeting aligned with your life milestones.',
        };
      case 'schedule':
        return {
          title: 'Schedule & Commitments',
          subtitle: 'Exams, classes, and vacation blocks that govern your available preparation time.',
        };
      case 'progress':
        return {
          title: 'Progress Intelligence',
          subtitle: 'Cross-functional trajectory bars and AI-synthesized progress summaries.',
        };
      case 'ai_agent':
        return {
          title: 'LifeOS AI Agent',
          subtitle: 'Your central AI that manages the relationships between all parts of your life.',
        };
      default:
        return { title: 'LifeOS', subtitle: 'Personal Life Operating System' };
    }
  };

  const { title, subtitle } = getSectionTitle();

  return (
    <header className="px-8 pt-6 pb-4 bg-[#FFFDFB]/80 backdrop-blur-xs border-b border-[#F2ECF7] sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-[#2F3142]">{title}</h1>
          {state.pendingProposal && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F7DCE5] text-[#7A364E] font-semibold border border-[#F2B9CB] animate-pulse">
              1 Proposed Plan Adjustment
            </span>
          )}
        </div>
        <p className="text-xs text-[#7B7D91] mt-0.5">{subtitle}</p>
      </div>

      {/* Guided Demo Steps Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5EEFB] border border-[#E9DDFB] text-xs text-[#5C4577]">
          <PlayCircle className="w-3.5 h-3.5 text-[#8867B8]" />
          <span className="font-semibold mr-1">Demo Scenarios:</span>

          <button
            onClick={() => runDemoStep(1)}
            disabled={isAILoading}
            title="Step 1: Career Goal -> Internship in 4 Months"
            className="px-2 py-0.5 rounded-lg bg-white/90 hover:bg-white text-[11px] font-medium text-[#46385B] shadow-2xs hover:shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            1. Goal
          </button>

          <button
            onClick={() => runDemoStep(2)}
            disabled={isAILoading}
            title="Step 2: User adds Exams -> Next 2 Weeks"
            className="px-2 py-0.5 rounded-lg bg-[#FDF2F5] hover:bg-white text-[11px] font-medium text-[#844359] shadow-2xs hover:shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            2. Exams
          </button>

          <button
            onClick={() => runDemoStep(3)}
            disabled={isAILoading}
            title="Step 3: User adds 10-Day Vacation"
            className="px-2 py-0.5 rounded-lg bg-[#F0FAF3] hover:bg-white text-[11px] font-medium text-[#2E6840] shadow-2xs hover:shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            3. Vacation
          </button>

          <button
            onClick={() => runDemoStep(4)}
            disabled={isAILoading}
            title="Step 4: I completed my Python course"
            className="px-2 py-0.5 rounded-lg bg-[#F3F8FE] hover:bg-white text-[11px] font-medium text-[#37597E] shadow-2xs hover:shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            4. Python Done
          </button>

          <button
            onClick={() => runDemoStep(5)}
            disabled={isAILoading}
            title="Step 5: What should I focus on right now?"
            className="px-2 py-0.5 rounded-lg bg-[#FFF6F0] hover:bg-white text-[11px] font-medium text-[#875535] shadow-2xs hover:shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            5. Focus
          </button>
        </div>

        {/* Quick Ask LifeOS Button */}
        {state.activeSection !== 'ai_agent' && (
          <button
            onClick={() => setActiveSection('ai_agent')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E9DDFB] to-[#F7DCE5] hover:from-[#DFCEFB] hover:to-[#F4CAD8] text-[#3F3354] font-semibold text-xs transition shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#584178]" />
            <span>Ask LifeOS</span>
          </button>
        )}
      </div>
    </header>
  );
};
