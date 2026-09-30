'use client'

import { Bell, Settings, User, ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-zoom-border">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-zoom-blue rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-semibold text-zoom-text">Zoom</span>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#" className="text-zoom-text hover:text-zoom-blue font-medium text-sm">
              Home
            </a>
            <a href="#" className="text-zoom-text hover:text-zoom-blue font-medium text-sm">
              Meetings
            </a>
            <a href="#" className="text-zoom-text hover:text-zoom-blue font-medium text-sm">
              Webinars
            </a>
            <a href="#" className="text-zoom-text hover:text-zoom-blue font-medium text-sm">
              Personal Contacts
            </a>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Notifications - hidden on very small screens */}
            <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings - hidden on very small screens */}
            <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <div className="w-8 h-8 bg-zoom-blue rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-zoom-text hidden md:block">
                Default User
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-4">
              <a href="#" className="text-zoom-text hover:text-zoom-blue font-medium">
                Home
              </a>
              <a href="#" className="text-zoom-text hover:text-zoom-blue font-medium">
                Meetings
              </a>
              <a href="#" className="text-zoom-text hover:text-zoom-blue font-medium">
                Webinars
              </a>
              <a href="#" className="text-zoom-text hover:text-zoom-blue font-medium">
                Personal Contacts
              </a>
              
              {/* Mobile-only actions */}
              <div className="flex space-x-4 pt-3 sm:hidden">
                <button className="flex items-center space-x-2 text-gray-600">
                  <Bell className="w-5 h-5" />
                  <span className="text-sm">Notifications</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600">
                  <Settings className="w-5 h-5" />
                  <span className="text-sm">Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}