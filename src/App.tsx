//import React, { useState } from 'react';
import { useState } from 'react';

import Login from './components/Login';
import ExamList from './components/ExamList';
import ExamInterface from './components/ExamInterface';
import Results from './components/Results';
import ResultHistory from './components/ResultHistory';
import { useExamData } from './hooks/useExamData';
import { ExamAttempt } from './types/exam';

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'examList' | 'exam' | 'results' | 'history'>('login');
  const [currentExamId, setCurrentExamId] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<ExamAttempt | null>(null);
  
  const { 
    exams, 
    currentStudent, 
    loginStudent, 
    submitExamAttempt, 
    getExamById, 
    getStudentAttempts 
  } = useExamData();

  const handleLogin = (name: string, email: string) => {
    loginStudent(name, email);
    setCurrentView('examList');
  };

  const handleStartExam = (examId: string) => {
    setCurrentExamId(examId);
    setCurrentView('exam');
  };

  const handleExamSubmit = (attempt: ExamAttempt) => {
    submitExamAttempt(attempt);
    setCurrentResult(attempt);
    setCurrentView('results');
  };

  const handleViewResults = () => {
    setCurrentView('history');
  };

  const handleViewResult = (attempt: ExamAttempt) => {
    setCurrentResult(attempt);
    setCurrentView('results');
  };

  const handleBackToExams = () => {
    setCurrentView('examList');
    setCurrentExamId(null);
    setCurrentResult(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      
      case 'examList':
        return (
          <ExamList 
            exams={exams}
            onStartExam={handleStartExam}
            onViewResults={handleViewResults}
          />
        );
      
      case 'exam':
        if (!currentExamId || !currentStudent) return null;
        const exam = getExamById(currentExamId);
        if (!exam) return null;
        
        return (
          <ExamInterface
            exam={exam}
            studentId={currentStudent.id}
            studentName={currentStudent.name}
            onSubmit={handleExamSubmit}
            onExit={handleBackToExams}
          />
        );
      
      case 'results':
        if (!currentResult) return null;
        const resultExam = getExamById(currentResult.examId);
        if (!resultExam) return null;
        
        return (
          <Results
            attempt={currentResult}
            exam={resultExam}
            onBack={handleBackToExams}
          />
        );
      
      case 'history':
        if (!currentStudent) return null;
        const studentAttempts = getStudentAttempts(currentStudent.id);
        
        return (
          <ResultHistory
            student={currentStudent}
            attempts={studentAttempts}
            onBack={handleBackToExams}
            onViewResult={handleViewResult}
          />
        );
      
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderView()}
    </div>
  );
}

export default App;