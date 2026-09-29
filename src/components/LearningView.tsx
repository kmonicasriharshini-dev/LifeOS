import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Clock,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { LearningSkill } from '../types';

export const LearningView: React.FC = () => {
  const { state, updateLearningSkill, addLearningSkill, toggleLearningTopic, setActiveSection } =
    useLifeOS();

  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newCurrentLevel, setNewCurrentLevel] = useState<LearningSkill['currentLevel']>('Beginner');
  const [newTargetLevel, setNewTargetLevel] = useState<LearningSkill['targetLevel']>('Intermediate');
  const [newHours, setNewHours] = useState(6);
  const [newTargetDate, setNewTargetDate] = useState('In 2 months');

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: LearningSkill = {
      id: 'l-' + Date.now(),
      skill: newSkillName,
      currentLevel: newCurrentLevel,
      targetLevel: newTargetLevel,
      progress: 0,
      targetDate: newTargetDate,
      timeAvailablePerWeek: newHours,
      connectedCareerGoal: state.career.targetRole,
      topics: [
        { id: 't1', title: 'Foundational Concepts & Syntax', completed: false },
        { id: 't2', title: 'Core Libraries & Idiomatic Patterns', completed: false },
        { id: 't3', title: 'Practical Project Implementation', completed: false },
      ],
      notes: `Targeted to bridge requirements for ${state.career.targetRole}.`,
    };

    addLearningSkill(newSkill);
    setShowAddSkillModal(false);
    setNewSkillName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#2F3142] flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#DDF3E4] text-[#215E36]">
              <BookOpen className="w-4.5 h-4.5" />
            </span>
            Connected Learning Tracks
          </h2>
          <p className="text-xs text-[#717387] mt-0.5">
            Every learning track is intentionally bound to your target career role ({state.career.targetRole}) and your weekly schedule capacity.
          </p>
        </div>
        <button
          onClick={() => setShowAddSkillModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#523A73] hover:bg-[#432F5F] text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* AI Connection Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F0FAF3] to-[#FAF6FE] border border-[#DDF3E4] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-white shadow-2xs text-[#28643C]">
            <Sparkles className="w-4 h-4 text-[#2E7A4A]" />
          </span>
          <div>
            <span className="font-bold text-[#235835]">AI Career Integration:</span>
            <span className="text-[#3F4154] ml-1">
              Your learning hours automatically shift when exams or vacations are added to your schedule.
            </span>
          </div>
        </div>
        <button
          onClick={() => setActiveSection('ai_agent')}
          className="text-xs font-semibold text-[#553E74] hover:underline flex items-center gap-1 self-start md:self-auto"
        >
          <span>Ask AI to align curriculum</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {state.learning.map((skill) => (
          <div
            key={skill.id}
            className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs flex flex-col justify-between hover:border-[#D9CDEE] transition"
          >
            <div>
              {/* Skill Top Info */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF5FF] border border-[#E9DDFB] text-[#523A73]">
                  {skill.currentLevel} → {skill.targetLevel}
                </span>
                <span className="text-xs font-bold text-[#2E7A4A]">{skill.progress}%</span>
              </div>

              <h3 className="text-base font-bold text-[#2F3142] mb-1">{skill.skill}</h3>

              <div className="flex items-center gap-3 text-[11px] text-[#717387] mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#5489C7]" />
                  {skill.timeAvailablePerWeek} hrs/week
                </span>
                <span>•</span>
                <span>Target: {skill.targetDate}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#EAE5F2] overflow-hidden mb-4">
                <div
                  className="h-full rounded-full bg-[#8E6EC8] transition-all"
                  style={{ width: `${skill.progress}%` }}
                />
              </div>

              {/* Career Connection Badge */}
              <div className="p-2 rounded-xl bg-[#FAF9FC] border border-[#F0EBF5] text-[11px] text-[#55576C] mb-4 flex items-center gap-1.5">
                <Briefcase className="w-3 h-3 text-[#8E6EC8]" />
                <span>Connected Goal:</span>
                <strong className="text-[#3C3A4F]">{skill.connectedCareerGoal}</strong>
              </div>

              {/* Interactive Topics Checklist */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#797B90] block mb-2">
                  Curriculum Milestones
                </span>
                <div className="space-y-1.5">
                  {skill.topics.map((topic) => (
                    <label
                      key={topic.id}
                      className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-[#FAF8FD] transition cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={topic.completed}
                        onChange={() => toggleLearningTopic(skill.id, topic.id)}
                        className="mt-0.5 rounded text-[#523A73] focus:ring-0 cursor-pointer"
                      />
                      <span
                        className={`leading-tight ${
                          topic.completed ? 'line-through text-[#9092A5]' : 'text-[#3D3F52]'
                        }`}
                      >
                        {topic.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {skill.notes && (
              <div className="mt-4 pt-3 border-t border-[#F2EDF8] text-[11px] text-[#808298] italic">
                Note: {skill.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE8F5] shadow-xl">
            <h3 className="text-base font-bold text-[#2F3142] mb-1">Add a Learning Track</h3>
            <p className="text-xs text-[#75778B] mb-4">
              Connect a targeted technical or life skill directly to your career goal.
            </p>

            <form onSubmit={handleCreateSkill} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#444658]">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Design Basics"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Current Level</label>
                  <select
                    value={newCurrentLevel}
                    onChange={(e) =>
                      setNewCurrentLevel(e.target.value as LearningSkill['currentLevel'])
                    }
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Target Level</label>
                  <select
                    value={newTargetLevel}
                    onChange={(e) =>
                      setNewTargetLevel(e.target.value as LearningSkill['targetLevel'])
                    }
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none bg-white"
                  >
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Industry-Ready">Industry-Ready</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Hours / Week</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={newHours}
                    onChange={(e) => setNewHours(parseInt(e.target.value) || 4)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#444658]">Target Date</label>
                  <input
                    type="text"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F2EDF8]">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6A6C80] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#523A73] hover:bg-[#432F5F] text-white shadow-xs"
                >
                  Create Learning Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
