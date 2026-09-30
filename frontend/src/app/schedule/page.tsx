'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ChevronLeft, 
  Plus, 
  ChevronDown,
  ExternalLink,
  AlertTriangle
} from 'lucide-react'

export default function ScheduleMeeting() {
  const [topic, setTopic] = useState('My Meeting')
  const [description, setDescription] = useState('')
  const [showDescription, setShowDescription] = useState(false)
  const [date, setDate] = useState(() => {
    // Default to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [time, setTime] = useState('3:00')
  const [amPm, setAmPm] = useState('PM')
  const [duration, setDuration] = useState('1')
  const [durationUnit, setDurationUnit] = useState('hr')
  const [minutes, setMinutes] = useState('0')
  const [timezone, setTimezone] = useState('GMT-7:00 Pacific Time (US and Canada)')
  const [isRecurring, setIsRecurring] = useState(false)
  const [invitees, setInvitees] = useState('')
  const router = useRouter()

  const handleSchedule = async () => {
    console.log('Schedule button clicked')
    console.log('Topic:', topic, 'Date:', date, 'Time:', time, 'AM/PM:', amPm)
    
    if (!topic.trim() || !date || !time) {
      alert('Please fill in the required fields (topic, date, time)')
      return
    }

    try {
      // Convert to ISO datetime
      let timeIn24 = time
      
      if (time.includes(':')) {
        const [hourStr, minuteStr] = time.split(':')
        let hour = parseInt(hourStr)
        const minute = minuteStr || '00'
        
        if (amPm === 'PM' && hour !== 12) {
          hour += 12
        } else if (amPm === 'AM' && hour === 12) {
          hour = 0
        }
        
        timeIn24 = `${hour.toString().padStart(2, '0')}:${minute}`
      }

      const scheduledDateTime = new Date(`${date}T${timeIn24}:00`)
      const totalDuration = parseInt(duration) * 60 + parseInt(minutes)

      console.log('Scheduled DateTime:', scheduledDateTime.toISOString())
      console.log('Total Duration:', totalDuration)

      const requestBody = {
        title: topic,
        description: description || '',
        scheduled_time: scheduledDateTime.toISOString(),
        duration: totalDuration
      }

      console.log('Request body:', requestBody)

      const response = await fetch(`http://127.0.0.1:8001/meetings/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Success result:', result)
        alert('Meeting scheduled successfully!')
        
        // Optional: Trigger a refresh of the main page data
        try {
          // This will help refresh the dashboard when user returns
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'MEETING_SCHEDULED' }, window.location.origin)
          }
        } catch (e) {
          console.log('Could not notify parent window')
        }
        
        router.push('/')
      } else {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        alert(`Failed to schedule meeting: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to schedule meeting:', error)
      alert(`Network error: ${error.message}`)
    }
  }

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Same as join page */}
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
              <a href="/join" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                Join
              </a>
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  Host
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  Web App
                  <ChevronDown className="w-4 h-4 ml-1" />
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

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Home</h2>
            
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 mb-2">My Products</div>
              
              <div className="flex items-center justify-between py-2 px-3 text-sm text-blue-600 bg-blue-50 rounded">
                <span>AI</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">New</span>
              </div>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Meetings</span>
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Recordings</span>
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Summaries</span>
              </a>
              
              <div className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Hub</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">New</span>
              </div>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Whiteboards</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Notes</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Clips</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Canvas</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Paper</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Sheets</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Slides</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Tasks</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 rounded">
                <span>Scheduler</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              
              <a href="#" className="flex items-center justify-between py-2 px-3 text-sm text-blue-600 hover:bg-blue-50 rounded">
                <span>Discover More Products</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Back to Meetings */}
          <div className="mb-6">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Meetings
            </button>
          </div>

          {/* Schedule Meeting Form */}
          <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Schedule Meeting</h1>

            <div className="space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {!showDescription ? (
                  <button
                    onClick={() => setShowDescription(true)}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Description
                  </button>
                ) : (
                  <div className="mt-3">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add meeting description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* When */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When
                </label>
                <div className="flex space-x-3">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1:00">1:00</option>
                    <option value="2:00">2:00</option>
                    <option value="3:00">3:00</option>
                    <option value="4:00">4:00</option>
                    <option value="5:00">5:00</option>
                    <option value="6:00">6:00</option>
                    <option value="7:00">7:00</option>
                    <option value="8:00">8:00</option>
                    <option value="9:00">9:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                  </select>
                  <select
                    value={amPm}
                    onChange={(e) => setAmPm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="flex items-center space-x-3">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  <span className="text-sm text-gray-600">hr</span>
                  <select
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0">0</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                  <span className="text-sm text-gray-600">min</span>
                </div>
                
                {/* Duration Warning */}
                <div className="flex items-start mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    You can schedule meetings for up to 40 minutes each with your current Basic plan. Need more time?{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Upgrade to Zoom Workplace Pro
                    </a>
                  </div>
                </div>
              </div>

              {/* Time Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="GMT-7:00 Pacific Time (US and Canada)">
                    (GMT-7:00) Pacific Time (US and Canada)
                  </option>
                  <option value="GMT-8:00 Pacific Standard Time">
                    (GMT-8:00) Pacific Standard Time
                  </option>
                  <option value="GMT-5:00 Eastern Time">
                    (GMT-5:00) Eastern Time (US and Canada)
                  </option>
                  <option value="GMT+0:00 Greenwich Mean Time">
                    (GMT+0:00) Greenwich Mean Time
                  </option>
                </select>
              </div>

              {/* Recurring Meeting */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Recurring meeting</span>
                </label>
              </div>

              {/* Invitees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invitees
                </label>
                <textarea
                  value={invitees}
                  onChange={(e) => setInvitees(e.target.value)}
                  placeholder="Enter user names or email addresses"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {/* Invitees Warning */}
                <div className="flex items-start mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    Participants won't receive this meeting invite until your calendar is connected.{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700">Connect calendar</a>
                  </div>
                </div>
              </div>

              {/* Meeting ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Meeting ID
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="meetingId"
                      defaultChecked
                      className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Generate Automatically</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="meetingId"
                      className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Personal Meeting ID 787 946 6584</span>
                  </label>
                </div>
              </div>

              {/* Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Select a template</option>
                </select>
              </div>

              {/* Whiteboard */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Whiteboard
                </label>
                <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Whiteboard
                </button>
              </div>

              {/* Docs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Docs
                </label>
                <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Docs
                </button>
              </div>

              {/* Security */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Security
                </label>
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <div className="ml-2">
                      <div className="text-sm text-gray-700">Passcode</div>
                      <div className="text-xs text-gray-500">Only users who have the invite link or passcode can join the meeting</div>
                    </div>
                  </label>
                  <input
                    type="text"
                    placeholder="681030"
                    className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <div className="ml-2">
                      <div className="text-sm text-gray-700">Waiting Room</div>
                      <div className="text-xs text-gray-500">Only users admitted by the host can join the meeting</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  onClick={handleSchedule}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Schedule
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}