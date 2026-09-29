import React from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Wallet,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { LifeOverviewBar } from './LifeOverviewBar';
import { ActionProposalCard } from './ActionProposalCard';

export const DashboardView: React.FC = () => {
  const { state, setActiveSection, computedMetrics } = useLifeOS();

  const activeExams = state.schedule.some((s) => s.category === 'Exams');
  const activeVacation = state.schedule.some((s) => s.category === 'Vacation');

  return (
    <div className="space-y-6">
      {/* 13. My Life Right Now */}
      <LifeOverviewBar />

      {/* Pending Action Proposal Banner if active */}
      {state.pendingProposal && !state.pendingProposal.applied && (
        <ActionProposalCard proposal={state.pendingProposal} />
      )}

      {/* 2. AI Focus Section */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-[#FAF5FF] via-[#FFF5F8] to-[#F2FBF6] border border-[#E9DDFB] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#F7DCE5]/40 to-transparent pointer-events-none rounded-full blur-2xl -mr-16 -mt-16" />
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-gradient-to-tr from-[#E9DDFB] to-[#F7DCE5] text-[#4C3B68] shadow-2xs">
                <Sparkles className="w-4 h-4 text-[#5D4282]" />
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#5D4282]">
                LifeOS AI Focus
              </h2>
            </div>
            <button
              onClick={() => setActiveSection('ai_agent')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#523A73] hover:bg-[#432F5F] text-white text-xs font-semibold shadow-xs hover:shadow transition cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask LifeOS</span>
            </button>
          </div>

          <p className="text-sm md:text-base font-medium text-[#2F3142] leading-relaxed max-w-3xl">
            {computedMetrics.aiFocusText}
          </p>

          <div className="mt-4 pt-3 border-t border-[#EFE5F8] flex flex-wrap items-center gap-4 text-xs text-[#716B82]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9578D3]" />
              System Status: <strong className="text-[#3C3A4F]">{computedMetrics.careerStatus}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#5489C7]" />
              Allocated Daily Bandwidth:{' '}
              <strong className="text-[#3C3A4F]">
                {activeExams ? '1.5 hrs/day' : activeVacation ? '8 hrs/day (Sprint)' : '4 hrs/day'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Today's Overview Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#2F3142]">Today's Overview</h2>
          <span className="text-xs text-[#808298]">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Important Tasks Today */}
          <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6F5B8B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8E6CBF]" />
                  Today's Priority Tasks
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FAF5FF] text-[#695484] font-medium">
                  {activeExams ? 'Exams Mode' : 'Standard'}
                </span>
              </div>

              <div className="space-y-2.5">
                {activeExams ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-[#FDF2F5] border border-[#F7DCE5] text-xs">
                      <div className="font-semibold text-[#6E3045]">
                        Midterm Exam Study: Algorithms & Systems
                      </div>
                      <div className="text-[11px] text-[#8C5266] mt-0.5">
                        High Priority • 6 hours scheduled
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF5FF] border border-[#E9DDFB] text-xs">
                      <div className="font-semibold text-[#503D6E]">
                        Light Maintenance: 2 LeetCode Hash Map problems
                      </div>
                      <div className="text-[11px] text-[#786497] mt-0.5">
                        Career Road map • 30 mins
                      </div>
                    </div>
                  </>
                ) : activeVacation ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-[#F0FAF3] border border-[#DDF3E4] text-xs">
                      <div className="font-semibold text-[#215E36]">
                        Project Sprint: Distributed Task Queue API
                      </div>
                      <div className="text-[11px] text-[#477C58] mt-0.5">
                        Vacation Sprint • 4 hours dedicated
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF5FF] border border-[#E9DDFB] text-xs">
                      <div className="font-semibold text-[#503D6E]">
                        DSA Graph Traversal & BFS Deep Dive
                      </div>
                      <div className="text-[11px] text-[#786497] mt-0.5">
                        Learning Track • 2 hours
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2.5 rounded-xl bg-[#FAF5FF] border border-[#E9DDFB] text-xs">
                      <div className="font-semibold text-[#503D6E]">
                        Python AsyncIO & Concurrency Architecture
                      </div>
                      <div className="text-[11px] text-[#786497] mt-0.5">
                        Learning Goal • 1.5 hours
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F0FAF3] border border-[#DDF3E4] text-xs">
                      <div className="font-semibold text-[#215E36]">
                        Two Pointers & Sliding Window Exercises
                      </div>
                      <div className="text-[11px] text-[#477C58] mt-0.5">
                        DSA Practice • 1.5 hours
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F3F8FE] border border-[#DCEBFA] text-xs">
                      <div className="font-semibold text-[#295687]">
                        GitHub Repository Documentation Polish
                      </div>
                      <div className="text-[11px] text-[#557B9E] mt-0.5">
                        Career Portfolio • 1 hour
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setActiveSection('schedule')}
              className="mt-4 pt-3 border-t border-[#F2EDF8] text-xs font-semibold text-[#665083] hover:text-[#3C2E52] flex items-center justify-between cursor-pointer"
            >
              <span>View full day schedule</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Upcoming Deadlines & Commitments */}
          <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7E4C60] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#B65B7B]" />
                  Upcoming Deadlines & Schedule
                </span>
                <span className="text-[11px] text-[#9193A5]">Next 30 days</span>
              </div>

              <div className="space-y-2.5">
                {state.schedule.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border text-xs ${
                      item.category === 'Exams'
                        ? 'bg-[#FDF2F5] border-[#F7DCE5]'
                        : item.category === 'Vacation'
                        ? 'bg-[#F0FAF3] border-[#DDF3E4]'
                        : 'bg-[#FAF9FC] border-[#EFEBF4]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#2F3142]">{item.title}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.category === 'Exams'
                            ? 'bg-[#F9C9D7] text-[#69243A]'
                            : item.category === 'Vacation'
                            ? 'bg-[#CBEFCC] text-[#1E5731]'
                            : 'bg-[#EAE4F5] text-[#553E74]'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#76788D] mt-0.5">
                      {item.startDate} to {item.endDate} • {item.dailyHoursCommitment}h/day commitment
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveSection('schedule')}
              className="mt-4 pt-3 border-t border-[#F2EDF8] text-xs font-semibold text-[#8C5266] hover:text-[#5B2D3D] flex items-center justify-between cursor-pointer"
            >
              <span>Manage schedule</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Available Time Gauge & Learning Activity */}
          <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#356345] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#4D8C62]" />
                  Learning Activity & Capacity
                </span>
                <span className="text-xs font-semibold text-[#29683E]">
                  {computedMetrics.learningOverallProgress}% Complete
                </span>
              </div>

              {/* Weekly Hours Capacity Card */}
              <div className="p-3 rounded-xl bg-[#F0FAF3] border border-[#DDF3E4] mb-3">
                <div className="flex items-center justify-between text-xs text-[#2A5C38] mb-1">
                  <span className="font-medium">Free Bandwidth This Week</span>
                  <span className="font-bold">{computedMetrics.weeklyAvailableHours} Hours</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#C8ECD1] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#469B60] transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((computedMetrics.weeklyAvailableHours / 35) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Learning skills list */}
              <div className="space-y-2">
                {state.learning.slice(0, 2).map((skill) => (
                  <div
                    key={skill.id}
                    className="p-2 rounded-lg bg-[#FAF9FC] border border-[#F0ECF5] text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#3C3A4F]">{skill.skill}</span>
                      <span className="text-[11px] text-[#636578]">{skill.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#EAE5F2] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#A589DB] transition-all"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveSection('learning')}
              className="mt-4 pt-3 border-t border-[#F2EDF8] text-xs font-semibold text-[#326D45] hover:text-[#1F4C2D] flex items-center justify-between cursor-pointer"
            >
              <span>Explore all skills</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Financial Overview Snippet & Major Goals Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Active Goals Snapshot */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#634E7F]">
              Primary Life Goals
            </span>
            <button
              onClick={() => setActiveSection('goals')}
              className="text-xs font-medium text-[#7D61A5] hover:underline"
            >
              View Roadmaps →
            </button>
          </div>

          <div className="space-y-3">
            {state.goals.map((goal) => (
              <div
                key={goal.id}
                className="p-3 rounded-xl bg-[#FAF7FD] border border-[#EFE7FB] space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2F3142]">{goal.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#E2D5F5] text-[#553F76]">
                    {goal.targetDate}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[#E8DCF7] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#997CD5] transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#563F78]">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finance Snapshot */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A5B3D]">
              Financial Planning Status
            </span>
            <button
              onClick={() => setActiveSection('finance')}
              className="text-xs font-medium text-[#A0643E] hover:underline"
            >
              Budget Details →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-3 text-center">
            <div className="p-2.5 rounded-xl bg-[#FFF9F5] border border-[#FBE4D5]">
              <div className="text-[10px] text-[#936647] font-medium">Income</div>
              <div className="text-xs font-bold text-[#2F3142] mt-0.5">
                {state.finance.currency}
                {state.finance.monthlyIncome.toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF9FC] border border-[#EDE8F5]">
              <div className="text-[10px] text-[#787A8D] font-medium">Expenses</div>
              <div className="text-xs font-bold text-[#2F3142] mt-0.5">
                {state.finance.currency}
                {state.finance.monthlyExpenses.toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F0FAF3] border border-[#DDF3E4]">
              <div className="text-[10px] text-[#346844] font-medium">Net Remaining</div>
              <div className="text-xs font-bold text-[#1E5731] mt-0.5">
                {state.finance.currency}
                {computedMetrics.remainingBudget.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF7FD] border border-[#EFE7FB]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#4B3968]">
                Savings Goal: {state.finance.currency}
                {state.finance.savingsGoal.toLocaleString()}
              </span>
              <span className="font-bold text-[#5F4685]">
                {Math.round((state.finance.currentSavings / state.finance.savingsGoal) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E4D5F8] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#8E6EC8]"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((state.finance.currentSavings / state.finance.savingsGoal) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
