'use client'

import React from 'react'
import { Wallet, X, AlertTriangle, CheckCircle, Download } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { isMetaMaskAvailable } from '@/utils/walletDetection'

interface WalletConnectProps {
  className?: string
}

export default function WalletConnect({ className = '' }: WalletConnectProps) {
  const {
    walletState: {
      isConnected,
      address,
      chainId,
      isCorrectNetwork,
      balance,
      isConnecting,
      error,
      isInitialized,
    },
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } = useWallet()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="w-32 h-10 bg-gray-800/80 rounded-2xl animate-pulse"></div>
      </div>
    )
  }

  // Always show connect button if not connected
  if (!isConnected) {
    // Check if MetaMask is available
    if (!isMetaMaskAvailable()) {
      return (
        <div className={`${className} relative`}>
          <button
            disabled
            className="bg-orange-500/20 border border-orange-500/30 text-orange-400 px-6 py-3 rounded-2xl font-bold flex items-center space-x-3 cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span>MetaMask Required</span>
          </button>
          
          {/* MetaMask Indicator */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg">
            <Download className="w-3 h-3 text-white" />
          </div>
        </div>
      )
    }

    return (
      <div className={`${className} relative`}>
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        
        {/* Error Indicator */}
        {error && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
        {/* Network Status */}
        <div className="flex items-center space-x-2">
          {isCorrectNetwork ? (
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-2 rounded-xl font-medium border border-green-500/30">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Core Testnet2</span>
            </div>
          ) : (
            <button
              onClick={switchNetwork}
              className="flex items-center space-x-2 bg-orange-500/20 text-orange-400 px-3 py-2 rounded-xl font-medium hover:bg-orange-500/30 transition-colors border border-orange-500/30"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Wrong Network</span>
            </button>
          )}
        </div>

        {/* Wallet Info */}
        <div className="flex items-center space-x-4 bg-gray-800/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-gray-600 hover:bg-gray-800 transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-white">
              {formatAddress(address!)}
            </span>
          </div>
          
          {balance && (
            <div className="text-sm font-bold text-primary-400 bg-primary-500/20 px-3 py-1 rounded-xl border border-primary-500/30">
              {parseFloat(balance).toFixed(4)} CORE
            </div>
          )}
          
          <button
            onClick={disconnectWallet}
            className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 hover:bg-red-500/20 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
  )
}
