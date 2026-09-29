import React from 'react';
import {
  TrendingUp,
  Sparkles,
  Target,
  BookOpen,
  Briefcase,
  Wallet,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';

export const ProgressView: React.FC = () => {
  const { state, computedMetrics, setActiveSection } = useLifeOS();

  const hasExams = state.schedule.some((s) => s.category === 'Exams');
  const hasVacation = state.schedule.some((s) => s.category === 'Vacation');

  // AI Progress Summary text dynamically reflecting cross-domain state
  let aiProgressSummary = '';
  if (hasExams) {
    aiProgressSummary =
      'Your internship goal is progressing steadily, though project milestones are temporarily deferred. Your current exam commitments are reducing your daily career-prep time to 1.5 hours, so the roadmap has been defensively adapted to protect your grades while retaining consistency.';
  } else if (hasVacation) {
    aiProgressSummary =
      'Outstanding velocity! Your 10-day vacation is providing an 8-hour daily engineering window. You have accelerated your Distributed Task Queue build and your DSA topic coverage by 14 days ahead of the original internship timeline.';
  } else {
    aiProgressSummary =
      'Your internship goal is progressing well with foundational Python and DSA modules on schedule. Your standard academic commitments leave 18 hours of dedicated bandwidth this week, keeping all milestone projections aligned.';
  }

  const avgGoalProgress = Math.round(
    state.goals.reduce((acc, g) => acc + g.progress, 0) / (state.goals.length || 1)
  );

  const savingsPercent = Math.min(
    100,
    Math.round((state.finance.currentSavings / (state.finance.savingsGoal || 1)) * 100)
  );

  const careerMilestonesCompleted = state.career.roadmapPhases.filter(
    (p) => p.status === 'completed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#2F3142] flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#DDF3E4] text-[#226338]">
              <TrendingUp className="w-4.5 h-4.5" />
            </span>
            Progress Intelligence
          </h2>
          <p className="text-xs text-[#717387] mt-0.5">
            A cohesive view of how your goals, learning, career milestones, and savings advance together over time.
          </p>
        </div>
        <button
          onClick={() => setActiveSection('ai_agent')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#523A73] hover:bg-[#432F5F] text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI to Evaluate Trajectory</span>
        </button>
      </div>

      {/* 8. AI Progress Summary Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF5FF] via-[#FFF8FA] to-[#F1FAF4] border border-[#E9DDFB] shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-xl bg-white shadow-2xs text-[#523A73]">
            <Sparkles className="w-4 h-4 text-[#8869B8]" />
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#523A73]">
            AI Progress Summary
          </h3>
        </div>
        <p className="text-sm font-medium text-[#2F3142] leading-relaxed max-w-4xl">
          "{aiProgressSummary}"
        </p>

        <div className="mt-4 pt-3 border-t border-[#EDE4F5] flex flex-wrap items-center gap-4 text-xs text-[#6F7185]">
          <span>
            Internship Goal Target: <strong className="text-[#3E4053]">4 Months</strong>
          </span>
          <span>•</span>
          <span>
            Current Status: <strong className="text-[#3E4053]">{computedMetrics.careerStatus}</strong>
          </span>
          <span>•</span>
          <span>
            Weekly Free Bandwidth:{' '}
            <strong className="text-[#3E4053]">{computedMetrics.weeklyAvailableHours} Hours</strong>
          </span>
        </div>
      </div>

      {/* 4 Core Life Metric Progress Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Goals Progress */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#86374E] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Goals
              </span>
              <span className="text-sm font-bold text-[#2F3142]">{avgGoalProgress}%</span>
            </div>
            <h4 className="text-sm font-bold text-[#2F3142] mb-1">Life Goals Completion</h4>
            <p className="text-xs text-[#6B6D80] mb-3">
              {state.goals.length} major goals active in system
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-[#FCE8EE] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#E586A1]"
              style={{ width: `${avgGoalProgress}%` }}
            />
          </div>
        </div>

        {/* Learning Mastery */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#245D37] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Learning
              </span>
              <span className="text-sm font-bold text-[#2F3142]">
                {computedMetrics.learningOverallProgress}%
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#2F3142] mb-1">Technical Skills Mastery</h4>
            <p className="text-xs text-[#6B6D80] mb-3">
              Python, SQL, DSA curriculum tracks
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-[#DDF3E4] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#469B60]"
              style={{ width: `${computedMetrics.learningOverallProgress}%` }}
            />
          </div>
        </div>

        {/* Career Roadmap */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#553E74] flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Career
              </span>
              <span className="text-sm font-bold text-[#2F3142]">
                {Math.round((careerMilestonesCompleted / 4) * 100)}%
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#2F3142] mb-1">Roadmap Milestones</h4>
            <p className="text-xs text-[#6B6D80] mb-3">
              {careerMilestonesCompleted} of 4 phases completed
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E9DDFB] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#8E6EC8]"
              style={{
                width: `${Math.max(15, Math.round((careerMilestonesCompleted / 4) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Savings Progress */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#86512C] flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                Savings
              </span>
              <span className="text-sm font-bold text-[#2F3142]">{savingsPercent}%</span>
            </div>
            <h4 className="text-sm font-bold text-[#2F3142] mb-1">Financial Target Goal</h4>
            <p className="text-xs text-[#6B6D80] mb-3">
              {state.finance.currency}
              {state.finance.currentSavings.toLocaleString()} of {state.finance.currency}
              {state.finance.savingsGoal.toLocaleString()}
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-[#FBE4D5] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#C97B58]"
              style={{ width: `${savingsPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Goals Progress Table */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2F3142]">Goals Trajectory</h3>
            <button
              onClick={() => setActiveSection('goals')}
              className="text-xs font-semibold text-[#523A73] hover:underline"
            >
              View All Goals →
            </button>
          </div>

          <div className="space-y-3">
            {state.goals.map((g) => (
              <div key={g.id} className="p-3 rounded-xl bg-[#FAF9FC] border border-[#F0EBF5]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#2F3142]">{g.name}</span>
                  <span className="font-bold text-[#553E74]">{g.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E8E2F2] overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full bg-[#8E6EC8]"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7A7C92]">
                  <span>{g.category}</span>
                  <span>{g.targetDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Skills Trajectory */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2F3142]">Skills Development Trajectory</h3>
            <button
              onClick={() => setActiveSection('learning')}
              className="text-xs font-semibold text-[#245D37] hover:underline"
            >
              View Learning Details →
            </button>
          </div>

          <div className="space-y-3">
            {state.learning.map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-[#FAF9FC] border border-[#F0EBF5]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div>
                    <span className="font-bold text-[#2F3142]">{s.skill}</span>
                    <span className="text-[10px] text-[#696C83] ml-2">
                      ({s.currentLevel} → {s.targetLevel})
                    </span>
                  </div>
                  <span className="font-bold text-[#245D37]">{s.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E0EFE5] overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full bg-[#469B60]"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#7A7C92]">
                  <span>{s.topics.filter((t) => t.completed).length} of {s.topics.length} topics mastered</span>
                  <span>{s.timeAvailablePerWeek} hrs/week</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
