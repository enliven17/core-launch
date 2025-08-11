'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap } from 'lucide-react'
import WalletConnect from './WalletConnect'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Core-Launch</h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/launchpad" 
              className={`transition-colors ${
                isActive('/launchpad') 
                  ? 'text-white font-medium border-b-2 border-purple-500 pb-1' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Launchpad
            </Link>
            <Link 
              href="/collections" 
              className={`transition-colors ${
                isActive('/collections') 
                  ? 'text-white font-medium border-b-2 border-primary-500 pb-1' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Collections
            </Link>
            <Link 
              href="/create/collection" 
              className={`transition-colors ${
                isActive('/create/collection') 
                  ? 'text-white font-medium border-b-2 border-primary-500 pb-1' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Create Collection
            </Link>
          </nav>

          <div className="flex items-center">
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  )
}
