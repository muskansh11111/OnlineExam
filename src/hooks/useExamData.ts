import { useState, useEffect } from 'react';
import { Exam, ExamAttempt, Student, Question } from '../types/exam';

// Mock data for demonstration
const mockExams: Exam[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
    duration: 5,
    totalPoints: 100,
    passingScore: 70,
    isActive: true,
    createdAt: '2024-01-15',
    createdBy: 'admin',
    questions: [
      {
        id: 'q1',
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var myVar;', 'variable myVar;', 'v myVar;', 'declare myVar;'],
        correctAnswer: 0,
        points: 10,
        category: 'Variables'
      },
      {
        id: 'q2',
        question: 'Which method is used to add an element to the end of an array?',
        options: ['append()', 'push()', 'add()', 'insert()'],
        correctAnswer: 1,
        points: 10,
        category: 'Arrays'
      },
      {
        id: 'q3',
        question: 'What does "=== " operator do in JavaScript?',
        options: ['Assignment', 'Equality check', 'Strict equality check', 'Not equal'],
        correctAnswer: 2,
        points: 10,
        category: 'Operators'
      },
      {
        id: 'q4',
        question: 'How do you create a function in JavaScript?',
        options: ['function myFunction() {}', 'create myFunction() {}', 'def myFunction() {}', 'func myFunction() {}'],
        correctAnswer: 0,
        points: 10,
        category: 'Functions'
      },
      {
        id: 'q5',
        question: 'What is the output of: console.log(typeof null)?',
        options: ['null', 'undefined', 'object', 'boolean'],
        correctAnswer: 2,
        points: 10,
        category: 'Data Types'
      }
    ]
  },
  {
    id: '2',
    title: 'React Concepts',
    description: 'Evaluate your understanding of React components, hooks, and state management.',
    duration: 3,
    totalPoints: 150,
    passingScore: 75,
    isActive: true,
    createdAt: '2024-01-20',
    createdBy: 'admin',
    questions: [
      {
        id: 'q6',
        question: 'What is JSX?',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
        correctAnswer: 0,
        points: 15,
        category: 'JSX'
      },
      {
        id: 'q7',
        question: 'Which hook is used for state management in functional components?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 1,
        points: 15,
        category: 'Hooks'
      },
      {
        id: 'q8',
        question: 'What is the virtual DOM?',
        options: ['A copy of the real DOM', 'A JavaScript representation of the DOM', 'A faster version of DOM', 'All of the above'],
        correctAnswer: 3,
        points: 15,
        category: 'Virtual DOM'
      }
    ]
  }
];

export const useExamData = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  useEffect(() => {
    // Load data from localStorage
    const savedExams = localStorage.getItem('exams');
    const savedAttempts = localStorage.getItem('examAttempts');
    const savedStudent = localStorage.getItem('currentStudent');

    if (savedExams) {
      setExams(JSON.parse(savedExams));
    } else {
      setExams(mockExams);
      localStorage.setItem('exams', JSON.stringify(mockExams));
    }

    if (savedAttempts) {
      setAttempts(JSON.parse(savedAttempts));
    }

    if (savedStudent) {
      setCurrentStudent(JSON.parse(savedStudent));
    }
  }, []);

  const loginStudent = (name: string, email: string) => {
    const student: Student = {
      id: Date.now().toString(),
      name,
      email,
      role: 'student',
      attempts: []
    };
    setCurrentStudent(student);
    localStorage.setItem('currentStudent', JSON.stringify(student));
  };

  const submitExamAttempt = (attempt: ExamAttempt) => {
    const newAttempts = [...attempts, attempt];
    setAttempts(newAttempts);
    localStorage.setItem('examAttempts', JSON.stringify(newAttempts));

    if (currentStudent) {
      const updatedStudent = {
        ...currentStudent,
        attempts: [...currentStudent.attempts, attempt]
      };
      setCurrentStudent(updatedStudent);
      localStorage.setItem('currentStudent', JSON.stringify(updatedStudent));
    }
  };

  const getExamById = (id: string): Exam | undefined => {
    return exams.find(exam => exam.id === id);
  };

  const getStudentAttempts = (studentId: string): ExamAttempt[] => {
    return attempts.filter(attempt => attempt.studentId === studentId);
  };

  const calculateScore = (exam: Exam, answers: { [questionId: string]: number }): { score: number; percentage: number } => {
    let score = 0;
    exam.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score += question.points;
      }
    });
    const percentage = (score / exam.totalPoints) * 100;
    return { score, percentage };
  };

  return {
    exams,
    attempts,
    currentStudent,
    loginStudent,
    submitExamAttempt,
    getExamById,
    getStudentAttempts,
    calculateScore
  };
};