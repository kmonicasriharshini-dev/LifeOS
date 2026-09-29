import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { Goal, Milestone } from '../types';

export const GoalsView: React.FC = () => {
  const { state, updateGoal, addGoal, setActiveSection } = useLifeOS();
  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    state.goals[0]?.id || ''
  );
  const [showAddGoalModal, setShowAddGoalModal] = useState<boolean>(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<Goal['category']>('Career');
  const [newGoalTarget, setNewGoalTarget] = useState('In 3 months');
  const [newGoalDesc, setNewGoalDesc] = useState('');

  // Editing milestone state
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editMilestoneTitle, setEditMilestoneTitle] = useState('');
  const [editMilestoneItems, setEditMilestoneItems] = useState('');

  const activeGoal = state.goals.find((g) => g.id === selectedGoalId) || state.goals[0];

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;

    const newGoal: Goal = {
      id: 'g-' + Date.now(),
      name: newGoalName,
      category: newGoalCategory,
      targetDate: newGoalTarget,
      progress: 0,
      description: newGoalDesc || 'Personal milestone tracked in LifeOS.',
      status: 'active',
      roadmap: [
        {
          id: 'm-' + Date.now() + '-1',
          period: 'Month 1',
          title: 'Foundations & Planning',
          items: ['Define core prerequisites', 'Set up daily 1-hour habit slot'],
          status: 'current',
          intensity: 'moderate',
        },
        {
          id: 'm-' + Date.now() + '-2',
          period: 'Month 2',
          title: 'Execution & Milestones',
          items: ['Intermediate checkpoints', 'Track weekly output'],
          status: 'upcoming',
          intensity: 'heavy',
        },
      ],
    };

    addGoal(newGoal);
    setSelectedGoalId(newGoal.id);
    setShowAddGoalModal(false);
    setNewGoalName('');
    setNewGoalDesc('');
  };

  const handleSaveMilestone = (goalId: string, milestoneId: string) => {
    if (!activeGoal) return;
    const updatedRoadmap = activeGoal.roadmap.map((m) => {
      if (m.id === milestoneId) {
        return {
          ...m,
          title: editMilestoneTitle || m.title,
          items: editMilestoneItems
            ? editMilestoneItems.split('\n').filter((x) => x.trim().length > 0)
            : m.items,
        };
      }
      return m;
    });

    updateGoal({
      ...activeGoal,
      roadmap: updatedRoadmap,
    });
    setEditingMilestoneId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#2F3142] flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#F7DCE5] text-[#7A364E]">
              <Target className="w-4.5 h-4.5" />
            </span>
            Active Life Goals & AI Roadmaps
          </h2>
          <p className="text-xs text-[#717387] mt-0.5">
            LifeOS turns broad goals into multi-stage, dynamic monthly roadmaps that adjust when commitments change.
          </p>
        </div>
        <button
          onClick={() => setShowAddGoalModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#523A73] hover:bg-[#432F5F] text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Cards Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.goals.map((goal) => {
          const isSelected = activeGoal?.id === goal.id;
          return (
            <div
              key={goal.id}
              onClick={() => setSelectedGoalId(goal.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-[#FAF6FE] border-[#CBB3F2] shadow-sm'
                  : 'bg-white border-[#EDE8F5] hover:border-[#DDCFF2]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    goal.category === 'Career'
                      ? 'bg-[#E9DDFB] text-[#503C72]'
                      : goal.category === 'Learning'
                      ? 'bg-[#DDF3E4] text-[#256338]'
                      : 'bg-[#FBE4D5] text-[#7C4825]'
                  }`}
                >
                  {goal.category}
                </span>
                <span className="text-[11px] text-[#7E8094] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {goal.targetDate}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#2F3142] mb-1.5 line-clamp-1">
                {goal.name}
              </h3>
              <p className="text-xs text-[#6F7185] line-clamp-2 mb-3">{goal.description}</p>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[11px] text-[#86889B] font-medium">Roadmap Progress</span>
                  <span className="font-bold text-[#4B3968]">{goal.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#EAE5F2] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#8E6EC8] transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Goal AI Roadmap Details */}
      {activeGoal && (
        <div className="p-6 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#F0EBF5] gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#795B9B]">
                  Roadmap Breakdown
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF5FF] border border-[#E8DAFA] text-[#553E74]">
                  {activeGoal.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#2F3142]">{activeGoal.name}</h3>
              <p className="text-xs text-[#6C6E82] mt-0.5">{activeGoal.description}</p>
            </div>

            <button
              onClick={() => setActiveSection('ai_agent')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F2E8FD] text-[#523A73] border border-[#E9DDFB] text-xs font-semibold transition cursor-pointer self-start md:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8667B4]" />
              <span>Ask AI to Replan Roadmap</span>
            </button>
          </div>

          {/* Timeline / Roadmap Phases */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#696C83]">
              Phased Execution Steps
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeGoal.roadmap.map((milestone, idx) => {
                const isEditing = editingMilestoneId === milestone.id;

                return (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                      milestone.status === 'completed'
                        ? 'bg-[#F2FAF4] border-[#C8ECD1]'
                        : milestone.status === 'current'
                        ? 'bg-[#FAF6FE] border-[#D3BFF5] ring-2 ring-[#E9DDFB]'
                        : 'bg-[#FFFDFB] border-[#EDE8F5]'
                    }`}
                  >
                    <div>
                      {/* Period Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#553F76] px-2 py-0.5 rounded-md bg-white border border-[#EFE9F5]">
                          {milestone.period}
                        </span>
                        {milestone.tag && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F7DCE5] text-[#7A364E]">
                            {milestone.tag}
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 mt-2">
                          <input
                            type="text"
                            value={editMilestoneTitle}
                            onChange={(e) => setEditMilestoneTitle(e.target.value)}
                            className="w-full text-xs font-bold p-1.5 rounded border border-[#D5C2F2] bg-white"
                          />
                          <textarea
                            value={editMilestoneItems}
                            onChange={(e) => setEditMilestoneItems(e.target.value)}
                            placeholder="One item per line"
                            rows={3}
                            className="w-full text-xs p-1.5 rounded border border-[#D5C2F2] bg-white resize-none"
                          />
                          <div className="flex justify-end gap-1.5 pt-1">
                            <button
                              onClick={() => setEditingMilestoneId(null)}
                              className="px-2 py-1 text-[11px] rounded text-[#6E7084] hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveMilestone(activeGoal.id, milestone.id)}
                              className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#523A73] text-white"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h5 className="text-sm font-bold text-[#2F3142] mb-2">
                            {milestone.title}
                          </h5>

                          <ul className="space-y-1.5">
                            {milestone.items.map((item, i) => (
                              <li
                                key={i}
                                className="text-xs text-[#525468] flex items-start gap-1.5"
                              >
                                <span className="text-[#8869B8] mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="mt-4 pt-3 border-t border-[#F0EBF5] flex items-center justify-between text-[11px]">
                        <span
                          className={`font-semibold ${
                            milestone.status === 'completed'
                              ? 'text-[#28643C]'
                              : milestone.status === 'current'
                              ? 'text-[#5E4287]'
                              : 'text-[#818398]'
                          }`}
                        >
                          {milestone.status === 'completed'
                            ? '✓ Completed'
                            : milestone.status === 'current'
                            ? '● In Progress'
                            : '○ Upcoming'}
                        </span>
                        <button
                          onClick={() => {
                            setEditingMilestoneId(milestone.id);
                            setEditMilestoneTitle(milestone.title);
                            setEditMilestoneItems(milestone.items.join('\n'));
                          }}
                          className="text-[#7A7C92] hover:text-[#2F3142] p-1 rounded hover:bg-gray-100 transition cursor-pointer"
                          title="Edit Milestone"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE8F5] shadow-xl">
            <h3 className="text-base font-bold text-[#2F3142] mb-1">Create a Life Goal</h3>
            <p className="text-xs text-[#75778B] mb-4">
              LifeOS AI will break this goal down into a monthly roadmap automatically.
            </p>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#444658]">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Machine Learning Fundamentals"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Category</label>
                  <select
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value as Goal['category'])}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none bg-white"
                  >
                    <option value="Career">Career</option>
                    <option value="Learning">Learning</option>
                    <option value="Finance">Finance</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Target Date</label>
                  <input
                    type="text"
                    placeholder="e.g. In 4 months"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444658]">Description</label>
                <textarea
                  rows={2}
                  placeholder="Why is this important and what does success look like?"
                  value={newGoalDesc}
                  onChange={(e) => setNewGoalDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F2EDF8]">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6A6C80] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#523A73] hover:bg-[#432F5F] text-white shadow-xs"
                >
                  Create Goal & Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
