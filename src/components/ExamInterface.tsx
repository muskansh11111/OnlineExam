import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle } from 'lucide-react';
import { Exam, ExamAttempt } from '../types/exam';
import { useTimer } from '../hooks/useTimer';

interface ExamInterfaceProps {
  exam: Exam;
  studentId: string;
  studentName: string;
  onSubmit: (attempt: ExamAttempt) => void;
  onExit: () => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ 
  exam, 
  studentId, 
  studentName, 
  onSubmit, 
  onExit 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const startTime = useState(() => new Date().toISOString())[0];

  const { timeRemaining, formatTime, start } = useTimer(
    exam.duration * 60,
    () => handleSubmit()
  );

  useEffect(() => {
    start();
  }, [start]);

  const currentQuestion = exam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const calculateScore = () => {
    let score = 0;
    exam.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score += question.points;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const percentage = (score / exam.totalPoints) * 100;
    const timeSpent = (exam.duration * 60) - timeRemaining;

    const attempt: ExamAttempt = {
      id: Date.now().toString(),
      examId: exam.id,
      studentId,
      studentName,
      answers,
      score,
      percentage,
      timeSpent,
      startTime,
      endTime: new Date().toISOString(),
      passed: percentage >= exam.passingScore
    };

    onSubmit(attempt);
  };

  const getQuestionStatus = (questionId: string, index: number) => {
    const isAnswered = answers[questionId] !== undefined;
    const isCurrent = index === currentQuestionIndex;
    const isFlagged = flaggedQuestions.has(questionId);

    if (isCurrent) return 'bg-blue-600 text-white';
    if (isAnswered) return 'bg-green-500 text-white';
    if (isFlagged) return 'bg-yellow-500 text-white';
    return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-red-100 text-red-700 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-mono font-semibold">{formatTime}</span>
            </div>
            <button
              onClick={onExit}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{answeredCount}/{exam.questions.length} answered</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex-1">
                  {currentQuestion.question}
                </h2>
                <button
                  onClick={toggleFlag}
                  className={`ml-4 p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion.id)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Points: {currentQuestion.points} | Category: {currentQuestion.category}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    answers[currentQuestion.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={index}
                      checked={answers[currentQuestion.id] === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="mr-3 text-blue-600"
                    />
                    <span className="text-gray-800">{option}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isFirstQuestion
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <div className="flex space-x-2">
                {isLastQuestion ? (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
            <h3 className="font-semibold text-gray-800 mb-4">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((question, index) => (
                <button
                  key={question.id}
                  onClick={() => handleQuestionJump(index)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${getQuestionStatus(question.id, index)}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                <span>Flagged</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-200 rounded mr-2"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Submit Exam?</h3>
            <p className="text-gray-600 mb-4">
              You have answered {answeredCount} out of {exam.questions.length} questions.
              {answeredCount < exam.questions.length && (
                <span className="text-red-600 block mt-2">
                  Warning: {exam.questions.length - answeredCount} questions remain unanswered.
                </span>
              )}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamInterface;