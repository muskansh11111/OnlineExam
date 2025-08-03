import React from 'react';
import { ArrowLeft, Trophy, Clock, Calendar, TrendingUp } from 'lucide-react';
import { ExamAttempt, Student } from '../types/exam';
import { format } from 'date-fns';

interface ResultHistoryProps {
  student: Student;
  attempts: ExamAttempt[];
  onBack: () => void;
  onViewResult: (attempt: ExamAttempt) => void;
}

const ResultHistory: React.FC<ResultHistoryProps> = ({ 
  student, 
  attempts, 
  onBack, 
  onViewResult 
}) => {
  const sortedAttempts = [...attempts].sort((a, b) => 
    new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
  );

  const stats = {
    totalAttempts: attempts.length,
    passedAttempts: attempts.filter(a => a.passed).length,
    averageScore: attempts.length > 0 
      ? attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length 
      : 0,
    bestScore: attempts.length > 0 
      ? Math.max(...attempts.map(a => a.percentage)) 
      : 0
  };

  const getGradeColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Results</h1>
          <p className="text-gray-600">Track your exam performance and progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="font-semibold text-gray-700">Total Attempts</h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalAttempts}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-2">
              <Trophy className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="font-semibold text-gray-700">Passed</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.passedAttempts}</p>
            <p className="text-sm text-gray-600">
              {stats.totalAttempts > 0 ? Math.round((stats.passedAttempts / stats.totalAttempts) * 100) : 0}% success rate
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className="font-semibold text-gray-700">Average Score</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.averageScore.toFixed(1)}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-2">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="font-semibold text-gray-700">Best Score</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.bestScore.toFixed(1)}%</p>
          </div>
        </div>

        {/* Results List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Exam History</h2>
          </div>

          {sortedAttempts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {sortedAttempts.map((attempt) => (
                <div key={attempt.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-gray-800">
                          Exam ID: {attempt.examId}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          attempt.passed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {attempt.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(attempt.endTime), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(attempt.timeSpent)}
                        </div>
                        <div className={`font-semibold ${getGradeColor(attempt.percentage)}`}>
                          {attempt.percentage.toFixed(1)}% ({attempt.score} pts)
                        </div>
                        <div>
                          {format(new Date(attempt.endTime), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onViewResult(attempt)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Exam Results</h3>
              <p className="text-gray-500">You haven't taken any exams yet. Start with your first exam!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultHistory;