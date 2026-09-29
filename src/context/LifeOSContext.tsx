import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LifeOSState,
  Goal,
  LearningSkill,
  CareerProfile,
  FinanceProfile,
  ScheduleCommitment,
  ActionProposal,
  ChatMessage,
  LifeArea,
} from '../types';
import { initialDemoData } from '../data/initialData';
import { askLifeOS, fetchAIFocusSummary } from '../services/aiService';

interface LifeOSContextType {
  state: LifeOSState;
  setActiveSection: (section: LifeOSState['activeSection']) => void;
  sendMessage: (messageText: string) => Promise<void>;
  applyProposal: (proposalId: string) => void;
  cancelProposal: (proposalId: string) => void;
  runDemoStep: (stepNumber: 1 | 2 | 3 | 4 | 5) => Promise<void>;
  resetToDemo: () => void;
  completeOnboarding: (userData: Partial<LifeOSState['user']>) => void;
  updateGoal: (updatedGoal: Goal) => void;
  addGoal: (newGoal: Goal) => void;
  updateLearningSkill: (updatedSkill: LearningSkill) => void;
  addLearningSkill: (newSkill: LearningSkill) => void;
  toggleLearningTopic: (skillId: string, topicId: string) => void;
  updateCareerProfile: (updatedProfile: Partial<CareerProfile>) => void;
  updateFinance: (updatedFinance: Partial<FinanceProfile>) => void;
  addScheduleCommitment: (commitment: ScheduleCommitment) => void;
  deleteScheduleCommitment: (id: string) => void;
  computedMetrics: {
    weeklyAvailableHours: number;
    activeGoalsCount: number;
    careerStatus: string;
    learningOverallProgress: number;
    remainingBudget: number;
    upcomingDeadlinesCount: number;
    aiFocusText: string;
  };
  isAILoading: boolean;
}

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'lifeos_data_v1';

export const LifeOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LifeOSState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load LifeOS state from localStorage:', e);
    }
    return initialDemoData;
  });

  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [aiFocusText, setAiFocusText] = useState<string>(
    'Your main priority this week is your upcoming coursework and Python AsyncIO module. Your internship roadmap is on track with 18 hours of dedicated prep time available.'
  );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist LifeOS state:', e);
    }
  }, [state]);

  // Update AI focus summary when schedule or goals change
  useEffect(() => {
    fetchAIFocusSummary(state).then((focus) => {
      setAiFocusText(focus);
    });
  }, [state.schedule, state.goals]);

  // Navigation
  const setActiveSection = (section: LifeOSState['activeSection']) => {
    setState((prev) => ({ ...prev, activeSection: section }));
  };

  // Chat & AI Interactions
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: messageText,
    };

    // Update state with user message immediately
    setState((prev) => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMsg],
    }));

    setIsAILoading(true);

    try {
      const response = await askLifeOS(messageText, state);

      const agentMsg: ChatMessage = {
        id: 'agent-' + Date.now(),
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.message,
        reasoning: response.reasoning,
        actionProposal: response.actionProposal,
      };

      setState((prev) => ({
        ...prev,
        chatHistory: [...prev.chatHistory, agentMsg],
        pendingProposal: response.actionProposal || prev.pendingProposal,
      }));
    } catch (err) {
      console.error('Error receiving AI response:', err);
    } finally {
      setIsAILoading(false);
    }
  };

  // Apply Changes from AI Proposal
  const applyProposal = (proposalId: string) => {
    setState((prev) => {
      const proposal = prev.pendingProposal;
      if (!proposal || proposal.id !== proposalId) return prev;

      let newSchedule = [...prev.schedule];
      let newCareer = { ...prev.career };
      let newLearning = [...prev.learning];
      let newGoals = [...prev.goals];
      let newFinance = { ...prev.finance };

      if (proposal.type === 'REPLAN_ROADMAP') {
        // Exams Scenario: Add exams to schedule, lighten career load, shift project
        const hasExam = newSchedule.some((s) => s.category === 'Exams');
        if (!hasExam) {
          newSchedule.push({
            id: 'sch-exams-midterms',
            title: 'Midterm Semester Examinations',
            category: 'Exams',
            startDate: '2026-10-01',
            endDate: '2026-10-14',
            dailyHoursCommitment: 8,
            impactOnCareerPrep: 'heavy_reduction',
            notes: 'High-stakes exams requiring 8h/day study. Career prep reduced to 30-min maintenance sessions.',
          });
        }

        // Adjust career roadmap phases
        newCareer.roadmapPhases = newCareer.roadmapPhases.map((phase) => {
          if (phase.id === 'phase-1') {
            return {
              ...phase,
              intensity: 'light',
              annotation: 'Lightened for Exams (30m DSA drills/day)',
              tasks: ['Maintain DSA basics (30m daily)', 'University exam focus', 'Pause heavy coding'],
            };
          }
          if (phase.id === 'phase-2') {
            return {
              ...phase,
              status: 'shifted',
              annotation: 'Shifted to Post-Exam window',
              tasks: ['Distributed Task Queue build (resumes post-exams)', 'Docker & Redis integration', 'Intensive project sprint'],
            };
          }
          return phase;
        });

        // Lighten learning hours
        newLearning = newLearning.map((l) => ({
          ...l,
          timeAvailablePerWeek: 2, // reduced to 2h/wk each
        }));

        // Adjust goal status
        newGoals = newGoals.map((g) => {
          if (g.id === 'g-internship') {
            return {
              ...g,
              roadmap: g.roadmap.map((m) => {
                if (m.id === 'm1') {
                  return { ...m, tag: 'Exam Lightened (30m/day)' };
                }
                if (m.id === 'm2') {
                  return { ...m, tag: 'Shifted Post-Exams' };
                }
                return m;
              }),
            };
          }
          return g;
        });
      } else if (proposal.type === 'VACATION_BOOST') {
        // 10-Day Vacation Scenario: Expand schedule, fast-track project
        const hasVacation = newSchedule.some((s) => s.category === 'Vacation');
        if (!hasVacation) {
          newSchedule.push({
            id: 'sch-vacation-sprint',
            title: '10-Day Winter Vacation / Break',
            category: 'Vacation',
            startDate: '2026-12-01',
            endDate: '2026-12-10',
            dailyHoursCommitment: 0,
            impactOnCareerPrep: 'high_availability',
            notes: 'Zero classes. Yields 8h/day peak bandwidth for fullstack project sprint.',
          });
        }

        // Accelerate career roadmap
        newCareer.roadmapPhases = newCareer.roadmapPhases.map((phase) => {
          if (phase.id === 'phase-2') {
            return {
              ...phase,
              status: 'accelerated',
              intensity: 'sprint',
              annotation: '10-Day Vacation Sprint (Fast-Tracked)',
              tasks: [
                'Complete Distributed Task Queue in 6 days',
                'Deploy to AWS with Docker & Redis',
                'Draft project showcase & resume bullets',
              ],
            };
          }
          return phase;
        });

        // Boost learning hours
        newLearning = newLearning.map((l) => {
          if (l.skill.includes('DSA')) {
            return { ...l, timeAvailablePerWeek: 14, progress: Math.min(100, l.progress + 20) };
          }
          return { ...l, timeAvailablePerWeek: 10 };
        });

        // Update goal roadmap
        newGoals = newGoals.map((g) => {
          if (g.id === 'g-internship') {
            return {
              ...g,
              progress: Math.min(100, g.progress + 15),
              roadmap: g.roadmap.map((m) => {
                if (m.id === 'm2') {
                  return { ...m, tag: 'Accelerated in Vacation Sprint' };
                }
                return m;
              }),
            };
          }
          return g;
        });
      } else if (proposal.type === 'COMPLETE_MILESTONE') {
        // Python completed scenario
        newLearning = newLearning.map((l) => {
          if (l.skill.includes('Python')) {
            return {
              ...l,
              currentLevel: 'Advanced',
              progress: 100,
              topics: l.topics.map((t) => ({ ...t, completed: true })),
            };
          }
          return l;
        });

        // Advance career roadmap
        newCareer.roadmapPhases = newCareer.roadmapPhases.map((phase) => {
          if (phase.id === 'phase-1') {
            return { ...phase, status: 'completed', annotation: 'Completed Foundation' };
          }
          if (phase.id === 'phase-2') {
            return { ...phase, status: 'active', annotation: 'Currently Active: Building Projects' };
          }
          return phase;
        });

        // Update goal
        newGoals = newGoals.map((g) => {
          if (g.id === 'g-internship') {
            return {
              ...g,
              progress: 55,
              roadmap: g.roadmap.map((m) => {
                if (m.id === 'm1') {
                  return { ...m, status: 'completed', tag: 'Mastered' };
                }
                if (m.id === 'm2') {
                  return { ...m, status: 'current', tag: 'In Progress' };
                }
                return m;
              }),
            };
          }
          return g;
        });
      } else if (proposal.type === 'GENERAL_ADJUSTMENT') {
        // e.g. laptop purchase
        newFinance.plannedPurchases = [
          ...newFinance.plannedPurchases,
          {
            id: 'pur-laptop',
            name: 'High-Performance Dev Laptop',
            cost: 65000,
            targetDate: '3 months',
            status: 'planning',
          },
        ];
      }

      // Append confirmation message to chat
      const confirmMsg: ChatMessage = {
        id: 'sys-' + Date.now(),
        sender: 'system',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `✅ **Plan Updated Successfully!** LifeOS has synchronized your **Schedule**, **Career Roadmap**, and **Learning allocations** according to the proposal: "${proposal.summary}".`,
      };

      // Mark applied in chat history
      const updatedChat = prev.chatHistory.map((m) => {
        if (m.actionProposal && m.actionProposal.id === proposalId) {
          return {
            ...m,
            actionProposal: { ...m.actionProposal, applied: true },
          };
        }
        return m;
      });

      return {
        ...prev,
        schedule: newSchedule,
        career: newCareer,
        learning: newLearning,
        goals: newGoals,
        finance: newFinance,
        pendingProposal: null,
        chatHistory: [...updatedChat, confirmMsg],
      };
    });
  };

  // Cancel Proposal
  const cancelProposal = (proposalId: string) => {
    setState((prev) => {
      const cancelMsg: ChatMessage = {
        id: 'sys-cancel-' + Date.now(),
        sender: 'system',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `🚫 Proposed plan adjustments were canceled. Your previous roadmap and allocations remain intact.`,
      };
      return {
        ...prev,
        pendingProposal: null,
        chatHistory: [...prev.chatHistory, cancelMsg],
      };
    });
  };

  // 1-Click Demo Steps for Effortless Scenario Demonstration
  const runDemoStep = async (stepNumber: 1 | 2 | 3 | 4 | 5) => {
    if (stepNumber === 1) {
      // Step 1: Initial Career Goal Setup
      setActiveSection('ai_agent');
      await sendMessage('I want to get an internship in 4 months.');
    } else if (stepNumber === 2) {
      // Step 2: User adds Exams for next 2 weeks
      setActiveSection('ai_agent');
      await sendMessage('I have exams for the next 2 weeks.');
    } else if (stepNumber === 3) {
      // Step 3: User adds 10-day Vacation
      setActiveSection('ai_agent');
      await sendMessage('I have a 10-day vacation.');
    } else if (stepNumber === 4) {
      // Step 4: Python course completed
      setActiveSection('ai_agent');
      await sendMessage('I completed my Python course.');
    } else if (stepNumber === 5) {
      // Step 5: What should I focus on right now?
      setActiveSection('ai_agent');
      await sendMessage('What should I focus on right now?');
    }
  };

  // Reset to default Alex demo profile
  const resetToDemo = () => {
    setState(initialDemoData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialDemoData));
  };

  // Complete onboarding
  const completeOnboarding = (userData: Partial<LifeOSState['user']>) => {
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...userData,
        isOnboarded: true,
      },
    }));
  };

  // Edit / Add Goals
  const updateGoal = (updatedGoal: Goal) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)),
    }));
  };

  const addGoal = (newGoal: Goal) => {
    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  // Learning
  const updateLearningSkill = (updatedSkill: LearningSkill) => {
    setState((prev) => ({
      ...prev,
      learning: prev.learning.map((s) => (s.id === updatedSkill.id ? updatedSkill : s)),
    }));
  };

  const addLearningSkill = (newSkill: LearningSkill) => {
    setState((prev) => ({
      ...prev,
      learning: [...prev.learning, newSkill],
    }));
  };

  const toggleLearningTopic = (skillId: string, topicId: string) => {
    setState((prev) => {
      const updatedLearning = prev.learning.map((skill) => {
        if (skill.id !== skillId) return skill;
        const newTopics = skill.topics.map((t) => (t.id === topicId ? { ...t, completed: !t.completed } : t));
        const completedCount = newTopics.filter((t) => t.completed).length;
        const newProgress = Math.round((completedCount / newTopics.length) * 100);
        return {
          ...skill,
          topics: newTopics,
          progress: newProgress,
        };
      });
      return { ...prev, learning: updatedLearning };
    });
  };

  // Career Profile
  const updateCareerProfile = (updatedProfile: Partial<CareerProfile>) => {
    setState((prev) => ({
      ...prev,
      career: { ...prev.career, ...updatedProfile },
    }));
  };

  // Finance
  const updateFinance = (updatedFinance: Partial<FinanceProfile>) => {
    setState((prev) => ({
      ...prev,
      finance: { ...prev.finance, ...updatedFinance },
    }));
  };

  // Schedule Commitments
  const addScheduleCommitment = (commitment: ScheduleCommitment) => {
    setState((prev) => ({
      ...prev,
      schedule: [...prev.schedule, commitment],
    }));
  };

  const deleteScheduleCommitment = (id: string) => {
    setState((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((s) => s.id !== id),
    }));
  };

  // Computed LifeOS Metrics
  const totalDailyCommittedHours = state.schedule.reduce((acc, curr) => acc + curr.dailyHoursCommitment, 0);
  const dailyFreeHours = Math.max(1, 16 - totalDailyCommittedHours); // assuming 8h sleep
  const weeklyAvailableHours = dailyFreeHours * 7;

  const activeGoalsCount = state.goals.filter((g) => g.status === 'active' || g.status === 'in_progress').length;

  const hasExams = state.schedule.some((s) => s.category === 'Exams');
  const hasVacation = state.schedule.some((s) => s.category === 'Vacation');
  let careerStatus = 'On Track';
  if (hasExams) careerStatus = 'Adjusted for Exams';
  else if (hasVacation) careerStatus = 'Vacation Sprint Mode';

  const learningOverallProgress = Math.round(
    state.learning.reduce((acc, l) => acc + l.progress, 0) / (state.learning.length || 1)
  );

  const remainingBudget = state.finance.monthlyIncome - state.finance.monthlyExpenses;

  const upcomingDeadlinesCount = state.schedule.length + state.goals.length;

  return (
    <LifeOSContext.Provider
      value={{
        state,
        setActiveSection,
        sendMessage,
        applyProposal,
        cancelProposal,
        runDemoStep,
        resetToDemo,
        completeOnboarding,
        updateGoal,
        addGoal,
        updateLearningSkill,
        addLearningSkill,
        toggleLearningTopic,
        updateCareerProfile,
        updateFinance,
        addScheduleCommitment,
        deleteScheduleCommitment,
        computedMetrics: {
          weeklyAvailableHours,
          activeGoalsCount,
          careerStatus,
          learningOverallProgress,
          remainingBudget,
          upcomingDeadlinesCount,
          aiFocusText,
        },
        isAILoading,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};

export const useLifeOS = () => {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
};
