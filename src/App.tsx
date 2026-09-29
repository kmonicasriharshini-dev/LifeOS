import React, { useState } from 'react';
import { LifeOSProvider, useLifeOS } from './context/LifeOSContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GoalsView } from './components/GoalsView';
import { LearningView } from './components/LearningView';
import { CareerView } from './components/CareerView';
import { FinanceView } from './components/FinanceView';
import { ScheduleView } from './components/ScheduleView';
import { ProgressView } from './components/ProgressView';
import { AIAgentView } from './components/AIAgentView';
import { OnboardingModal } from './components/OnboardingModal';

function MainApp() {
  const { state } = useLifeOS();
  const [showOnboarding, setShowOnboarding] = useState(!state.user.isOnboarded);

  const renderActiveSection = () => {
    switch (state.activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'goals':
        return <GoalsView />;
      case 'learning':
        return <LearningView />;
      case 'career':
        return <CareerView />;
      case 'finance':
        return <FinanceView />;
      case 'schedule':
        return <ScheduleView />;
      case 'progress':
        return <ProgressView />;
      case 'ai_agent':
        return <AIAgentView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDFB] text-[#2F3142]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveSection()}
        </main>
      </div>

      {/* Onboarding / Setup Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LifeOSProvider>
      <MainApp />
    </LifeOSProvider>
  );
}
