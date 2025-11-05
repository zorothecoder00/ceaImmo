import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color?: string;
}

export default function StatCard({ title, value, icon: Icon, color = 'gray' }: StatCardProps) {
  return (
    <div className={`p-4 bg-white rounded-lg shadow flex items-center space-x-4 border-l-4 border-${color}-500`}>
      <div className={`p-2 rounded-full bg-${color}-100`}>
        <Icon className={`text-${color}-500 w-6 h-6`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
