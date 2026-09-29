import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize GoogleGenAI client with standard header
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback rule-based cross-domain dynamic replanner
function generateLocalCrossDomainPlan(userMessage: string, state: any) {
  const lower = userMessage.toLowerCase();

  // Scenario 1: Exams for next 2 weeks (Reduced availability)
  if (lower.includes('exam') || lower.includes('midterm') || lower.includes('finals')) {
    return {
      message:
        "Your upcoming exams will significantly reduce your daily career-preparation time from 4 hours down to ~1.5 hours for the next two weeks. I have dynamically replanned your roadmap: heavy project building has been shifted to your post-exam window, while your current schedule is lightened to short daily DSA retention drills (30 mins) so you don't lose momentum.",
      reasoning:
        "Cross-Domain Conflict: Schedule (Exams: 8h/day study load) directly clashes with Career Milestone 2 ('Heavy Project Engineering'). Shifted high-intensity tasks post-exam to protect university GPA while keeping light revision.",
      actionProposal: {
        id: 'prop-' + Date.now(),
        type: 'REPLAN_ROADMAP',
        summary: 'Replan Career Roadmap & Learning Load Around 2-Week Exam Window',
        explanation: 'Temporarily reduce daily career prep commitment, delay high-intensity projects, and schedule focused exam preparation block.',
        diffs: [
          {
            area: 'Schedule',
            before: 'University Classes only (4h free/day)',
            after: 'Added: Semester Midterm Exams (Oct 1–14, 8h/day study, ~1.5h career prep remaining)',
            impact: 'Protects GPA while setting realistic preparation bandwidth',
          },
          {
            area: 'Career Roadmap',
            before: 'Month 1–2: Heavy Distributed Task Queue project build',
            after: 'Month 1 (Exams): Light DSA reviews (30m/day) → Heavy Project build shifted to post-exam window',
            impact: 'Prevents burnout and missed project milestones',
          },
          {
            area: 'Learning',
            before: 'Python (6h/wk) + DSA (8h/wk) = 14 hrs/week',
            after: 'Lightened Maintenance Mode: 4 hrs/week total (quick 30-min flashcards & easy problem sets)',
            impact: 'Keeps skill retention high without draining exam energy',
          },
        ],
        applied: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    };
  }

  // Scenario 2: 10-Day Vacation / Break (Expanded availability)
  if (lower.includes('vacation') || lower.includes('holiday') || lower.includes('break')) {
    return {
      message:
        "Exciting news! Your 10-day vacation frees up your university lecture hours, expanding your available preparation bandwidth to 7–8 hours per day. I have structured a high-velocity 'Career Acceleration Sprint' during this window to build your fullstack project, polish your GitHub, and get your resume ready 2 weeks ahead of schedule.",
      reasoning:
        "Cross-Domain Opportunity: Schedule (Vacation: 0 class hours) creates a high-availability surge (50+ available hours). Utilized to front-load technical project completion and close the high-priority DSA recursion & graph gaps.",
      actionProposal: {
        id: 'prop-' + Date.now(),
        type: 'VACATION_BOOST',
        summary: 'Activate 10-Day Project Acceleration & Portfolio Sprint',
        explanation: 'Utilize 10 days of zero class commitments to accelerate project building and start early internship applications.',
        diffs: [
          {
            area: 'Schedule',
            before: 'Standard semester schedule (4h free/day)',
            after: 'Added: 10-Day Winter Vacation (Dec 1–10, 8h/day peak availability)',
            impact: 'Yields 50+ focused engineering hours',
          },
          {
            area: 'Career Roadmap',
            before: 'Month 2 project completion staggered over 4 weeks',
            after: 'Compressed Sprint: Complete Distributed Task Queue project + Docker deployment in 10 days',
            impact: 'Pulls application readiness forward by 14 days',
          },
          {
            area: 'Learning',
            before: 'DSA Graph & DP topics planned for late November',
            after: 'Dedicated 3-day deep dive into Graphs, BFS/DFS, and NeetCode 75 patterns',
            impact: 'Closes critical technical interview gaps before applications open',
          },
        ],
        applied: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    };
  }

  // Scenario 3: Completed Python course / skill update
  if (lower.includes('completed') || lower.includes('finished') || lower.includes('passed')) {
    return {
      message:
        "Congratulations on completing your Python course! Because your Python foundation is now solid at an Advanced level, I have updated your learning mastery to 100%, marked your foundation milestone complete, and unlocked the next phase in your career roadmap: practical backend system building with FastAPI and Distributed Systems.",
      reasoning:
        "Cross-Domain Progression: Learning (Python mastery completed) satisfies the prerequisite for Career Phase 2 ('Fullstack Distributed Task Queue Project'). Upgraded skill levels and advanced roadmap milestone.",
      actionProposal: {
        id: 'prop-' + Date.now(),
        type: 'COMPLETE_MILESTONE',
        summary: 'Mark Python Foundation Complete & Unlock Backend Project Phase',
        explanation: 'Promote Python skill level to Advanced, mark syllabus completed, and transition roadmap focus to project engineering.',
        diffs: [
          {
            area: 'Learning',
            before: 'Python: Intermediate (68% complete, remaining AsyncIO & pytest)',
            after: 'Python: Advanced (100% complete, syllabus mastered)',
            impact: 'Foundation validated for technical interviews',
          },
          {
            area: 'Career Roadmap',
            before: 'Phase 1: Foundations & Python study (Active)',
            after: 'Phase 1 marked [Completed] → Phase 2: Distributed Backend Systems now [Active]',
            impact: 'Transitions directly from theory to resume-worthy project building',
          },
          {
            area: 'Goals',
            before: 'Internship Goal: 35% overall progress',
            after: 'Internship Goal: 55% overall progress (Foundation milestone checked off)',
            impact: 'Keeps motivation high with tangible progress metrics',
          },
        ],
        applied: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    };
  }

  // Scenario 4: "What should I focus on this week / right now?"
  if (lower.includes('focus') || lower.includes('priority') || lower.includes('what should i do')) {
    const hasExams = state?.schedule?.some((s: any) => s.category === 'Exams');
    if (hasExams) {
      return {
        message:
          "**Your LifeOS Weekly Focus:**\n\n1. **Primary Priority:** Your upcoming Midterm Exams require ~70% of your mental energy. Focus on your university coursework.\n2. **Secondary Career Maintenance:** Do NOT try to build large projects this week. Spend just **30 minutes each evening** reviewing 2 LeetCode problems (Hash Maps & Two Pointers) to maintain muscle memory.\n3. **Financial Tip:** Keep discretionary dining low this week as exam stress eating can impact your ₹20,000 tech setup goal.\n\nYour internship roadmap has already deferred the heavy coding tasks to after your exams.",
        reasoning:
          "Cross-Domain Synthesis: Active Exams in Schedule dictate that Career hours must be defensively allocated to prevent academic slip while preventing skill decay.",
      };
    } else {
      return {
        message:
          "**Your LifeOS Weekly Focus:**\n\n1. **Core Technical Goal:** Complete your Python AsyncIO and pytest units in Learning (allocated 6 hours this week).\n2. **Career Milestone:** Finalize architecture specs for your Distributed Task Queue project before Month 2 starts.\n3. **Schedule Bandwidth:** You currently have **18 available hours** outside university classes—plenty of room for steady progress without late-night cramming.\n4. **Finance:** On track! ₹14,500 saved toward your ₹20,000 tech setup goal.",
        reasoning:
          "Cross-Domain Synthesis: Standard semester load allows 4 hours/day. Balancing Learning (DSA + Python) with initial Project 3 design.",
      };
    }
  }

  // Scenario 5: Financial purchase (e.g. laptop / monitor / savings)
  if (lower.includes('laptop') || lower.includes('buy') || lower.includes('purchase') || lower.includes('money') || lower.includes('save')) {
    return {
      message:
        "Looking at your financial budget: You save approximately ₹13,000/month (Income ₹25,000 - Expenses ₹12,000). With ₹14,500 already in savings, you can easily finance a new tech purchase within 2 to 3 months without compromising your baseline emergency buffer. I've updated your planned purchases so you can see this timeline clearly.",
      reasoning:
        "Cross-Domain Linkage: Career productivity tool directly connected to monthly net disposable income and current savings milestones.",
      actionProposal: {
        id: 'prop-' + Date.now(),
        type: 'GENERAL_ADJUSTMENT',
        summary: 'Add Planned Hardware Purchase to Finance Roadmap',
        explanation: 'Model budget cashflow to verify the target purchase date without disrupting college living expenses.',
        diffs: [
          {
            area: 'Finance',
            before: 'Planned Purchases: 2 items (Coding Monitor ₹16,000, Cert Voucher ₹8,000)',
            after: 'Added: Development Laptop (Budget ₹65,000, Target: 3 months out with monthly ₹12,000 allocation)',
            impact: 'Realistic timeline without draining living expenses',
          },
        ],
        applied: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    };
  }

  // General query fallback with cross-domain context awareness
  return {
    message:
      `I've analyzed your current LifeOS state: Your main goal of securing a **${state?.career?.targetRole || 'Software Engineering Internship'}** in 4 months is currently on track. You have **${state?.learning?.length || 3} active learning tracks**, and your weekly schedule currently affords steady evening progress.\n\nTell me if any upcoming events (exams, vacations, part-time work, or new goals) are coming up, and I will adjust the whole system for you.`,
    reasoning:
      'Balanced state overview: Synchronized Schedule, Learning hours, and Career milestones.',
  };
}

// AI Chat Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, state } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // If Gemini API is available, try invoking gemini-3.8-flash with cross-domain system prompt
  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are LifeOS AI — an intelligent Life Operating System engine.
The core idea is: The AI doesn't manage one isolated task. It manages the relationships between different parts of the user's life:
- Goals (Career, Learning, Finance, Health)
- Schedule & Commitments (Classes, Exams, Vacations, Work, Daily Hours)
- Career Profile (Target Role, Current Skills, Projects, Gaps, Roadmap)
- Learning (Skills, Topics, Progress, Weekly hours)
- Finances (Income, Expenses, Savings, Purchases)

USER PROFILE & CURRENT LIFEOS STATE:
${JSON.stringify(
  {
    user: state?.user,
    goals: state?.goals?.map((g: any) => ({ name: g.name, progress: g.progress, target: g.targetDate })),
    schedule: state?.schedule,
    career: {
      targetRole: state?.career?.targetRole,
      careerGoal: state?.career?.careerGoal,
      currentSkills: state?.career?.currentSkills,
      projects: state?.career?.projects?.map((p: any) => ({ name: p.name, status: p.status })),
      roadmapPhases: state?.career?.roadmapPhases,
    },
    learning: state?.learning?.map((l: any) => ({ skill: l.skill, progress: l.progress, hours: l.timeAvailablePerWeek })),
    finance: {
      income: state?.finance?.monthlyIncome,
      expenses: state?.finance?.monthlyExpenses,
      savings: state?.finance?.currentSavings,
      goal: state?.finance?.savingsGoal,
    },
  },
  null,
  2
)}

USER MESSAGE: "${message}"

INSTRUCTIONS:
1. Emphasize how changes in one area (e.g. Schedule / Exams / Vacation / Learning / Finance) affect other areas (Career roadmap, Learning hours, Priorities).
2. If the user announces a commitment change (like exams or vacation) or completed course or schedule limit, create a concrete actionProposal with diffs (Before vs After) so the user can click "Apply Changes" in the UI.
3. Keep the tone calm, encouraging, concise, and structured. No fluff. Do NOT expose internal chain-of-thought, but explain the cross-domain reasoning clearly.

Return a valid JSON object matching:
{
  "message": "Direct, empathetic response explaining the plan or advice",
  "reasoning": "1-2 sentences highlighting the cross-domain relationships analyzed",
  "actionProposal": {
    "type": "REPLAN_ROADMAP" | "VACATION_BOOST" | "COMPLETE_MILESTONE" | "ADD_COMMITMENT" | "GENERAL_ADJUSTMENT",
    "summary": "Short title of proposed plan changes",
    "explanation": "Why this adjustment balances their life",
    "diffs": [
      {
        "area": "Career Roadmap" | "Learning" | "Schedule" | "Goals" | "Finance",
        "before": "previous state",
        "after": "new proposed state",
        "impact": "why this helps"
      }
    ]
  }
}
If no action proposal is needed (e.g. general question), omit "actionProposal" or set to null.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text;
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          if (parsed.actionProposal) {
            parsed.actionProposal.id = 'prop-' + Date.now();
            parsed.actionProposal.applied = false;
            parsed.actionProposal.timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          return res.json(parsed);
        } catch (jsonErr) {
          // Fall through to local replanner if JSON parsing fails
        }
      }
    } catch (apiError: any) {
      console.warn('Gemini API call returned error or quota limit; using LifeOS Intelligent Heuristic Engine:', apiError?.message || apiError);
    }
  }

  // Resilient domain replanner
  const localResult = generateLocalCrossDomainPlan(message, state);
  return res.json(localResult);
});

// AI Focus summary endpoint
app.post('/api/ai/focus', async (req: Request, res: Response) => {
  const { state } = req.body;
  const hasExams = state?.schedule?.some((s: any) => s.category === 'Exams');
  const hasVacation = state?.schedule?.some((s: any) => s.category === 'Vacation');

  let focus = '';
  if (hasExams) {
    focus =
      'Your main priority this week is your upcoming exam. Your internship roadmap has been adjusted with lighter learning sessions (30m daily) until your exams are finished so you protect your grades without losing consistency.';
  } else if (hasVacation) {
    focus =
      'You are currently in an active 10-day Vacation Sprint! With zero university lectures, you have 50+ available hours. Focus on building your Distributed Task Queue project and polishing your resume ahead of schedule.';
  } else {
    focus =
      'Your main priority this week is completing your Python AsyncIO module and solving 5 LeetCode tree problems. Your internship roadmap is on track with 18 hours of dedicated prep time available.';
  }

  return res.json({ focus });
});

// Setup Vite or production static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LifeOS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
