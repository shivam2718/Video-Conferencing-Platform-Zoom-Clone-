'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Users, 
  MessageSquare, 
  Share, 
  Settings,
  Copy,
  ExternalLink,
  ChevronDown
} from 'lucide-react'

interface Meeting {
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

interface Participant {
  id: number
  name: string
  joined_at: string
  is_host: boolean
}

export default function MeetingRoom() {
  const params = useParams()
  const searchParams = useSearchParams()
  const meetingId = params.meetingId as string
  const userName = searchParams.get('name') || 'Anonymous User'

  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isInMeeting, setIsInMeeting] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    if (meetingId) {
      fetchMeetingDetails()
    }
  }, [meetingId])

  const fetchMeetingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8001/meetings/${meetingId}`)
      if (response.ok) {
        const data = await response.json()
        setMeeting(data)
      } else if (response.status === 404) {
        alert('Meeting not found')
        window.close()
      }
    } catch (error) {
      console.error('Failed to fetch meeting details:', error)
    }
  }

  const joinMeeting = async () => {
    try {
      const response = await fetch(`http://localhost:8001/meetings/${meetingId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          display_name: userName
        })
      })

      if (response.ok) {
        setIsInMeeting(true)
        // In a real implementation, you would initialize WebRTC here
        // For now, we'll simulate being in a meeting
        setParticipants([
          {
            id: 1,
            name: userName,
            joined_at: new Date().toISOString(),
            is_host: false
          }
        ])
      } else {
        alert('Failed to join meeting')
      }
    } catch (error) {
      console.error('Failed to join meeting:', error)
      alert('Failed to join meeting')
    }
  }

  const leaveMeeting = () => {
    setIsInMeeting(false)
    window.close()
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    // In a real implementation, you would control the microphone here
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    // In a real implementation, you would control the camera here
  }

  const copyMeetingId = () => {
    navigator.clipboard.writeText(meetingId)
    alert('Meeting ID copied to clipboard!')
  }

  const copyInviteLink = () => {
    if (meeting?.invite_link) {
      navigator.clipboard.writeText(meeting.invite_link)
      alert('Invite link copied to clipboard!')
    }
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading meeting...</p>
        </div>
      </div>
    )
  }

  if (!isInMeeting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-4 sm:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              {meeting.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Host: {meeting.host_name}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Meeting ID: <span className="font-mono">{meetingId}</span>
            </p>
          </div>

          {/* Preview Section */}
          <div className="mb-6">
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-white text-center">
                <Video className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm opacity-75">Camera Preview</p>
              </div>
            </div>

            {/* Audio/Video Controls */}
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full ${
                  isAudioEnabled
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {isAudioEnabled ? (
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${
                  isVideoEnabled
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {isVideoEnabled ? (
                  <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={joinMeeting}
              className="w-full bg-zoom-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-zoom-hover transition-colors duration-200 text-sm sm:text-base"
            >
              Join Meeting
            </button>
            
            <button
              onClick={() => window.close()}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-3">Share this meeting:</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={copyMeetingId}
                className="flex items-center justify-center space-x-1 px-3 py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <Copy className="w-4 h-4" />
                <span>Copy ID</span>
              </button>
              <button
                onClick={copyInviteLink}
                className="flex items-center justify-center space-x-1 px-3 py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 text-white px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <h1 className="font-semibold text-sm sm:text-base truncate">{meeting.title}</h1>
            <span className="text-xs sm:text-sm text-gray-300 whitespace-nowrap">
              ID: {meetingId}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm text-gray-300 whitespace-nowrap">
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Video Grid */}
        <div className="flex-1 p-2 sm:p-4">
          <div className="h-full bg-gray-800 rounded-lg flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
            <div className="text-white text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-zoom-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg sm:text-2xl font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-base sm:text-lg font-medium">{userName}</p>
              <p className="text-xs sm:text-sm text-gray-400">You</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {showParticipants && (
          <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col max-h-96 lg:max-h-none">
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                Participants ({participants.length})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {participants.map((participant) => (
                <div key={participant.id} className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-zoom-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-medium">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {participant.name}
                        {participant.is_host && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Host
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-800 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 sm:p-3 rounded-full ${
              isAudioEnabled
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-red-600 text-white hover:bg-red-700'
            } transition-colors duration-200`}
          >
            {isAudioEnabled ? (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-2 sm:p-3 rounded-full ${
              isVideoEnabled
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-red-600 text-white hover:bg-red-700'
            } transition-colors duration-200`}
          >
            {isVideoEnabled ? (
              <Video className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Share Screen - hidden on small screens */}
          <button className="hidden sm:flex p-2 sm:p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200">
            <Share className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Participants */}
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-2 sm:p-3 rounded-full ${
              showParticipants
                ? 'bg-zoom-blue text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            } transition-colors duration-200`}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Chat - hidden on small screens */}
          <button className="hidden sm:flex p-2 sm:p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Leave Meeting */}
          <button
            onClick={leaveMeeting}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 ml-2 sm:ml-4 text-xs sm:text-sm"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  )
}