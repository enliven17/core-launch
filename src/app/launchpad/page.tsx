'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import { useWallet } from '@/contexts/WalletContext'
import { getAllCollections, getCollectionInfo } from '@/lib/contracts/client'

interface Collection {
  address: string
  name: string
  symbol: string
  creator: string
  creationTime: number
  status: 'Live' | 'Upcoming' | 'Ended'
  items: string
  price: string
  image: string
}

export default function LaunchpadPage() {
  const { walletState: { isConnected, isCorrectNetwork } } = useWallet()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCollections()
  }, [])

  const loadCollections = async () => {
    try {
      setLoading(true)
      const collectionAddresses = await getAllCollections()
      
      if (collectionAddresses.length === 0) {
        setCollections([])
        setLoading(false)
        return
      }

      const collectionsData: Collection[] = []
      
      for (const address of collectionAddresses) {
        try {
          const info = await getCollectionInfo(address)
          if (info && info.exists) {
            collectionsData.push({
              address,
              name: info.name,
              symbol: info.symbol,
              creator: info.creator,
              creationTime: Number(info.creationTime),
              status: 'Live' as const,
              items: '0', // Will be updated when NFTs are minted
              price: '0.1 CORE', // Default mint price
              image: `bg-gradient-to-br from-primary-500/30 to-secondary-500/30`
            })
          }
        } catch (err) {
          console.error(`Error loading collection ${address}:`, err)
        }
      }

      setCollections(collectionsData)
    } catch (err) {
      console.error('Error loading collections:', err)
      setError('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  const ItemCard = ({ collection }: { collection: Collection }) => (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group">
      <div className={`w-full h-48 ${collection.image} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}>
        {/* Collection Icon */}
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
          <span className="text-4xl font-bold text-white/80">{collection.symbol.charAt(0)}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm font-medium">
            {collection.status}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-200">
        {collection.name}
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Symbol</span>
          <span className="text-white font-medium">{collection.symbol}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Items</span>
          <span className="text-white font-medium">{collection.items}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Price</span>
          <span className="text-white font-medium">{collection.price}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Creator</span>
          <span className="text-white font-medium text-xs">
            {collection.creator.slice(0, 6)}...{collection.creator.slice(-4)}
          </span>
        </div>
      </div>
      
      <Link 
        href={`/collections/${collection.address}`}
        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-lg text-center block"
      >
        View Collection
      </Link>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading collections...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-400">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Error Loading Collections</h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button 
                onClick={loadCollections}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Main Content */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Launchpad</h1>
            <p className="text-xl text-gray-400">Discover and participate in the latest NFT launches on Core Blockchain</p>
          </div>

          {/* Collections Section */}
          {collections.length > 0 ? (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-8">Live Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {collections.map((collection) => (
                  <ItemCard key={collection.address} collection={collection} />
                ))}
              </div>
            </section>
          ) : (
            <section className="mb-16">
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-400">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Collections Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to create an NFT collection on Core Blockchain</p>
                <Link 
                  href="/create/collection"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Create First Collection
                </Link>
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="text-center py-16">
            <div className="bg-gray-800 rounded-3xl p-12 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch Your Collection?</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already building on Core Blockchain. Start your NFT journey today.
              </p>
              <Link 
                href="/create/collection"
                className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Create Collection
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
