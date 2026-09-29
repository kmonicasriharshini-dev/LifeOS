import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Briefcase,
  BookOpen,
  Calendar,
  Wallet,
  Clock,
  Target,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { state, completeOnboarding, resetToDemo } = useLifeOS();
  const [step, setStep] = useState<'landing' | 'wizard'>('landing');

  // Wizard form state
  const [userName, setUserName] = useState('Alex');
  const [userRole, setUserRole] = useState('Computer Science Student');
  const [mainGoal, setMainGoal] = useState('Get a Software Engineering Internship in 4 Months');
  const [currentSkills, setCurrentSkills] = useState('Python, SQL, HTML');
  const [dailyHours, setDailyHours] = useState(4);
  const [commitments, setCommitments] = useState('University Classes (5 hrs/day)');
  const [financialGoal, setFinancialGoal] = useState('Save ₹20,000 for Tech Setup');

  if (!isOpen) return null;

  const handleFinishWizard = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      name: userName || 'Alex',
      role: userRole || 'Student',
      mainGoal: mainGoal || 'Get an Internship in 4 Months',
      baselineHoursPerDay: dailyHours || 4,
    });
    onClose();
  };

  const handleSelectDemo = () => {
    resetToDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#EDE8F5] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {step === 'landing' ? (
          /* 15. Landing View */
          <div className="p-8 md:p-10 text-center space-y-6 bg-gradient-to-b from-[#FFFDFB] via-[#FAF6FE] to-white relative overflow-hidden">
            {/* Soft decorative background circles */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-[#E9DDFB]/50 via-[#F7DCE5]/40 to-[#DDF3E4]/40 rounded-full blur-3xl pointer-events-none -mt-20" />

            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-white border border-[#E9DDFB] shadow-sm mb-2">
                <Sparkles className="w-8 h-8 text-[#5E3F87]" />
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#2F3142]">
                LifeOS
              </h1>
              <h2 className="text-lg md:text-xl font-bold text-[#553E74]">
                Your life, understood as one system.
              </h2>
              <p className="text-xs md:text-sm text-[#6C6E82] max-w-md mx-auto leading-relaxed">
                Goals, career, learning, finances, and time — connected and dynamically replanned by one AI Life Agent.
              </p>
            </div>

            {/* Feature pills */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-lg mx-auto py-2">
              <div className="p-2.5 rounded-xl bg-white/90 border border-[#EFEBF5] text-xs">
                <Target className="w-4 h-4 text-[#8C3A54] mx-auto mb-1" />
                <span className="font-semibold text-[#3C3A4F]">Goals</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 border border-[#EFEBF5] text-xs">
                <Briefcase className="w-4 h-4 text-[#523A73] mx-auto mb-1" />
                <span className="font-semibold text-[#3C3A4F]">Career</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 border border-[#EFEBF5] text-xs">
                <BookOpen className="w-4 h-4 text-[#226337] mx-auto mb-1" />
                <span className="font-semibold text-[#3C3A4F]">Learning</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/90 border border-[#EFEBF5] text-xs">
                <Calendar className="w-4 h-4 text-[#5489C7] mx-auto mb-1" />
                <span className="font-semibold text-[#3C3A4F]">Schedule</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setStep('wizard')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#523A73] hover:bg-[#432F5F] text-white text-xs md:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Build My LifeOS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSelectDemo}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-[#FAF8FD] text-[#523A73] border border-[#E2DCED] text-xs md:text-sm font-bold shadow-2xs hover:shadow transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#8A67B6]" />
                <span>Try Demo LifeOS (Alex)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Wizard View */
          <form onSubmit={handleFinishWizard} className="p-8 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#795B9B] mb-1">
                <span>Setup Your Profile</span>
              </div>
              <h2 className="text-xl font-bold text-[#2F3142]">Configure Your Life Parameters</h2>
              <p className="text-xs text-[#717387]">
                Provide your core details so LifeOS AI can calculate realistic timelines and roadmaps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#444658]">Your Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444658]">Current Role</label>
                <input
                  type="text"
                  required
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#444658]">Main Life / Career Goal</label>
              <input
                type="text"
                required
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
                placeholder="e.g. Get a Software Engineering Internship in 4 Months"
                className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#444658]">Current Verified Skills</label>
                <input
                  type="text"
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  placeholder="e.g. Python, SQL, Git"
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444658]">
                  Available Hours / Day for Career Prep
                </label>
                <input
                  type="number"
                  min={1}
                  max={16}
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseInt(e.target.value) || 4)}
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#444658]">Current Commitments</label>
                <input
                  type="text"
                  value={commitments}
                  onChange={(e) => setCommitments(e.target.value)}
                  placeholder="e.g. College Classes (5 hrs/day)"
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#444658]">Financial Target Goal</label>
                <input
                  type="text"
                  value={financialGoal}
                  onChange={(e) => setFinancialGoal(e.target.value)}
                  placeholder="e.g. Save ₹20,000 for Tech Setup"
                  className="w-full mt-1 px-3 py-2 rounded-xl text-xs border border-[#E2DCED] focus:border-[#8E6EC8] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F0EBF5]">
              <button
                type="button"
                onClick={() => setStep('landing')}
                className="px-4 py-2 text-xs font-semibold text-[#76788D] hover:bg-gray-100 rounded-xl"
              >
                Back
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#523A73] hover:bg-[#432F5F] text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                Generate My LifeOS Dashboard
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
