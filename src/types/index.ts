export type LifeArea = 'goals' | 'career' | 'learning' | 'finance' | 'schedule' | 'progress';

export interface Milestone {
  id: string;
  period: string; // e.g. "Month 1", "Month 2"
  title: string;
  items: string[];
  status: 'completed' | 'current' | 'upcoming' | 'delayed' | 'accelerated';
  tag?: string; // e.g. "Lightened for Exams", "Vacation Sprint", "Completed"
  intensity?: 'light' | 'moderate' | 'heavy';
}

export interface Goal {
  id: string;
  name: string;
  category: 'Career' | 'Learning' | 'Finance' | 'Personal' | 'Health';
  targetDate: string;
  progress: number; // 0 - 100
  description: string;
  status: 'active' | 'in_progress' | 'completed' | 'on_hold';
  roadmap: Milestone[];
}

export interface LearningSkill {
  id: string;
  skill: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  targetLevel: 'Intermediate' | 'Advanced' | 'Industry-Ready';
  progress: number; // 0 - 100
  targetDate: string;
  timeAvailablePerWeek: number; // hours
  connectedCareerGoal: string;
  topics: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  notes?: string;
}

export interface CareerProject {
  id: string;
  name: string;
  tech: string;
  status: 'completed' | 'in_progress' | 'planned';
  description: string;
}

export interface CareerCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  status: 'completed' | 'in_progress';
}

export interface SkillGap {
  skill: string;
  gapLevel: 'High' | 'Medium' | 'Low';
  actionPlan: string;
}

export interface CareerProfile {
  targetRole: string;
  careerGoal: string;
  currentSkills: string[];
  projectsCount: number;
  certificationsCount: number;
  resumeStatus: string;
  experience: string;
  projects: CareerProject[];
  certifications: CareerCertification[];
  skillGaps: SkillGap[];
  roadmapPhases: {
    id: string;
    phase: string;
    period: string;
    tasks: string[];
    status: 'completed' | 'active' | 'upcoming' | 'shifted' | 'accelerated';
    intensity: 'light' | 'normal' | 'sprint';
    annotation?: string;
  }[];
}

export interface PlannedPurchase {
  id: string;
  name: string;
  cost: number;
  targetDate: string;
  status: 'planning' | 'saved' | 'purchased';
}

export interface FinanceProfile {
  currency: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  currentSavings: number;
  plannedPurchases: PlannedPurchase[];
}

export interface ScheduleCommitment {
  id: string;
  title: string;
  category: 'Exams' | 'Classes' | 'Vacation' | 'Work' | 'Projects' | 'Personal';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dailyHoursCommitment: number; // hours spent on this commitment per day
  impactOnCareerPrep: 'heavy_reduction' | 'moderate_reduction' | 'high_availability' | 'neutral';
  notes: string;
}

export interface ProposedDiff {
  area: 'Career Roadmap' | 'Learning' | 'Schedule' | 'Goals' | 'Finance';
  before: string;
  after: string;
  impact: string;
}

export interface ActionProposal {
  id: string;
  type: 'REPLAN_ROADMAP' | 'ADD_COMMITMENT' | 'UPDATE_LEARNING' | 'COMPLETE_MILESTONE' | 'VACATION_BOOST' | 'GENERAL_ADJUSTMENT';
  summary: string;
  explanation: string;
  diffs: ProposedDiff[];
  applied: boolean;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  text: string;
  reasoning?: string;
  actionProposal?: ActionProposal;
}

export interface UserProfile {
  name: string;
  role: string;
  mainGoal: string;
  baselineHoursPerDay: number;
  isOnboarded: boolean;
}

export interface LifeOSState {
  user: UserProfile;
  goals: Goal[];
  learning: LearningSkill[];
  career: CareerProfile;
  finance: FinanceProfile;
  schedule: ScheduleCommitment[];
  chatHistory: ChatMessage[];
  pendingProposal: ActionProposal | null;
  activeSection: 'dashboard' | 'goals' | 'learning' | 'career' | 'finance' | 'schedule' | 'progress' | 'ai_agent';
}
