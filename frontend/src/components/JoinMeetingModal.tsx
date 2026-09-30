'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface JoinMeetingModalProps {
  isOpen: boolean
  onClose: () => void
  onJoin: (meetingId: string, displayName: string) => void
}

export default function JoinMeetingModal({ isOpen, onClose, onJoin }: JoinMeetingModalProps) {
  const [meetingId, setMeetingId] = useState('')
  const [displayName, setDisplayName] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (meetingId.trim() && displayName.trim()) {
      onJoin(meetingId.trim(), displayName.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-zoom-text">Join Meeting</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="meetingId" className="block text-sm font-medium text-gray-700 mb-2">
              Meeting ID
            </label>
            <input
              type="text"
              id="meetingId"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter meeting ID (e.g., ABC12345)"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zoom-blue focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zoom-blue focus:border-transparent"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-zoom-blue text-white rounded-md hover:bg-zoom-hover transition-colors duration-200 text-sm sm:text-base"
            >
              Join Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}