import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Skill, LearningEntry, User } from '../types';

interface AppContextType {
  skills: Skill[];
  entries: LearningEntry[];
  user: User;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (skill: Skill) => void;
  deleteSkill: (id: string) => void;
  addEntry: (entry: Omit<LearningEntry, 'id'>) => void;
  updateEntry: (entry: LearningEntry) => void;
  deleteEntry: (id: string) => void;
  updateUser: (user: User) => void;
  getSkillById: (id: string) => Skill | undefined;
  getEntriesBySkill: (skillId: string) => LearningEntry[];
  calculateTotalHours: () => number;
  calculateSkillProgress: (skillId: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUser: User = {
  name: 'User',
  email: 'user@example.com',
  goals: ['Learn React', 'Master TypeScript', 'Build a portfolio project'],
  streak: 0,
  lastActive: new Date().toISOString().split('T')[0],
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [skills, setSkills] = useState<Skill[]>(() => {
    const savedSkills = localStorage.getItem('skills');
    return savedSkills ? JSON.parse(savedSkills) : [
      {
        id: uuidv4(),
        name: 'React',
        level: 'intermediate',
        progress: 65,
        category: 'Frontend',
      },
      {
        id: uuidv4(),
        name: 'TypeScript',
        level: 'beginner',
        progress: 30,
        category: 'Programming Languages',
      },
      {
        id: uuidv4(),
        name: 'Node.js',
        level: 'beginner',
        progress: 25,
        category: 'Backend',
      },
    ];
  });

  const [entries, setEntries] = useState<LearningEntry[]>(() => {
    const savedEntries = localStorage.getItem('entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Check and update streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.lastActive;
    
    if (today !== lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastActive === yesterdayStr) {
        // User was active yesterday, increment streak
        setUser({
          ...user,
          streak: user.streak + 1,
          lastActive: today,
        });
      } else {
        // User missed a day, reset streak
        setUser({
          ...user,
          streak: 1,
          lastActive: today,
        });
      }
    }
  }, []);

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill = { ...skill, id: uuidv4() };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (updatedSkill: Skill) => {
    setSkills(skills.map(skill => 
      skill.id === updatedSkill.id ? updatedSkill : skill
    ));
  };

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
    // Also delete related entries
    setEntries(entries.filter(entry => entry.skillId !== id));
  };

  const addEntry = (entry: Omit<LearningEntry, 'id'>) => {
    const newEntry = { ...entry, id: uuidv4() };
    setEntries([...entries, newEntry]);
    
    // Update skill progress
    const relatedSkill = skills.find(skill => skill.id === entry.skillId);
    if (relatedSkill) {
      const newProgress = calculateSkillProgress(entry.skillId);
      updateSkill({
        ...relatedSkill,
        progress: Math.min(100, newProgress)
      });
    }
  };

  const updateEntry = (updatedEntry: LearningEntry) => {
    setEntries(entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    
    // Update skill progress
    const relatedSkill = skills.find(skill => skill.id === updatedEntry.skillId);
    if (relatedSkill) {
      const newProgress = calculateSkillProgress(updatedEntry.skillId);
      updateSkill({
        ...relatedSkill,
        progress: Math.min(100, newProgress)
      });
    }
  };

  const deleteEntry = (id: string) => {
    const entryToDelete = entries.find(entry => entry.id === id);
    setEntries(entries.filter(entry => entry.id !== id));
    
    // Update skill progress if needed
    if (entryToDelete) {
      const relatedSkill = skills.find(skill => skill.id === entryToDelete.skillId);
      if (relatedSkill) {
        const newProgress = calculateSkillProgress(entryToDelete.skillId);
        updateSkill({
          ...relatedSkill,
          progress: Math.min(100, newProgress)
        });
      }
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const getSkillById = (id: string) => {
    return skills.find(skill => skill.id === id);
  };

  const getEntriesBySkill = (skillId: string) => {
    return entries.filter(entry => entry.skillId === skillId);
  };

  const calculateTotalHours = () => {
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  const calculateSkillProgress = (skillId: string) => {
    const skillEntries = getEntriesBySkill(skillId);
    const totalHours = skillEntries.reduce((total, entry) => total + entry.duration, 0);
    
    // Simple formula: 10 hours = 100% progress (adjust as needed)
    return Math.min(100, (totalHours / 10) * 100);
  };

  return (
    <AppContext.Provider
      value={{
        skills,
        entries,
        user,
        addSkill,
        updateSkill,
        deleteSkill,
        addEntry,
        updateEntry,
        deleteEntry,
        updateUser,
        getSkillById,
        getEntriesBySkill,
        calculateTotalHours,
        calculateSkillProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};