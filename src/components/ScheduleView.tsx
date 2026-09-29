import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  AlertCircle,
  Sparkles,
  Trash2,
  CalendarDays,
  Sun,
  GraduationCap,
  Palmtree,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { ScheduleCommitment } from '../types';

export const ScheduleView: React.FC = () => {
  const {
    state,
    addScheduleCommitment,
    deleteScheduleCommitment,
    setActiveSection,
    computedMetrics,
  } = useLifeOS();

  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [showAddModal, setShowAddModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ScheduleCommitment['category']>('Exams');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-14');
  const [hoursCommitment, setHoursCommitment] = useState(8);
  const [notes, setNotes] = useState('');

  const handleAddCommitment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let impact: ScheduleCommitment['impactOnCareerPrep'] = 'neutral';
    if (category === 'Exams' || hoursCommitment >= 7) {
      impact = 'heavy_reduction';
    } else if (category === 'Vacation') {
      impact = 'high_availability';
    } else if (hoursCommitment >= 4) {
      impact = 'moderate_reduction';
    }

    const commitment: ScheduleCommitment = {
      id: 'sch-' + Date.now(),
      title,
      category,
      startDate,
      endDate,
      dailyHoursCommitment: hoursCommitment,
      impactOnCareerPrep: impact,
      notes: notes || `Scheduled ${category} commitment.`,
    };

    addScheduleCommitment(commitment);
    setShowAddModal(false);
    setTitle('');
    setNotes('');
  };

  const getCategoryIcon = (cat: ScheduleCommitment['category']) => {
    switch (cat) {
      case 'Exams':
        return <GraduationCap className="w-4 h-4 text-[#8C3A54]" />;
      case 'Vacation':
        return <Palmtree className="w-4 h-4 text-[#23683C]" />;
      case 'Classes':
        return <CalendarIcon className="w-4 h-4 text-[#523A73]" />;
      default:
        return <Briefcase className="w-4 h-4 text-[#5489C7]" />;
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#2F3142] flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#E9DDFB] text-[#553E74]">
              <CalendarDays className="w-4.5 h-4.5" />
            </span>
            Schedule & Life Commitments
          </h2>
          <p className="text-xs text-[#717387] mt-0.5">
            Your commitments directly calculate your available career prep bandwidth. LifeOS dynamically replans when you add exams or vacation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-[#FAF7FD] p-1 rounded-xl border border-[#EDE8F5]">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'weekly'
                  ? 'bg-white text-[#523A73] shadow-2xs'
                  : 'text-[#7D8094] hover:text-[#2F3142]'
              }`}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'daily'
                  ? 'bg-white text-[#523A73] shadow-2xs'
                  : 'text-[#7D8094] hover:text-[#2F3142]'
              }`}
            >
              Daily Breakdown
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#523A73] hover:bg-[#432F5F] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Commitment</span>
          </button>
        </div>
      </div>

      {/* Cross-Domain Capacity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#797B90] mb-1">
            Weekly Available Bandwidth
          </div>
          <div className="text-2xl font-bold text-[#2F3142]">
            {computedMetrics.weeklyAvailableHours} Hours
          </div>
          <div className="text-xs text-[#5D5F74] mt-1">
            Calculated after deducting lecture, study, and sleep hours.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#797B90] mb-1">
            Active Schedule State
          </div>
          <div className="text-sm font-bold text-[#553E74] flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A382DD]" />
            {computedMetrics.careerStatus}
          </div>
          <div className="text-xs text-[#717387] mt-1">
            {state.schedule.some((s) => s.category === 'Exams')
              ? 'Exams detected: Roadmap automatically lightened'
              : state.schedule.some((s) => s.category === 'Vacation')
              ? 'Vacation detected: Roadmap accelerated for project sprint'
              : 'Standard university semester baseline'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF5FF] to-[#FFF7F9] border border-[#E9DDFB] shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#725499] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8869B8]" />
              AI Replanning Trigger
            </div>
            <p className="text-xs text-[#5D5F74] mt-1">
              Want the AI to adapt around an upcoming event?
            </p>
          </div>
          <button
            onClick={() => setActiveSection('ai_agent')}
            className="text-xs font-semibold text-[#553E74] hover:underline flex items-center gap-1 self-start mt-2"
          >
            <span>Ask LifeOS to replan schedule →</span>
          </button>
        </div>
      </div>

      {/* Calendar View Area */}
      {viewMode === 'weekly' ? (
        <div className="p-6 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#2F3142]">Weekly Schedule Distribution</h3>
            <span className="text-xs text-[#7A7C91]">Active Week: Mon – Sun</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {daysOfWeek.map((day, idx) => {
              const isWeekend = idx >= 5;
              const hasExams = state.schedule.some((s) => s.category === 'Exams');
              const hasVacation = state.schedule.some((s) => s.category === 'Vacation');

              return (
                <div
                  key={day}
                  className={`p-3 rounded-xl border flex flex-col justify-between min-h-[160px] ${
                    isWeekend
                      ? 'bg-[#FCFBFD] border-[#EFEBF5]'
                      : 'bg-white border-[#EDE8F5]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-[#3E4054] mb-2 pb-1 border-b border-[#F2EDF8]">
                      <span>{day.slice(0, 3)}</span>
                      <span className="text-[10px] text-[#86889D]">{idx + 1}</span>
                    </div>

                    {/* Commitments on this day */}
                    <div className="space-y-1.5">
                      {hasVacation ? (
                        <div className="p-1.5 rounded-lg bg-[#F0FAF3] border border-[#DDF3E4] text-[10px]">
                          <span className="font-bold text-[#215E36]">Vacation Sprint</span>
                          <div className="text-[#3F7552]">8h free/day</div>
                        </div>
                      ) : hasExams ? (
                        <>
                          <div className="p-1.5 rounded-lg bg-[#FDF2F5] border border-[#F7DCE5] text-[10px]">
                            <span className="font-bold text-[#7E374E]">Exams Study</span>
                            <div className="text-[#965469]">8h revision</div>
                          </div>
                          <div className="p-1.5 rounded-lg bg-[#FAF5FF] border border-[#E9DDFB] text-[10px]">
                            <span className="font-bold text-[#553E74]">Career Maint.</span>
                            <div className="text-[#765D97]">30m DSA</div>
                          </div>
                        </>
                      ) : (
                        <>
                          {!isWeekend && (
                            <div className="p-1.5 rounded-lg bg-[#FAF5FF] border border-[#EFE7FB] text-[10px]">
                              <span className="font-bold text-[#553E74]">Classes</span>
                              <div className="text-[#786497]">9 AM – 2 PM</div>
                            </div>
                          )}
                          <div className="p-1.5 rounded-lg bg-[#F0FAF3] border border-[#DDF3E4] text-[10px]">
                            <span className="font-bold text-[#235835]">
                              {isWeekend ? 'Projects & DSA' : 'Evening Prep'}
                            </span>
                            <div className="text-[#3E6B4E]">
                              {isWeekend ? '6 hrs free' : '3.5 hrs free'}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#F2EDF8] text-[10px] text-right font-medium text-[#7A7C92]">
                    {hasVacation
                      ? '8h prep'
                      : hasExams
                      ? '1.5h prep'
                      : isWeekend
                      ? '6h prep'
                      : '4h prep'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Daily Breakdown */
        <div className="p-6 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#2F3142]">Daily Time Allocation Breakdown</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#FAF9FC] border border-[#EDE8F5] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#FAF5FF] text-[#553E74] font-bold">
                  09:00 - 14:00
                </span>
                <div>
                  <div className="font-bold text-[#2F3142]">University Coursework & Lab Hours</div>
                  <div className="text-[11px] text-[#717387]">Core academic lectures & tutorials</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#EAE3F5] text-[#553E74] font-semibold self-start md:self-auto">
                Academic Commitment
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9FC] border border-[#EDE8F5] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#F0FAF3] text-[#245C38] font-bold">
                  16:00 - 18:00
                </span>
                <div>
                  <div className="font-bold text-[#2F3142]">Learning Track: Python & Algorithms</div>
                  <div className="text-[11px] text-[#717387]">Active topic completion on LifeOS</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#DDF3E4] text-[#245C38] font-semibold self-start md:self-auto">
                Skill Development
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9FC] border border-[#EDE8F5] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[#F3F8FE] text-[#295687] font-bold">
                  19:00 - 20:30
                </span>
                <div>
                  <div className="font-bold text-[#2F3142]">Career Milestone Project Engineering</div>
                  <div className="text-[11px] text-[#717387]">Fullstack portfolio & GitHub repos</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#DCEBFA] text-[#295687] font-semibold self-start md:self-auto">
                Career Roadmap
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Commitments Table & Management */}
      <div className="p-6 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#2F3142]">All Registered Commitments</h3>

        <div className="space-y-3">
          {state.schedule.map((commitment) => (
            <div
              key={commitment.id}
              className="p-4 rounded-xl border border-[#EDE8F5] bg-[#FAF9FC] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-xl bg-white border border-[#EAE3F2] shadow-2xs mt-0.5">
                  {getCategoryIcon(commitment.category)}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#2F3142]">{commitment.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        commitment.category === 'Exams'
                          ? 'bg-[#FDF2F5] text-[#84364D]'
                          : commitment.category === 'Vacation'
                          ? 'bg-[#F0FAF3] text-[#245D37]'
                          : 'bg-[#FAF5FF] text-[#553E74]'
                      }`}
                    >
                      {commitment.category}
                    </span>
                  </div>
                  <div className="text-xs text-[#6F7185] mt-0.5">
                    {commitment.startDate} to {commitment.endDate} • {commitment.dailyHoursCommitment} hours/day
                  </div>
                  <p className="text-xs text-[#7B7D91] mt-1 italic">{commitment.notes}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    commitment.impactOnCareerPrep === 'heavy_reduction'
                      ? 'bg-[#FDF2F5] text-[#86374E]'
                      : commitment.impactOnCareerPrep === 'high_availability'
                      ? 'bg-[#F0FAF3] text-[#226136]'
                      : 'bg-[#FAF9FC] text-[#5B5D73]'
                  }`}
                >
                  {commitment.impactOnCareerPrep === 'heavy_reduction'
                    ? '⚠️ Lowers Career Hours'
                    : commitment.impactOnCareerPrep === 'high_availability'
                    ? '🚀 Boosts Career Hours'
                    : 'Standard Bandwidth'}
                </span>

                {state.schedule.length > 1 && (
                  <button
                    onClick={() => deleteScheduleCommitment(commitment.id)}
                    className="p-1.5 rounded-lg text-[#9597A8] hover:text-[#C43859] hover:bg-gray-100 transition cursor-pointer"
                    title="Remove Commitment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Commitment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE8F5] shadow-xl">
            <h3 className="text-base font-bold text-[#2F3142] mb-1">Add Commitment Block</h3>
            <p className="text-xs text-[#75778B] mb-4">
              Adding commitments allows LifeOS to dynamically replan your career and learning schedules.
            </p>

            <form onSubmit={handleAddCommitment} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#444658]">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Semester Midterm Exams"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Category</label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ScheduleCommitment['category'])
                    }
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none bg-white"
                  >
                    <option value="Exams">Exams</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Classes">Classes</option>
                    <option value="Work">Work</option>
                    <option value="Projects">Projects</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Hours / Day</label>
                  <input
                    type="number"
                    min={0}
                    max={16}
                    value={hoursCommitment}
                    onChange={(e) => setHoursCommitment(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#444658]">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444658]">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Details on this event and how it impacts your study time..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F2EDF8]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6A6C80] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#523A73] hover:bg-[#432F5F] text-white shadow-xs"
                >
                  Add Commitment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
