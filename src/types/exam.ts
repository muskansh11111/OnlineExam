export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  category?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  questions: Question[];
  totalPoints: number;
  passingScore: number;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: { [questionId: string]: number };
  score: number;
  percentage: number;
  timeSpent: number; // in seconds
  startTime: string;
  endTime: string;
  passed: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  attempts: ExamAttempt[];
}

export interface ExamSession {
  examId: string;
  startTime: number;
  duration: number;
  currentQuestionIndex: number;
  answers: { [questionId: string]: number };
  timeRemaining: number;
}