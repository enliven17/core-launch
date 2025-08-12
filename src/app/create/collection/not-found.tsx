'use client'

import { Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-300 mb-8">
          The collection creation page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go back</span>
          </button>
        </div>
      </div>
    </div>
  )
}
