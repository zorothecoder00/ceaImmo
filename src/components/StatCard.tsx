import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color?: 'blue' | 'green' | 'purple' | 'orange'| 'yellow'
  trend?: string
}

export default function StatCard({
  title,
  value,
  subtitle = '',
  icon: Icon,
  color = 'blue',
  trend,
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {(subtitle || trend) && (
            <div className="flex items-center mt-1">
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
              {trend && (
                <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  {trend}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-lg ${
            colorClasses[color as keyof typeof colorClasses] ?? ''
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
