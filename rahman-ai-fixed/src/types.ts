export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: 'study' | 'project' | 'personal';
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  progress: number; // 0 to 100
  deadline: string;
  building_type: 'skyscraper' | 'tower' | 'modern' | 'glass';
}

export interface ChatMessage {
  roomCode: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video';
}

export interface ChatRoom {
  id: string;
  code: string;
  name: string;
  max_participants: number;
}

export interface TypingHistory {
  date: string;
  wpm: number;
  accuracy: number;
  mode: '1min' | '3min';
}

export interface AptitudeScore {
  date: string;
  score: number;
  category: string;
  timeTaken: number;
}

export interface UserProfile {
  name: string;
  email: string;
  college: string;
  course: string;
  graduationDate: string;
  skills: string[];
  careerGoal: string;
  avatar?: string;
  typingHistory: TypingHistory[];
  aptitudeScores: AptitudeScore[];
  readinessScore: number;
}

export const COLORS = {
  deepRed: '#8E0D3C',
  blackcurrant: '#1D1842',
  orange: '#EF3B33',
  rosePink: '#FDA1A2',
};
