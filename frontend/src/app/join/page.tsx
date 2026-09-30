'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function JoinMeeting() {
  const [meetingInput, setMeetingInput] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const router = useRouter()

  const handleJoinMeeting = async () => {
    if (!meetingInput.trim()) {
      alert('Please enter a Meeting ID or Personal Link Name')
      return
    }

    if (!displayName.trim() && showNameInput) {
      alert('Please enter your name')
      return
    }

    // Extract meeting ID from input (handle both direct ID and links)
    let meetingId = meetingInput.trim()
    
    // If it's a URL, extract the meeting ID
    if (meetingId.includes('/')) {
      const parts = meetingId.split('/')
      meetingId = parts[parts.length - 1]
    }

    try {
      // Validate meeting exists
      const response = await fetch(`http://127.0.0.1:8001/meetings/${meetingId}`)
      if (response.ok) {
        // If we haven't asked for display name yet, ask for it
        if (!showNameInput) {
          setShowNameInput(true)
          return
        }
        
        // Redirect to meeting room with display name
        const finalDisplayName = displayName.trim() || 'Anonymous User'
        window.location.href = `/meeting/${meetingId}?name=${encodeURIComponent(finalDisplayName)}`
      } else if (response.status === 404) {
        alert('Meeting not found. Please check the Meeting ID.')
      } else {
        alert('Failed to validate meeting')
      }
    } catch (error) {
      console.error('Failed to join meeting:', error)
      alert('Failed to join meeting')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinMeeting()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Zoom Logo */}
            <div className="flex items-center">
              <Image
                src="/images/Zoom-logo.svg"
                alt="Zoom"
                width={120}
                height={30}
                priority
                className="h-[30px] w-auto"
              />
            </div>

            {/* Right: Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Support
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Schedule
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Join
              </a>
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  Host
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  Web App
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Profile */}
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                S
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-normal text-gray-900 mb-8">
              Join Meeting
            </h1>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Meeting ID Input */}
            <div>
              <label htmlFor="meetingId" className="block text-sm text-gray-600 mb-2">
                Meeting ID or Personal Link Name
              </label>
              <input
                id="meetingId"
                type="text"
                value={meetingInput}
                onChange={(e) => setMeetingInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Meeting ID or Personal Link Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                autoFocus
              />
            </div>

            {/* Display Name Input (appears after meeting validation) */}
            {showNameInput && (
              <div className="animate-fadeIn">
                <label htmlFor="displayName" className="block text-sm text-gray-600 mb-2">
                  Your Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />
              </div>
            )}

            {/* Join Button */}
            <button
              onClick={handleJoinMeeting}
              disabled={!meetingInput.trim()}
              className={`w-full py-3 px-4 rounded-md text-base font-medium transition-colors ${
                meetingInput.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {showNameInput ? 'Join' : 'Join'}
            </button>

            {/* Additional Link */}
            <div className="text-center">
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
              >
                Join a meeting from an H.323/SIP room system
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="mb-4 md:mb-0">
              © 2026 Zoom Communications, Inc. All rights reserved.{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Privacy & Legal Policies
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span>English</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}