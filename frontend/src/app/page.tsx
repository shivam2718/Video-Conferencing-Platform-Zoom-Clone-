'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Video, 
  Plus, 
  Calendar, 
  Copy,
  Play,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'
import JoinMeetingModal from '@/components/JoinMeetingModal'
import Footer from '@/components/Footer'

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

export default function Dashboard() {
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([])
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarDropdownOpen, setIsSidebarDropdownOpen] = useState(false)

  useEffect(() => {
    fetchUpcomingMeetings()
    fetchRecentMeetings()
    
    // Listen for messages from child windows (like schedule page)
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data.type === 'MEETING_SCHEDULED') {
        console.log('Received meeting scheduled notification, refreshing data...')
        fetchUpcomingMeetings()
        fetchRecentMeetings()
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const fetchUpcomingMeetings = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001'
      const url = `${apiUrl}/meetings/upcoming`
      console.log('Making request to:', url)
      const response = await fetch(url)
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      if (response.ok) {
        const data = await response.json()
        console.log('Upcoming meetings:', data)
        setUpcomingMeetings(data)
      } else {
        console.error('Failed to fetch upcoming meetings:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('Error response body:', errorText)
      }
    } catch (error) {
      console.error('Failed to fetch upcoming meetings:', error)
      console.error('Error details:', error.name, error.message)
    }
  }

  const fetchRecentMeetings = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001'
      const url = `${apiUrl}/meetings/recent`
      console.log('Making request to:', url)
      const response = await fetch(url)
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Recent meetings:', data)
        setRecentMeetings(data)
      } else {
        console.error('Failed to fetch recent meetings:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('Error response body:', errorText)
      }
    } catch (error) {
      console.error('Failed to fetch recent meetings:', error)
      console.error('Error details:', error.name, error.message)
    }
  }

  const handleNewMeeting = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001'
      const response = await fetch(`${apiUrl}/meetings/instant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        const meeting = await response.json()
        window.open(`/meeting/${meeting.meeting_id}`, '_blank')
      } else {
        alert('Failed to create meeting')
      }
    } catch (error) {
      console.error('Failed to create meeting:', error)
      alert('Failed to create meeting')
    }
  }

  const handleJoinMeeting = async (meetingId: string, displayName: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001'
      const response = await fetch(`${apiUrl}/meetings/${meetingId}`)
      if (response.ok) {
        const joinResponse = await fetch(`${apiUrl}/meetings/${meetingId}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_name: displayName })
        })
        if (joinResponse.ok) {
          setShowJoinModal(false)
          window.open(`/meeting/${meetingId}?name=${encodeURIComponent(displayName)}`, '_blank')
        } else {
          alert('Failed to join meeting')
        }
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

  const copyMeetingId = () => {
    navigator.clipboard.writeText('787 940 6584')
    alert('Meeting ID copied to clipboard!')
  }

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ fontFamily: '"Almaden Sans", Helvetica, Arial, sans-serif' }}
    >
      {/* Skip to Main Content (accessibility - visible on focus) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-500 focus:text-white focus:px-3 focus:py-1 focus:rounded focus:text-sm focus:font-medium focus:border focus:border-white"
      >
        Skip to Main Content
      </a>

      {/* Sticky top: black utility bar + white header */}
      <div className="sticky top-0 z-30">
        {/* Top black utility bar - Hidden on mobile */}
        <div className="bg-[#0b0b0b] text-white text-[15px] font-normal hidden md:block">
          <div className="w-full px-4">
            <ul className="w-full flex items-center justify-end h-10 list-none m-0 p-0">
              {/* Search */}
              <li>
                <button
                  type="button"
                  aria-label="Search"
                  className="flex items-center gap-2 px-[5px] h-10 text-white hover:text-gray-300 transition-colors"
                >
                  <span aria-hidden="true" className="inline-flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      className="w-[20px] h-[25px] fill-current"
                    >
                      <g fill="currentColor">
                        <path d="m8.368 16.736c-4.614 0-8.368-3.754-8.368-8.368s3.754-8.368 8.368-8.368 8.368 3.754 8.368 8.368-3.754 8.368-8.368 8.368m0-14.161c-3.195 0-5.793 2.599-5.793 5.793s2.599 5.793 5.793 5.793 5.793-2.599 5.793-5.793-2.599-5.793-5.793-5.793"></path>
                        <path d="m18.713 20c-.329 0-.659-.126-.91-.377l-4.552-4.551c-.503-.503-.503-1.318 0-1.82.503-.503 1.318-.503 1.82 0l4.552 4.551c.503.503.503 1.318 0 1.82-.252.251-.581.377-.91.377"></path>
                      </g>
                    </svg>
                  </span>
                  <span>Search</span>
                </button>
              </li>

              {/* Support */}
              <li>
                <a
                  href="https://support.zoom.us/hc/en-us"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-[15px] h-10 text-white hover:text-gray-300 transition-colors"
                >
                  Support
                </a>
              </li>

              {/* Phone */}
              <li>
                <a
                  href="tel:0008000503335"
                  aria-label="Call 1-888-799-9666"
                  className="inline-flex items-center px-[15px] h-10 text-white hover:text-gray-300 transition-colors"
                >
                  0008000503335
                </a>
              </li>

              {/* Vertical divider */}
              <li role="none" className="flex items-center h-10">
                <span
                  className="h-[22px] inline-block"
                  style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.25)' }}
                />
              </li>

              {/* Contact Sales */}
              <li>
                <a
                  href="https://www.zoom.com/en/contact/contact-sales/"
                  className="inline-flex items-center px-[15px] h-10 text-white hover:text-gray-300 transition-colors"
                >
                  Contact Sales
                </a>
              </li>

              {/* Request a Demo */}
              <li>
                <a
                  href="https://www.zoom.com/en/contact/live-demo/"
                  className="inline-flex items-center px-[15px] h-10 text-white hover:text-gray-300 transition-colors"
                >
                  Request a Demo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* White main header bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="w-full px-2 lg:px-8">
            <div className="flex items-center justify-between h-[65.6px]">

              {/* Left: logo + primary nav */}
              <div className="flex items-center gap-16">
                <a href="/" className="flex items-center ml-2">
                  <Image
                    src="/images/zoom-logo.svg"
                    alt="Zoom"
                    width={120}
                    height={30}
                    priority
                    className="h-[30px] w-auto"
                  />
                </a>

                <nav className="hidden md:flex items-center gap-10">
                  {/* Products dropdown */}
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center text-[16px] font-normal text-[#666487] hover:text-[#0B5CFF] transition-colors h-[68px]"
                    >
                      Products
                      <svg
                        className="w-[10px] h-[10px] ml-2 mt-0.5"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 4L6 8L10 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Solutions dropdown */}
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center text-[17px] font-normal text-[#666487] hover:text-[#0B5CFF] transition-colors h-[68px]"
                    >
                      Solutions
                      <svg
                        className="w-[10px] h-[10px] ml-2 mt-0.5"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 4L6 8L10 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Resources dropdown */}
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center text-[17px] font-normal text-[#666487] hover:text-[#0B5CFF] transition-colors h-[68px]"
                    >
                      Resources
                      <svg
                        className="w-[10px] h-[10px] ml-2 mt-0.5"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 4L6 8L10 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Plans & Pricing — plain link, no chevron */}
                  <a
                    href="/pricing"
                    className="text-[17px] font-normal text-[#666487] hover:text-[#0B5CFF] transition-colors h-[68px] flex items-center"
                  >
                    Plans &amp; Pricing
                  </a>
                </nav>
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-8">

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>

                {/* Schedule */}
                <a
                  href="/schedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center text-[17px] font-normal text-[#666487] hover:text-[#0B5CFF] transition-colors h-[68px]"
                >
                  Schedule
                </a>

                {/* Join */}
                <a
                  href="/join"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center text-[17px] font-normal text-[#666487] hover:text-[#0B5CFF] transition-colors h-[68px]"
                >
                  Join
                </a>

                {/* Host dropdown */}
                <div className="relative group hidden md:block">
                  <button
                    type="button"
                    className="flex items-center text-[17px] font-normal text-[#666487] hover:text-[#0B5CFF] transition-colors h-[68px]"
                  >
                    Host
                    <svg
                      className="w-[10px] h-[10px] ml-2 mt-0.5"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 4L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <ul className="absolute right-0 top-full mt-0 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <li>
                      <a href="/start/webmeeting" className="block px-4 py-2 text-[14px] text-[#0D213F] hover:bg-gray-50 hover:text-[#0B5CFF]">
                        With Video Off
                      </a>
                    </li>
                    <li>
                      <a href="/start/videomeeting" className="block px-4 py-2 text-[14px] text-[#0D213F] hover:bg-gray-50 hover:text-[#0B5CFF]">
                        With Video On
                      </a>
                    </li>
                    <li>
                      <a href="/start/sharemeeting" className="block px-4 py-2 text-[14px] text-[#0D213F] hover:bg-gray-50 hover:text-[#0B5CFF]">
                        Screen Share Only
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Web App dropdown */}
                <div className="relative group hidden md:block">
                  <button
                    type="button"
                    className="flex items-center text-[17px] font-normal text-[#666487] hover:text-[#0B5CFF] transition-colors h-[68px]"
                  >
                    Web App
                    <svg
                      className="w-[10px] h-[10px] ml-2 mt-0.5"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 4L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <ul className="absolute right-0 top-full mt-0 min-w-[190px] bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                    <li>
                      <a href="#" className="group/item flex items-center gap-3 px-4 py-[7px] text-[14px] text-[#0D213F] hover:text-[#0B5CFF] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 text-[#0D213F] group-hover/item:text-[#0B5CFF]">
                          <path d="M3 10 L12 3 L21 10 V20 a1 1 0 0 1 -1 1 H4 a1 1 0 0 1 -1 -1 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                          <path d="M9 21 V13 H15 V21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                        </svg>
                        <span>Home</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="group/item flex items-center gap-3 px-4 py-[7px] text-[14px] text-[#0D213F] hover:text-[#0B5CFF] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 text-[#0D213F] group-hover/item:text-[#0B5CFF]">
                          <path d="M21 12 a8 8 0 0 1 -8 8 H7 l-4 3 V12 a8 8 0 0 1 8 -8 h2 a8 8 0 0 1 8 8 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                        </svg>
                        <span>Chat</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="group/item flex items-center gap-3 px-4 py-[7px] text-[14px] text-[#0D213F] hover:text-[#0B5CFF] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 text-[#0D213F] group-hover/item:text-[#0B5CFF]">
                          <path
                            d="M22 16.9 v3 a2 2 0 0 1 -2.2 2 a19.8 19.8 0 0 1 -8.6 -3.1 a19.5 19.5 0 0 1 -6 -6 a19.8 19.8 0 0 1 -3.1 -8.7 A2 2 0 0 1 4.1 2 h3 a2 2 0 0 1 2 1.7 c.1.9 .3 1.8 .5 2.7 a2 2 0 0 1 -.5 2.1 L8 9.6 a16 16 0 0 0 6 6 l1.1 -1.1 a2 2 0 0 1 2.1 -.5 c.9 .2 1.8 .4 2.7 .5 a2 2 0 0 1 1.7 2 Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>Phone</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="group/item flex items-center gap-3 px-4 py-[7px] text-[14px] text-[#0D213F] hover:text-[#0B5CFF] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 text-[#0D213F] group-hover/item:text-[#0B5CFF]">
                          <rect x="2" y="6" width="14" height="12" rx="2" fill="currentColor" />
                          <path d="M22 8 L16 12 L22 16 Z" fill="currentColor" />
                        </svg>
                        <span>Meetings</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="group/item flex items-center gap-3 px-4 py-[7px] text-[14px] text-[#0D213F] hover:text-[#0B5CFF] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 text-[#0D213F] group-hover/item:text-[#0B5CFF]">
                          <path
                            d="M12 15.5 a3.5 3.5 0 1 0 0 -7 a3.5 3.5 0 0 0 0 7 Z M19.4 15 a1.7 1.7 0 0 0 .3 1.8 l .1 .1 a2 2 0 0 1 -2.8 2.8 l -.1 -.1 a1.7 1.7 0 0 0 -2.9 1.2 V21 a2 2 0 0 1 -4 0 v -.2 a1.7 1.7 0 0 0 -2.9 -1.2 l -.1 .1 a2 2 0 0 1 -2.8 -2.8 l .1 -.1 A1.7 1.7 0 0 0 3 15 a2 2 0 0 1 0 -4 a1.7 1.7 0 0 0 1.4 -1 a1.7 1.7 0 0 0 -.3 -1.8 l -.1 -.1 a2 2 0 0 1 2.8 -2.8 l .1 .1 A1.7 1.7 0 0 0 9.7 4.2 V4 a2 2 0 0 1 4 0 v .2 a1.7 1.7 0 0 0 2.9 1.2 l .1 -.1 a2 2 0 0 1 2.8 2.8 l -.1 .1 a1.7 1.7 0 0 0 -.3 1.8 a1.7 1.7 0 0 0 1.5 1 a2 2 0 0 1 0 4 a1.7 1.7 0 0 0 -1.4 1 Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>Hub</span>
                        <span className="ml-auto text-[10px] font-semibold text-[#0B5CFF] border border-[#0B5CFF] rounded-full px-[7px] py-[1px] leading-tight">NEW</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="group/item flex items-center gap-3 px-4 py-[7px] text-[14px] text-[#0D213F] hover:text-[#0B5CFF] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 text-[#0D213F] group-hover/item:text-[#0B5CFF]">
                          <path d="M14 3 v5 h5 M19 21 H5 a2 2 0 0 1 -2 -2 V5 a2 2 0 0 1 2 -2 h10 l6 6 v10 a2 2 0 0 1 -2 2 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                          <path d="M8 13 H16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          <path d="M8 17 H13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <span>Canvas</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="group/item flex items-center gap-3 px-4 py-[7px] text-[14px] text-[#0D213F] hover:text-[#0B5CFF] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 text-[#0D213F] group-hover/item:text-[#0B5CFF]">
                          <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                          <circle cx="9" cy="11" r="2" fill="currentColor" />
                          <path d="M15 9 H19 M15 13 H19 M7 17 H17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <span>Contacts</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" className="group/item flex items-center gap-3 px-4 py-[7px] text-[14px] text-[#0D213F] hover:text-[#0B5CFF] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0 text-[#0D213F] group-hover/item:text-[#0B5CFF]">
                          <rect x="2" y="4" width="20" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                          <path d="M8 20 H16 M12 17 V20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <span>Whiteboards</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Avatar */}
                <button
                  type="button"
                  aria-label="Shivam Kumar, profile options"
                  className="w-9 h-9 ml-2 rounded-full overflow-hidden bg-purple-600 text-white flex items-center justify-center text-[14px] font-medium hover:ring-2 hover:ring-[#0B5CFF]/30 transition-all"
                >
                  S
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
              <nav className="px-4 py-4 space-y-2">
                <a href="#" className="block py-2 text-[#666487] hover:text-[#0B5CFF] transition-colors">Products</a>
                <a href="#" className="block py-2 text-[#666487] hover:text-[#0B5CFF] transition-colors">Solutions</a>
                <a href="#" className="block py-2 text-[#666487] hover:text-[#0B5CFF] transition-colors">Resources</a>
                <a href="#" className="block py-2 text-[#666487] hover:text-[#0B5CFF] transition-colors">Plans &amp; Pricing</a>
                <hr className="my-2" />
                <a href="/schedule" target="_blank" rel="noopener noreferrer" className="block py-2 text-[#666487] hover:text-[#0B5CFF] transition-colors">Schedule</a>
                <a href="/join" target="_blank" rel="noopener noreferrer" className="block py-2 text-[#666487] hover:text-[#0B5CFF] transition-colors">Join</a>
                <a href="#" className="block py-2 text-[#666487] hover:text-[#0B5CFF] transition-colors">Host</a>
                <a href="#" className="block py-2 text-[#666487] hover:text-[#0B5CFF] transition-colors">Web App</a>
              </nav>
            </div>
          )}
        </header>
      </div>

      {/* Body: Sidebar + Main */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left Sidebar - Mobile: Horizontal, Desktop: Vertical */}
        <aside className="w-full md:w-64 bg-white border-b md:border-r md:border-b-0 border-gray-200 flex-shrink-0">
          <div className="p-3">
            {/* Mobile: Only Home with dropdown */}
            <div className="md:hidden">
              <button
                onClick={() => setIsSidebarDropdownOpen(!isSidebarDropdownOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md"
              >
                Home
                <ChevronDown className={`w-4 h-4 transition-transform ${isSidebarDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSidebarDropdownOpen && (
                <div className="mt-2 bg-gray-50 rounded-md p-2 space-y-1">
                  <SidebarItem label="AI">
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">New</span>
                  </SidebarItem>
                  <SidebarItem label="Meetings" />
                  <SidebarItem label="Recordings" />
                  <SidebarItem label="Summaries" />
                  <SidebarItem label="Hub">
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">New</span>
                  </SidebarItem>
                  <SidebarItem label="Whiteboards" external />
                  <SidebarItem label="Notes" external />
                  <SidebarItem label="Clips" external />
                  <SidebarItem label="Canvas" external />
                  <SidebarItem label="Paper" external />
                  <SidebarItem label="Sheets" external />
                  <SidebarItem label="Slides" external />
                  <SidebarItem label="Tasks" external />
                  <SidebarItem label="Scheduler" external />
                  <SidebarItem label="Discover More Products" external />
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <SidebarItem label="My Account" chevron />
                    <SidebarItem label="Admin" chevron />
                    <SidebarItem label="Support" chevron />
                  </div>
                </div>
              )}
            </div>

            {/* Desktop: Full sidebar */}
            <div className="hidden md:block">
              {/* Home */}
              <div className="flex items-center px-3 py-2 text-sm font-medium bg-gray-100 text-gray-900 rounded-md mb-1">
                Home
              </div>

              <div className="text-xs font-medium text-gray-400 px-3 py-2 mt-3">My Products</div>

              {/* AI */}
              <SidebarItem label="AI">
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">New</span>
              </SidebarItem>

              <SidebarItem label="Meetings" />
              <SidebarItem label="Recordings" />
              <SidebarItem label="Summaries" />

              <SidebarItem label="Hub">
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">New</span>
              </SidebarItem>

              <SidebarItem label="Whiteboards" external />
              <SidebarItem label="Notes" external />
              <SidebarItem label="Clips" external />
              <SidebarItem label="Canvas" external />
              <SidebarItem label="Paper" external />
              <SidebarItem label="Sheets" external />
              <SidebarItem label="Slides" external />
              <SidebarItem label="Tasks" external />
              <SidebarItem label="Scheduler" external />

              <SidebarItem label="Discover More Products" external />

              {/* Bottom section */}
              <div className="mt-6 border-t border-gray-200 pt-3">
                <SidebarItem label="My Account" chevron />
                <SidebarItem label="Admin" chevron />
                <SidebarItem label="Support" chevron />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN (2/3 width on desktop, full width on mobile) */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl font-medium">
                      S
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Shivam Kumar</h2>
                      <p className="text-base text-gray-500 mt-0.5">Plan: Workplace Basic</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button className="px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">
                      Manage Plan
                    </button>
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                      View Plan Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Upgrade Banner */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center">
                        <Image 
                          src="/images/zoomsmall.png" 
                          alt="Zoom Small Logo"
                          width={30}
                          height={30}
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-blue-600">Workplace Pro</h3>
                    </div>
                    <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      Upgrade and save!
                    </h4>
                    <p className="text-base text-gray-500 mb-6 max-w-md mx-auto md:mx-0">
                      Unlock savings up to 16% when you select an annual Zoom Workplace Pro plan.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium text-base transition-colors">
                      Upgrade today
                    </button>
                  </div>
                  <div className="flex-shrink-0 order-first md:order-last">
                    <Image 
                      src="/images/zoom meet.png" 
                      alt="Zoom Meeting"
                      width={300}
                      height={200}
                      className="object-contain w-full max-w-[250px] md:max-w-[300px]"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (1/3 width on desktop, full width on mobile) */}
            <div className="lg:col-span-1 flex flex-col gap-6">

              {/* Actions + PMI Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="grid grid-cols-3 gap-3 mb-6"
                 onClick={() => window.open('/schedule', '_blank')}>
                  <a
                    
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-xl bg-blue-600 group-hover:bg-blue-700 flex items-center justify-center transition-colors">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Schedule</span>
                  </a>

                  <button
                    onClick={() => window.open('/join', '_blank')}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-blue-600 group-hover:bg-blue-700 flex items-center justify-center transition-colors">
                      <Plus className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Join</span>
                  </button>

                  <button
                    onClick={handleNewMeeting}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-orange-500 group-hover:bg-orange-600 flex items-center justify-center transition-colors">
                      <Video className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Host</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="text-base font-semibold text-gray-900 text-center mb-2">
                    Personal Meeting ID
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-mono text-gray-900 tracking-wide">
                      787 946 6584
                    </span>
                    <button
                      onClick={copyMeetingId}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      aria-label="Copy Meeting ID"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Meetings Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-semibold text-gray-900">Meetings</h2>
                  <button className="text-blue-600 text-sm font-medium hover:underline">
                    Visit Meetings
                  </button>
                </div>

                {upcomingMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                        <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                        <p className="text-sm text-gray-600">
                          {meeting.scheduled_time
                            ? new Date(meeting.scheduled_time).toLocaleString()
                            : 'Instant meeting'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-base font-semibold text-gray-900 mb-4">
                      No Upcoming Meetings
                    </p>
                    <button
                      onClick={() => window.open('/schedule', '_blank')}
                      className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium transition-colors mr-2"
                    >
                      Schedule a Meeting
                    </button>
                    <button
                      onClick={() => {
                        console.log('Debug: Testing API call...')
                        fetchUpcomingMeetings()
                      }}
                      className="px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                    >
                      Test API
                    </button>
                  </div>
                )}
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-5">
                  Recent activity
                </h2>

                {recentMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {recentMeetings.map((meeting) => (
                      <div key={meeting.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(meeting.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-base text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer/>

      {/* Modals */}
      <JoinMeetingModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinMeeting}
      />
    </div>
  )
}

/* ---------------- Sidebar Item Component (no icon) ---------------- */
function SidebarItem({
  label,
  children,
  external = false,
  chevron = false,
}: {
  label: string
  children?: React.ReactNode
  external?: boolean
  chevron?: boolean
}) {
  return (
    <a
      href="#"
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
    >
      <span className="flex-1">{label}</span>
      {children}
      {external && <ExternalLink className="w-3.5 h-3.5 ml-2 text-gray-400" />}
      {chevron && <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />}
    </a>
  )
}