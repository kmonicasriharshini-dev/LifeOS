import React, { useState } from 'react';
import {
  Briefcase,
  Award,
  FolderGit2,
  FileText,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Plus,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';

export const CareerView: React.FC = () => {
  const { state, updateCareerProfile, setActiveSection } = useLifeOS();
  const { career } = state;

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [projName, setProjName] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projDesc, setProjDesc] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const newProj = {
      id: 'proj-' + Date.now(),
      name: projName,
      tech: projTech || 'Python, React',
      status: 'planned' as const,
      description: projDesc || 'Personal engineering project.',
    };

    updateCareerProfile({
      projects: [...career.projects, newProj],
      projectsCount: career.projectsCount + 1,
    });

    setShowAddProjectModal(false);
    setProjName('');
    setProjTech('');
    setProjDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#2F3142] flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#DCEBFA] text-[#204E82]">
              <Briefcase className="w-4.5 h-4.5" />
            </span>
            Career Profile & Intelligence
          </h2>
          <p className="text-xs text-[#717387] mt-0.5">
            LifeOS maps your current skills, projects, and resume against your target role to generate an adaptable roadmap.
          </p>
        </div>
        <button
          onClick={() => setActiveSection('ai_agent')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E9DDFB] to-[#F7DCE5] text-[#483763] text-xs font-bold shadow-2xs hover:shadow transition cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#61458A]" />
          <span>Ask AI to Re-evaluate Roadmap</span>
        </button>
      </div>

      {/* Target Role & Profile Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#797B90] mb-1">
            Target Role
          </div>
          <div className="text-base font-bold text-[#2F3142]">{career.targetRole}</div>
          <div className="text-xs text-[#5D5F74] mt-1">{career.careerGoal}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#797B90] mb-1">
            Projects Portfolio
          </div>
          <div className="text-xl font-bold text-[#2F3142]">
            {career.projects.length}{' '}
            <span className="text-xs font-normal text-[#7B7D91]">
              ({career.projects.filter((p) => p.status === 'completed').length} completed)
            </span>
          </div>
          <div className="text-xs text-[#5D5F74] mt-1">Target: 3 high-impact repos</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#797B90] mb-1">
            Certifications
          </div>
          <div className="text-xl font-bold text-[#2F3142]">{career.certifications.length}</div>
          <div className="text-xs text-[#5D5F74] mt-1">Cloud & Algorithms focus</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#797B90] mb-1">
            Resume Status
          </div>
          <div className="text-xs font-semibold text-[#663E82] line-clamp-2">
            {career.resumeStatus}
          </div>
          <div className="text-[11px] text-[#7E8095] mt-1">ATS Optimization ready</div>
        </div>
      </div>

      {/* Dynamic Career Roadmap: Current Profile → Skill Gaps → Learning → Projects → Applications → Interview Prep */}
      <div className="p-6 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2F3142]">
              Adaptive Career Roadmap
            </h3>
            <p className="text-xs text-[#6F7185]">
              Current Profile → Skill Gaps → Learning → Projects → Applications → Interview Prep
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF5FF] text-[#553E74] font-semibold border border-[#E8DCF9]">
            Dynamically Updated by Schedule
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {career.roadmapPhases.map((phase, idx) => (
            <div
              key={phase.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                phase.status === 'completed'
                  ? 'bg-[#F2FAF4] border-[#BDE5C8]'
                  : phase.status === 'accelerated'
                  ? 'bg-[#F0FAF3] border-[#72C889] ring-2 ring-[#DDF3E4]'
                  : phase.status === 'shifted'
                  ? 'bg-[#FFF8FA] border-[#F2B9CB] ring-2 ring-[#F7DCE5]'
                  : phase.status === 'active'
                  ? 'bg-[#FAF6FE] border-[#CBB3F2] ring-2 ring-[#E9DDFB]'
                  : 'bg-[#FFFDFB] border-[#EDE8F5]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#553F76] px-2 py-0.5 rounded-md bg-white border border-[#EAE3F2]">
                    {phase.period}
                  </span>
                  {phase.annotation && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        phase.status === 'shifted'
                          ? 'bg-[#F7DCE5] text-[#7A364E]'
                          : phase.status === 'accelerated'
                          ? 'bg-[#DDF3E4] text-[#226337]'
                          : 'bg-[#E9DDFB] text-[#523A73]'
                      }`}
                    >
                      {phase.annotation}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#2F3142] mb-2">{phase.phase}</h4>

                <ul className="space-y-1.5">
                  {phase.tasks.map((task, i) => (
                    <li key={i} className="text-xs text-[#525468] flex items-start gap-1.5">
                      <span className="text-[#8869B8] mt-0.5">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0EBF5] flex items-center justify-between text-[11px] font-medium">
                <span
                  className={
                    phase.status === 'completed'
                      ? 'text-[#28643C]'
                      : phase.status === 'shifted'
                      ? 'text-[#873A53]'
                      : phase.status === 'accelerated'
                      ? 'text-[#1E5731]'
                      : 'text-[#583E77]'
                  }
                >
                  {phase.status === 'completed'
                    ? '✓ Completed'
                    : phase.status === 'shifted'
                    ? '⏱ Shifted for Exams'
                    : phase.status === 'accelerated'
                    ? '⚡ Vacation Sprint'
                    : phase.status === 'active'
                    ? '● Active Phase'
                    : '○ Scheduled'}
                </span>
                <span className="text-[#8B8D9F]">Step {idx + 1} of 4</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & AI Skill Gaps Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Current Skills & Profile */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2F3142]">Current Verified Skills</h3>
            <span className="text-xs text-[#808298]">{career.currentSkills.length} skills listed</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {career.currentSkills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-[#FAF6FE] border border-[#E9DDFB] text-xs font-semibold text-[#4F396F]"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F0EBF5] space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#797B90]">
              Experience & Academic Foundation
            </div>
            <p className="text-xs text-[#5D5F74] leading-relaxed">{career.experience}</p>
          </div>
        </div>

        {/* AI Skill Gaps */}
        <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2F3142] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#C98B48]" />
              AI Identified Skill Gaps
            </h3>
            <span className="text-[11px] text-[#7E8095]">Calibrated for {career.targetRole}</span>
          </div>

          <div className="space-y-2.5">
            {career.skillGaps.map((gap, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#FAF9FC] border border-[#EFEBF4] text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2F3142]">{gap.skill}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      gap.gapLevel === 'High'
                        ? 'bg-[#FDF2F5] text-[#86374E] border border-[#F7DCE5]'
                        : 'bg-[#FFF9F5] text-[#86512C] border border-[#FBE4D5]'
                    }`}
                  >
                    {gap.gapLevel} Priority Gap
                  </span>
                </div>
                <div className="text-[11px] text-[#636578]">
                  <strong>Action Plan:</strong> {gap.actionPlan}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#2F3142] flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#8C6CC2]" />
              Portfolio Projects
            </h3>
            <p className="text-xs text-[#717387]">
              Key engineering builds to showcase on resume and GitHub.
            </p>
          </div>
          <button
            onClick={() => setShowAddProjectModal(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F2E7FD] text-[#523A73] border border-[#E9DDFB] text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {career.projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border border-[#EDE8F5] bg-[#FAF9FC] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      proj.status === 'completed'
                        ? 'bg-[#DDF3E4] text-[#245D36]'
                        : proj.status === 'in_progress'
                        ? 'bg-[#E9DDFB] text-[#553E74]'
                        : 'bg-[#FBE4D5] text-[#7A4523]'
                    }`}
                  >
                    {proj.status === 'completed'
                      ? '✓ Completed'
                      : proj.status === 'in_progress'
                      ? '● In Progress'
                      : '○ Planned'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#2F3142] mb-1">{proj.name}</h4>
                <div className="text-[11px] font-medium text-[#795B9B] mb-2">{proj.tech}</div>
                <p className="text-xs text-[#636578] leading-relaxed">{proj.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-2xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EDE8F5] shadow-xl">
            <h3 className="text-base font-bold text-[#2F3142] mb-1">Add Portfolio Project</h3>
            <p className="text-xs text-[#75778B] mb-4">
              Connect technical builds to your career timeline.
            </p>

            <form onSubmit={handleAddProject} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#444658]">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Task Queue"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444658]">Tech Stack</label>
                <input
                  type="text"
                  placeholder="e.g. Python FastAPI, Redis, Docker"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444658]">Description</label>
                <textarea
                  rows={2}
                  placeholder="What does it do and what architectural challenges does it solve?"
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F2EDF8]">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6A6C80] hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#523A73] hover:bg-[#432F5F] text-white shadow-xs"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
