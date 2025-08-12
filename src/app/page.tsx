'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import { getAllCollections, getCollectionsCount } from '@/lib/contracts/client'
import { useWallet } from '@/contexts/WalletContext'
import { blockUnwantedWallets } from '@/utils/walletDetection'
import { Package, Coins, TrendingUp, Users, Plus, Eye, ArrowRight } from 'lucide-react'

interface Collection {
  address: string
  name: string
  symbol: string
  creator: string
  creationTime: number
  nftCount: number
}

interface Stats {
  collections: number
  nfts: number
  volume: string
  users: number
}

export default function HomePage() {
  const { walletState: { isConnected, isCorrectNetwork }, switchNetwork } = useWallet()
  const [collections, setCollections] = useState<Collection[]>([])
  const [stats, setStats] = useState<Stats>({
    collections: 0,
    nfts: 0,
    volume: '0',
    users: 0
  })
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    setLoading(true)
    
    try {
      console.log('🔄 Loading stats... Wallet connected:', isConnected)
      
      const collectionsCount = await getCollectionsCount()
      console.log('📊 Collections count:', collectionsCount)
      
      const collectionAddresses = await getAllCollections()
      console.log('🏗️ Collection addresses:', collectionAddresses)
      
      const collectionsData = []
      let validCollections = 0
      let totalNFTs = 0
      
      for (const address of collectionAddresses) {
        try {
          const { getCollectionInfo, getCollectionNFTCount } = await import('@/lib/contracts/client')
          const info = await getCollectionInfo(address)
          console.log(`📁 Collection ${address} info:`, info)
          
          if (info && info.exists && info.name && info.symbol && info.creator) {
            const nftCount = await getCollectionNFTCount(address)
            console.log(`🪙 Collection ${info.name} has ${nftCount} NFTs`)
            
            collectionsData.push({
              address,
              name: info.name,
              symbol: info.symbol,
              creator: info.creator,
              creationTime: Number(info.creationTime) || 0,
              nftCount: nftCount
            })
            validCollections++
            totalNFTs += nftCount
            console.log(`✅ Collection ${info.name} loaded successfully with ${nftCount} NFTs`)
          } else {
            console.log(`⚠️ Collection ${address} has invalid data:`, info)
          }
        } catch (err) {
          console.error(`❌ Error loading collection ${address}:`, err)
        }
      }
      
      console.log('✅ Final collections data:', collectionsData)
      console.log(`📊 Valid collections: ${validCollections}/${collectionAddresses.length}`)
      console.log(`🪙 Total NFTs across all collections: ${totalNFTs}`)
      
      setCollections(collectionsData)
      setStats({
        collections: validCollections,
        nfts: totalNFTs,
        volume: '0.0',
        users: validCollections
      })
    } catch (err) {
      console.error('❌ Error loading stats:', err)
      
      setStats({
        collections: 0,
        nfts: 0,
        volume: '0',
        users: 0
      })
      setCollections([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    blockUnwantedWallets()
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">Core-Launch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The premier NFT launchpad on Core Blockchain Testnet2. Create, launch, and trade NFTs with ease.
          </p>
          
          {isConnected && !isCorrectNetwork && (
            <div className="mt-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-orange-300 mb-3">
                ⚠️ Wrong Network Detected
              </h3>
              <p className="text-orange-200 text-sm mb-4">
                Please switch to Core Blockchain Testnet2 to use all features.
              </p>
              <button
                onClick={switchNetwork}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Switch to Core Testnet2
              </button>
            </div>
          )}

          {!isConnected && (
            <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-primary-500/10 border border-blue-500/30 rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-blue-300 mb-3">
                🔗 Connect Your Wallet
              </h3>
              <p className="text-blue-200 text-sm mb-4">
                Connect MetaMask to view collection details and interact with NFTs.
              </p>
            </div>
          )}
        </div>

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

        {collections.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Recent Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.slice(0, 6).map((collection) => (
                <Link
                  key={collection.address}
                  href={`/collections/${collection.address}`}
                  className="bg-gray-700/50 rounded-xl p-6 hover:bg-gray-700/70 transition-all duration-300 border border-gray-600 hover:border-primary-500/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{collection.symbol.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{collection.name}</h3>
                      <p className="text-gray-400 text-sm">{collection.symbol}</p>
                      <p className="text-gray-500 text-xs">{collection.nftCount} NFTs</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {collections.length > 6 && (
              <div className="text-center mt-8">
                <Link
                  href="/collections"
                  className="inline-flex items-center space-x-2 bg-primary-500/20 text-primary-300 px-6 py-3 rounded-xl font-medium hover:bg-primary-500/30 transition-all duration-300"
                >
                  <span>View All Collections</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                  <img 
                    src="/corelaunch.png" 
                    alt="Core-Launch Logo" 
                    className="w-full h-full object-cover"
                  />
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
              © 2025 Core-Launch. All rights reserved. Built on Core Blockchain.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
