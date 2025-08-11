'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import { getAllCollections, getCollectionsCount, getCollectionInfo, getCollectionStats } from '@/lib/contracts/client'

interface Collection {
  address: string
  name: string
  symbol: string
  creator: string
  creationTime: number
  items: string
  volume: string
  owners: string
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [collectionsCount, setCollectionsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true)
        console.log('🔍 Fetching collections...')
        
        // Get collections count
        const count = await getCollectionsCount()
        console.log('📊 Collections count:', count)
        setCollectionsCount(count)
        
        if (count > 0) {
          // Get all collection addresses
          const collectionAddresses = await getAllCollections()
          console.log('🔗 Collection addresses:', collectionAddresses)
          
          const collectionsData: Collection[] = []
          
          // Get info for each collection
          for (const address of collectionAddresses) {
            try {
              console.log('📋 Getting info for collection:', address)
              const info = await getCollectionInfo(address)
              console.log('📋 Collection info:', info)
              
              if (info && info.exists) {
                // Get NFT stats for this collection
                const stats = await getCollectionStats(address)
                console.log('📊 Collection stats:', stats)
                
                collectionsData.push({
                  address,
                  name: info.name,
                  symbol: info.symbol,
                  creator: info.creator,
                  creationTime: Number(info.creationTime),
                  items: stats.totalSupply.toString(),
                  volume: stats.volume,
                  owners: stats.uniqueOwners.toString()
                })
                console.log('✅ Collection added:', info.name, 'with', stats.totalSupply, 'NFTs')
              } else {
                console.log('⚠️ Collection info invalid or not exists:', info)
              }
            } catch (err) {
              console.error(`❌ Error loading collection ${address}:`, err)
            }
          }
          
          console.log('📋 Final collections data:', collectionsData)
          setCollections(collectionsData)
        } else {
          console.log('📊 No collections found')
        }
      } catch (err) {
        console.error('Error fetching collections:', err)
        setError('Failed to fetch collections from blockchain')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Main Content */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">NFT Collections</h1>
            <p className="text-xl text-gray-400">Discover amazing NFT collections on Core Blockchain</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Collections</p>
                  <p className="text-3xl font-bold text-white">{collectionsCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-400">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <path d="M9 3v18"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Items</p>
                  <p className="text-3xl font-bold text-white">{collections.length > 0 ? collections.reduce((sum, c) => sum + (parseInt(c.items) || 0), 0).toLocaleString() : '0'}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-400">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275 1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Volume</p>
                  <p className="text-3xl font-bold text-white">{collections.length > 0 ? collections.reduce((sum, c) => sum + (parseFloat(c.volume) || 0), 0).toFixed(1) : '0.0'} CORE</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-400">
                    <line x1="12" x2="12" y1="2" y2="22"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Owners</p>
                  <p className="text-3xl font-bold text-white">{collections.length > 0 ? collections.reduce((sum, c) => sum + (parseInt(c.owners) || 0), 0).toLocaleString() : '0'}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-400">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" x2="9"></line>
                    <line x1="9" x2="15"></line>
                  </svg>
                  <span className="font-medium">Error</span>
                </div>
                <p className="mt-2 text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Loading Collections...</h3>
              <p className="text-gray-500">Fetching data from Core Blockchain</p>
            </div>
          ) : (
            /* Collections Grid */
            collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections.map((collection) => (
                  <div key={collection.address} className="bg-gray-800 rounded-3xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group">
                    <div className="w-full h-48 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                      {/* Collection Icon */}
                      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-white/80">{collection.symbol.charAt(0)}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-200">
                      {collection.name}
                    </h3>
                    
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {collection.symbol} Collection on Core Blockchain
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Items</p>
                        <p className="text-white font-bold">{collection.items}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Volume</p>
                        <p className="text-primary-500 font-bold">{collection.volume} CORE</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Owners</p>
                        <p className="text-white font-bold">{collection.owners}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Creator</p>
                        <p className="text-white font-bold text-xs">
                          {collection.creator.slice(0, 6)}...{collection.creator.slice(-4)}
                        </p>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/collections/${collection.address}`}
                      className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-2xl font-bold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-200 block"
                    >
                      View Collection
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <path d="M9 3v18"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Collections Yet</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Be the first to create an NFT collection on Core Blockchain. Start building your digital empire today.
                </p>
                <Link 
                  href="/create/collection"
                  className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Create First Collection
                </Link>
              </div>
            )
          )}

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-gray-800 rounded-3xl p-12 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Collection?</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already building on Core Blockchain. Start your NFT journey today.
              </p>
              <Link 
                href="/create/collection"
                className="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Create Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
