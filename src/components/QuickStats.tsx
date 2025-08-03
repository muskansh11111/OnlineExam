import React from 'react';

interface QuickStatsProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
}

const QuickStats: React.FC<QuickStatsProps> = ({ icon, title, value, goal, unit, color }) => {
  const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const isGoalMet = value >= goal;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <div className={`text-sm font-medium ${isGoalMet ? 'text-green-600' : 'text-gray-500'}`}>
          {percentage.toFixed(0)}%
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-2xl font-bold text-gray-800">{value.toFixed(1)}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Goal: {goal} {unit}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isGoalMet ? 'bg-green-500' : color.replace('bg-', 'bg-')
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuickStats;