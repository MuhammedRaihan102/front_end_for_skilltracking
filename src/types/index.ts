export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  category: string;
}

export interface LearningEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  duration: number;
  skillId: string;
  resources?: string[];
  notes?: string;
}

export interface User {
  name: string;
  email: string;
  goals: string[];
  streak: number;
  lastActive: string;
}