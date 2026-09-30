'use client'

import { LucideIcon } from 'lucide-react'

interface ActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  bgColor: string
  iconColor: string
  onClick: () => void
}

export default function ActionCard({
  title,
  description,
  icon: Icon,
  bgColor,
  iconColor,
  onClick
}: ActionCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-zoom-border p-4 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group min-h-[160px] sm:min-h-[180px]"
    >
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 h-full justify-center">
        <div className={`w-12 h-12 sm:w-16 sm:h-16 ${bgColor} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-zoom-text mb-1">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-tight">{description}</p>
        </div>
      </div>
    </div>
  )
}