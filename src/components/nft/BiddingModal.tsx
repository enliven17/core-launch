'use client'

import React, { useState, useEffect } from 'react'
import { X, Gavel, Clock, User, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { 
  placeBid, 
  getBiddingInfo, 
  getBids, 
  acceptBid, 
  withdrawBid,
  getSigner,
  approveNFTForBidding,
  checkNFTApproval
} from '@/lib/contracts/client'
import { ethers } from 'ethers'

interface BiddingModalProps {
  isOpen: boolean
  onClose: () => void
  nft: {
    tokenId: number
    tokenURI: string
    owner: string
    collectionAddress: string
  }
}

interface Bid {
  bidder: string
  amount: string
  timestamp: number
  active: boolean
  message: string
}

interface BiddingInfo {
  owner: string
  isActive: boolean
  endTime: number
  minBid: string
  highestBid: string
  highestBidder: string
  totalBids: number
}

export default function BiddingModal({ isOpen, onClose, nft }: BiddingModalProps) {
  const { walletState: { isConnected, address, isCorrectNetwork }, switchNetwork } = useWallet()
  const [biddingInfo, setBiddingInfo] = useState<BiddingInfo | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [bidAmount, setBidAmount] = useState('')
  
  // Validate bid amount input - FIXED VERSION
  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log('Input value changed:', value) // Debug log
    
    // Allow empty string or valid numbers
    if (value === '' || /^\d*\.?\d{0,18}$/.test(value)) {
      setBidAmount(value)
      console.log('Bid amount set to:', value) // Debug log
    }
  }

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (isOpen && nft) {
      console.log('🔍 BiddingModal opened with NFT:', nft)
      console.log('🔍 tokenId type:', typeof nft.tokenId, 'value:', nft.tokenId)
      loadBiddingInfo()
      setIsOwner(address?.toLowerCase() === nft.owner.toLowerCase())
    }
  }, [isOpen, nft, address])

  const loadBiddingInfo = async () => {
    if (!nft) return
    
    try {
      console.log('🔍 Loading bidding info for NFT:', nft.tokenId)
      const info = await getBiddingInfo(nft.collectionAddress, nft.tokenId)
      console.log('📊 Bidding info loaded:', info)
      setBiddingInfo(info)
      
      // Load existing bids
      const existingBids = await getBids(nft.collectionAddress, nft.tokenId)
      console.log('💰 Existing bids:', existingBids)
      setBids(existingBids)
    } catch (err) {
      console.error('Error loading bidding info:', err)
      // Set default bidding info if none exists
      setBiddingInfo({
        isActive: true, // Always allow bidding
        endTime: 0,
        minBid: '0.1',
        highestBid: '0',
        highestBidder: '0x0000000000000000000000000000000000000000',
        owner: nft.owner,
        totalBids: 0
      })
      setBids([])
    }
  }

  const handlePlaceBid = async () => {
    if (!isConnected || !isCorrectNetwork) {
      setError('Please connect your wallet and switch to Core Testnet2')
      return
    }

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      setError('Please enter a valid bid amount')
      return
    }

    // Check if user is the owner
    if (isOwner) {
      setError('You cannot bid on your own NFT')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log('💰 Placing bid:', bidAmount, 'CORE')
      
      const result = await placeBid(
        nft.collectionAddress,
        nft.tokenId,
        bidAmount,
        'Bid placed on NFT', // Message parameter
        await getSigner()
      )

      if (result.success) {
        setSuccess('Bid placed successfully!')
        setBidAmount('')
        loadBiddingInfo() // Refresh bids
      } else {
        setError(result.error || 'Failed to place bid')
      }
    } catch (err) {
      console.error('Error placing bid:', err)
      setError('Failed to place bid: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptBid = async (bidder: string, amount: string) => {
    if (!isConnected || !isCorrectNetwork) {
      setError('Please connect your wallet and switch to Core Testnet2')
      return
    }

    if (!isOwner) {
      setError('Only the NFT owner can accept bids')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log('✅ Accepting bid from:', bidder, 'amount:', amount)
      
      const result = await acceptBid(
        nft.collectionAddress,
        nft.tokenId,
        await getSigner()
      )

      if (result.success) {
        setSuccess('Bid accepted! NFT transferred successfully.')
        loadBiddingInfo() // Refresh data
      } else {
        setError(result.error || 'Failed to accept bid')
      }
    } catch (err) {
      console.error('Error accepting bid:', err)
      setError('Failed to accept bid: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawBid = async () => {
    if (!isConnected || !isCorrectNetwork) {
      setError('Please connect your wallet and switch to Core Testnet2')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log('↶ Withdrawing bid...')
      
      const result = await withdrawBid(
        nft.collectionAddress,
        nft.tokenId,
        await getSigner()
      )

      if (result.success) {
        setSuccess('Bid withdrawn successfully!')
        loadBiddingInfo() // Refresh data
      } else {
        setError(result.error || 'Failed to withdraw bid')
      }
    } catch (err) {
      console.error('Error withdrawing bid:', err)
      setError('Failed to withdraw bid: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Gavel className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-bold text-white">
              NFT #{nft.tokenId} Bidding
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Network Check - Only show if wallet is connected but wrong network */}
          {isConnected && !isCorrectNetwork && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-orange-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>Wrong Network</span>
                </div>
                <button
                  onClick={switchNetwork}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Switch to Core Testnet2
                </button>
              </div>
            </div>
          )}

          {/* Wallet Not Connected Warning */}
          {!isConnected && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-blue-400">
                <AlertCircle className="w-5 h-5" />
                <span>Please connect your wallet to place bids</span>
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* NFT Info */}
          <div className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">#{nft.tokenId}</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">NFT #{nft.tokenId}</h3>
                <p className="text-gray-400 text-sm">Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</p>
              </div>
            </div>
          </div>

          {/* Place Bid - Always Visible for Non-Owners */}
          {!isOwner && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Place Your Bid</h3>
              
              {/* Debug Info */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-xs">
                <p className="text-blue-400">Debug: Current bid amount: "{bidAmount}"</p>
                <p className="text-blue-400">Type: {typeof bidAmount}</p>
                <p className="text-blue-400">Is Owner: {isOwner ? 'Yes' : 'No'}</p>
              </div>
              
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={bidAmount}
                  onChange={handleBidAmountChange}
                  placeholder="0.1"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                  onFocus={() => console.log('Input focused')}
                  onBlur={() => console.log('Input blurred')}
                />
                <button
                  onClick={handlePlaceBid}
                  disabled={isLoading || !bidAmount || parseFloat(bidAmount) <= 0}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Placing...' : 'Place Bid'}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Minimum bid: 0.1 CORE
              </p>
              {bidAmount && parseFloat(bidAmount) > 0 && (
                <p className="text-xs text-green-400">
                  Your bid: {bidAmount} CORE
                </p>
              )}
            </div>
          )}

          {/* Owner Info */}
          {isOwner && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">You own this NFT</span>
              </div>
              <p className="text-sm text-green-300 mt-2">
                You can accept any bid below. When you accept a bid, the NFT will be transferred to the bidder and you'll receive the CORE.
              </p>
            </div>
          )}

          {/* Bid History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>Bid History</span>
            </h3>
            
            {bids.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No bids yet</p>
            ) : (
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {bids.map((bid, index) => (
                  <div
                    key={index}
                    className="bg-gray-700/50 rounded-xl p-4 border border-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">
                          {bid.bidder.slice(0, 6)}...{bid.bidder.slice(-4)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-primary-400" />
                          <span className="text-white font-bold">
                            {bid.amount} CORE
                          </span>
                        </div>
                        {isOwner && bid.active && (
                          <button
                            onClick={() => handleAcceptBid(bid.bidder, bid.amount)}
                            disabled={isLoading}
                            className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50"
                          >
                            Accept
                          </button>
                        )}
                        {bid.bidder.toLowerCase() === address?.toLowerCase() && bid.active && (
                          <button
                            onClick={handleWithdrawBid}
                            disabled={isLoading}
                            className="bg-red-500/20 text-red-300 px-3 py-1 rounded-lg text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      {new Date(bid.timestamp * 1000).toLocaleString()}
                      {bid.active && (
                        <span className="ml-2 text-gray-400">
                          🟢 Active
                        </span>
                      )}
                      {!bid.active && (
                        <span className="ml-2 text-gray-400">↶ Inactive</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
