// Simple in-memory database
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'professor';
  xp: number;
  faculty: string;
  password?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  created_by: string;
  is_active: boolean;
  type: 'quiz' | 'assignment' | 'project';
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

export interface QuestProgress {
  id: string;
  user_id: string;
  quest_id: string;
  score: number;
  completed_at?: string;
  is_completed: boolean;
}

export interface Badge {
  id: string;
  user_id: string;
  title: string;
  description: string;
  earned_at: string;
  icon: string;
}

// In-memory storage
let users: User[] = [
  {
    id: '1',
    email: 'aigerim@example.com',
    full_name: 'Aigerim Kenzhe',
    role: 'student',
    xp: 0,
    faculty: 'Computer Science',
    password: 'student123'
  },
  {
    id: '2',
    email: 'alidar@example.com',
    full_name: 'Alidar Koyanbaev',
    role: 'professor',
    xp: 0,
    faculty: 'Computer Science',
    password: 'professor123'
  }
];

let quests: Quest[] = [
  {
    id: '1',
    title: 'Intro to Algorithms',
    description: 'Learn the fundamentals of algorithms and data structures',
    xp: 300,
    created_by: '2',
    is_active: true,
    type: 'assignment'
  },
  {
    id: '2',
    title: 'Business & Management Quiz',
    description: 'Test your knowledge in business and management concepts',
    xp: 150,
    created_by: '2',
    is_active: true,
    type: 'quiz',
    questions: [
      {
        id: '1',
        question: 'What is the primary goal of strategic management?',
        options: [
          'Maximizing short-term profits',
          'Creating sustainable competitive advantage',
          'Reducing operational costs',
          'Increasing market share'
        ],
        correct_answer: 1
      },
      {
        id: '2',
        question: 'Which of the following is NOT a component of the marketing mix?',
        options: [
          'Product',
          'Price',
          'Promotion',
          'Performance'
        ],
        correct_answer: 3
      },
      {
        id: '3',
        question: 'What does SWOT analysis stand for?',
        options: [
          'Strengths, Weaknesses, Opportunities, Threats',
          'Systems, Workflows, Operations, Technology',
          'Sales, Workforce, Objectives, Targets',
          'Strategy, Work, Organization, Timeline'
        ],
        correct_answer: 0
      },
      {
        id: '4',
        question: 'In project management, what does the critical path represent?',
        options: [
          'The most expensive sequence of activities',
          'The longest sequence of activities that determines project duration',
          'The sequence with the most resources',
          'The sequence with the highest risk'
        ],
        correct_answer: 1
      }
    ]
  }
];

let questProgress: QuestProgress[] = [];

let badges: Badge[] = [];

// API functions
export const api = {
  // User authentication
  login: async (email: string, password: string): Promise<User | null> => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  // Get user by ID
  getUser: async (id: string): Promise<User | null> => {
    const user = users.find(u => u.id === id);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  // Get all active quests
  getQuests: async (): Promise<Quest[]> => {
    return quests.filter(q => q.is_active);
  },

  // Get quest by ID
  getQuest: async (id: string): Promise<Quest | null> => {
    return quests.find(q => q.id === id) || null;
  },

  // Get user's quest progress
  getUserProgress: async (userId: string): Promise<QuestProgress[]> => {
    return questProgress.filter(qp => qp.user_id === userId);
  },

  // Complete quest
  completeQuest: async (userId: string, questId: string, score: number): Promise<QuestProgress> => {
    const existingProgress = questProgress.find(qp => qp.user_id === userId && qp.quest_id === questId);
    
    if (existingProgress) {
      existingProgress.score = Math.max(existingProgress.score, score);
      existingProgress.completed_at = new Date().toISOString();
      existingProgress.is_completed = true;
      return existingProgress;
    }

    const newProgress: QuestProgress = {
      id: Date.now().toString(),
      user_id: userId,
      quest_id: questId,
      score,
      completed_at: new Date().toISOString(),
      is_completed: true
    };

    questProgress.push(newProgress);

    // Award XP to user
    const user = users.find(u => u.id === userId);
    const quest = quests.find(q => q.id === questId);
    if (user && quest) {
      user.xp += Math.floor((score / 100) * quest.xp);
    }

    // Award badge if score is high enough
    if (score >= 80) {
      await api.awardBadge(userId, quest?.title || 'Quest Completed', `Completed ${quest?.title} with ${score}% score`);
    }

    return newProgress;
  },

  // Award badge
  awardBadge: async (userId: string, title: string, description: string): Promise<Badge> => {
    const badge: Badge = {
      id: Date.now().toString(),
      user_id: userId,
      title,
      description,
      earned_at: new Date().toISOString(),
      icon: '🏆'
    };

    badges.push(badge);
    return badge;
  },

  // Get user badges
  getUserBadges: async (userId: string): Promise<Badge[]> => {
    return badges.filter(b => b.user_id === userId);
  },

  // Create new quest (for professors)
  createQuest: async (quest: Omit<Quest, 'id'>): Promise<Quest> => {
    const newQuest: Quest = {
      ...quest,
      id: Date.now().toString()
    };
    quests.push(newQuest);
    return newQuest;
  },

  // Get analytics for professor
  getAnalytics: async (professorId: string) => {
    const professorQuests = quests.filter(q => q.created_by === professorId);
    const questIds = professorQuests.map(q => q.id);
    const relevantProgress = questProgress.filter(qp => questIds.includes(qp.quest_id));
    
    const studentStats = users.filter(u => u.role === 'student').map(student => {
      const studentProgress = relevantProgress.filter(qp => qp.user_id === student.id);
      const completedQuests = studentProgress.filter(qp => qp.is_completed).length;
      const averageScore = studentProgress.length > 0 
        ? studentProgress.reduce((sum, qp) => sum + qp.score, 0) / studentProgress.length 
        : 0;

      return {
        student_name: student.full_name,
        xp: student.xp,
        completed_quests: completedQuests,
        average_score: Math.round(averageScore)
      };
    });

    return {
      total_students: users.filter(u => u.role === 'student').length,
      total_quests: professorQuests.length,
      total_completions: relevantProgress.filter(qp => qp.is_completed).length,
      student_stats: studentStats
    };
  },

  // Get leaderboard
  getLeaderboard: async (): Promise<User[]> => {
    return users
      .filter(u => u.role === 'student')
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10);
  }
};