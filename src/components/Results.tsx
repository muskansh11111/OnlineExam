import React from 'react';
import { Trophy, Clock, Target, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { ExamAttempt, Exam } from '../types/exam';

interface ResultsProps {
  attempt: ExamAttempt;
  exam: Exam;
  onBack: () => void;
}

const Results: React.FC<ResultsProps> = ({ attempt, exam, onBack }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getGrade = (percentage: number): { grade: string; color: string } => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const { grade, color } = getGrade(attempt.percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </button>

        {/* Result Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              attempt.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {attempt.passed ? (
                <Trophy className="w-10 h-10 text-green-600" />
              ) : (
                <Target className="w-10 h-10 text-red-600" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {attempt.passed ? 'Congratulations!' : 'Keep Trying!'}
            </h1>
            
            <p className="text-gray-600 mb-4">
              {attempt.passed 
                ? 'You have successfully passed the exam!' 
                : 'You can retake the exam to improve your score.'}
            </p>

            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className={`text-4xl font-bold ${color}`}>{grade}</div>
                <div className="text-sm text-gray-600">Grade</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800">{attempt.percentage.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800">{attempt.score}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-3">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Time Spent</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatTime(attempt.timeSpent)}</p>
            <p className="text-sm text-gray-600">out of {exam.duration} minutes</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-3">
              <Target className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Correct Answers</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {Object.entries(attempt.answers).filter(([questionId, answer]) => {
                const question = exam.questions.find(q => q.id === questionId);
                return question && question.correctAnswer === answer;
              }).length}
            </p>
            <p className="text-sm text-gray-600">out of {exam.questions.length} questions</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-3">
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="font-semibold text-gray-800">Passing Score</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800">{exam.passingScore}%</p>
            <p className={`text-sm ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
              {attempt.passed ? 'Achieved' : 'Not Achieved'}
            </p>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Question Review</h2>
          
          <div className="space-y-6">
            {exam.questions.map((question, index) => {
              const userAnswer = attempt.answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-800 flex-1">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="ml-4">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Your Answer:</p>
                      <p className={`text-sm p-2 rounded ${
                        userAnswer !== undefined 
                          ? isCorrect 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {userAnswer !== undefined 
                          ? question.options[userAnswer] 
                          : 'Not answered'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Correct Answer:</p>
                      <p className="text-sm p-2 rounded bg-green-100 text-green-800">
                        {question.options[question.correctAnswer]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    Points: {question.points} | Category: {question.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;