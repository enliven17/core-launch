'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Create Collection Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Something went wrong!
        </h1>
        
        <p className="text-gray-300 mb-8">
          An error occurred while loading the collection creation page. This might be due to a temporary issue.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try again</span>
          </button>
          
          <Link
            href="/"
            className="w-full bg-gray-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Go home</span>
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="text-gray-400 cursor-pointer mb-2">
              Error details (development only)
            </summary>
            <div className="bg-gray-800/50 rounded-lg p-4 text-sm text-gray-300 font-mono">
              <p><strong>Error:</strong> {error.message}</p>
              {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
