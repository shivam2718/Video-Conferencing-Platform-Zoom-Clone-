'use client'

import { Calendar, Clock, Users, Copy, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

interface MeetingCardProps {
  meeting: {
    id: number
    meeting_id: string
    title: string
    host_name: string
    invite_link: string
    is_scheduled: boolean
    scheduled_time?: string
    duration: number
    created_at: string
  }
  type: 'upcoming' | 'recent'
}

export default function MeetingCard({ meeting, type }: MeetingCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return 'Invalid Date'
    }
  }

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'hh:mm a')
    } catch {
      return 'Invalid Time'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const joinMeeting = () => {
    window.open(`/meeting/${meeting.meeting_id}`, '_blank')
  }

  return (
    <div className="bg-white rounded-lg border border-zoom-border p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-zoom-text mb-1 truncate text-sm sm:text-base">{meeting.title}</h4>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">Host: {meeting.host_name}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-500">
            {meeting.is_scheduled && meeting.scheduled_time && (
              <>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{formatDate(meeting.scheduled_time)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{formatTime(meeting.scheduled_time)}</span>
                </div>
              </>
            )}
            {!meeting.is_scheduled && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{formatDate(meeting.created_at)}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{meeting.duration} min</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center ml-2">
          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
            {meeting.meeting_id}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 border-t border-gray-100 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
          <button
            onClick={() => copyToClipboard(meeting.meeting_id)}
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 whitespace-nowrap"
          >
            <Copy className="w-3 h-3" />
            <span className="hidden sm:inline">Copy ID</span>
            <span className="sm:hidden">ID</span>
          </button>
          <button
            onClick={() => copyToClipboard(meeting.invite_link)}
            className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 whitespace-nowrap"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">Copy Link</span>
            <span className="sm:hidden">Link</span>
          </button>
        </div>

        {type === 'upcoming' && (
          <button
            onClick={joinMeeting}
            className="w-full sm:w-auto px-4 py-1.5 bg-zoom-blue text-white text-sm font-medium rounded-md hover:bg-zoom-hover transition-colors duration-200"
          >
            Join
          </button>
        )}
      </div>
    </div>
  )
}