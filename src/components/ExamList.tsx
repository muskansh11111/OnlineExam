import React from 'react';
import { Clock, FileText, Award, Play, BarChart3 } from 'lucide-react';
import { Exam } from '../types/exam';

interface ExamListProps {
  exams: Exam[];
  onStartExam: (examId: string) => void;
  onViewResults: () => void;
}

const ExamList: React.FC<ExamListProps> = ({ exams, onStartExam, onViewResults }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Available Exams</h1>
          <p className="text-gray-600">Choose an exam to begin your assessment</p>
        </div>

        <div className="mb-6">
          <button
            onClick={onViewResults}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            View My Results
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.filter(exam => exam.isActive).map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{exam.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{exam.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{exam.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2 text-green-500" />
                  <span>{exam.questions.length} questions</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>{exam.totalPoints} points total</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Passing Score:</span>
                  <span className="font-semibold text-gray-800">{exam.passingScore}%</span>
                </div>
                <button
                  onClick={() => onStartExam(exam.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Exam
                </button>
              </div>
            </div>
          ))}
        </div>

        {exams.filter(exam => exam.isActive).length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Exams</h3>
            <p className="text-gray-500">There are currently no exams available. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamList;