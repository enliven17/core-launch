'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  Package, 
  Coins, 
  TrendingUp,
  ArrowRight,
  Plus,
  Eye,
  Users,
  Zap
} from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import { getAllCollections, getCollectionsCount } from '@/lib/contracts/client'

export default function HomePage() {
  const [stats, setStats] = useState({
    collections: 0,
    nfts: 0,
    volume: '0',
    users: 0
  })
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const collectionsCount = await getCollectionsCount()
      const collectionsData = await getAllCollections()
      
      setCollections(collectionsData)
      setStats({
        collections: collectionsCount,
        nfts: collectionsData.length * 0, // Will be updated when NFTs are minted
        volume: '0.0', // Will be updated when trading starts
        users: collectionsData.length // Approximate user count
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">Core-Launch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The premier NFT launchpad on Core Blockchain Testnet2. Create, launch, and trade NFTs with ease.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Collections</p>
                <p className="text-2xl font-bold text-white">{loading ? '...' : stats.collections}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-secondary-500/20 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-secondary-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total NFTs</p>
                <p className="text-2xl font-bold text-white">{loading ? '...' : stats.nfts}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Volume</p>
                <p className="text-2xl font-bold text-white">{loading ? '...' : stats.volume} CORE</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{loading ? '...' : stats.users}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-primary-500/10 to-primary-600/10 border border-primary-500/30 rounded-2xl p-8 hover:border-primary-500/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Create Collection</h3>
                <p className="text-primary-200">Launch your NFT collection</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Deploy a new NFT collection on Core Blockchain Testnet2. Set royalties, metadata, and launch your project.
            </p>
            <Link 
              href="/create/collection"
              className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-secondary-500/10 to-secondary-600/10 border border-secondary-500/30 rounded-2xl p-8 hover:border-secondary-500/50 transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Explore Launchpad</h3>
                <p className="text-secondary-200">Discover new projects</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Browse upcoming and live NFT launches. Participate in presales and discover the next big project.
            </p>
            <Link 
              href="/launchpad"
              className="inline-flex items-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-secondary-500/25"
            >
              <span>Explore Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <Link href="/collections" className="text-primary-400 hover:text-primary-300 transition-colors">
              View All
            </Link>
          </div>
          
          {collections.length > 0 ? (
            <div className="space-y-4">
              {collections.slice(0, 3).map((collection) => (
                <div key={collection.address} className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold text-white/80">{collection.symbol.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{collection.name}</h4>
                    <p className="text-gray-400 text-sm">Collection created by {collection.creator.slice(0, 6)}...{collection.creator.slice(-4)}</p>
                  </div>
                  <Link 
                    href={`/collections/${collection.address}`}
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Recent Activity</h3>
              <p className="text-gray-500 mb-6">
                Start by creating your first collection or exploring the launchpad
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Link 
                  href="/create/collection"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Create Collection
                </Link>
                <Link 
                  href="/launchpad"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Browse Launchpad
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Core-Launch</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The premier NFT launchpad on Core Blockchain Testnet2, enabling creators to launch and trade NFTs with ease.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">The Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Communities</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Telegram</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Useful Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Core-Launch. All rights reserved. Built on Core Blockchain.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
