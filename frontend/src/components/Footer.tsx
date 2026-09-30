import { 
  MessageCircle, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Facebook, 
  Instagram,
  ChevronDown 
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          {/* About Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">About</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Zoom Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Customers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability & ESG</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zoom Cares</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Media Kit</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How to Videos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Developer Platform</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zoom Ventures</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zoom Merchandise Store</a></li>
            </ul>
          </div>

          {/* Download Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Download</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Zoom Workplace App</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zoom Rooms Client</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Browser Extension</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Outlook Plug-in</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zoom Plugin for HCL Notes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zoom Plugin Admin Tool for HCL Notes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Android App</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zoom Virtual Backgrounds</a></li>
            </ul>
          </div>

          {/* Sales Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Sales</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="tel:00800050033335" className="hover:text-white transition-colors">00800050033335</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Plans & Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Request a Demo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Webinars and Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zoom Experience Center</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Test Zoom</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Account</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Learning Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zoom Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Developer support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy, Security, Legal Policies, and Modern Slavery Act Transparency Statement</a></li>
            </ul>
          </div>

          {/* Language & Currency Column */}
          <div>
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-4">Language</h3>
              <button className="flex items-center justify-between w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white hover:bg-gray-600 transition-colors">
                English
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Currency</h3>
              <button className="flex items-center justify-between w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white hover:bg-gray-600 transition-colors">
                Indian Rupee ₹
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Social Media Icons */}
            <div className="mt-6">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center text-xs text-gray-400 space-x-4">
              <span>Copyright ©2026 Zoom Communications, Inc. All rights reserved.</span>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Trust Center</a>
              <a href="#" className="hover:text-white transition-colors">Acceptable Use Guidelines</a>
              <a href="#" className="hover:text-white transition-colors">Legal & Compliance</a>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span className="flex items-center">
                <span className="w-4 h-4 bg-blue-600 rounded-sm mr-2 flex items-center justify-center">
                  <span className="text-white text-xs">🔒</span>
                </span>
                Your Privacy Choices
              </span>
              <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}