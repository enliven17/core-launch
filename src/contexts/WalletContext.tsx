'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { ethers } from 'ethers'
import { 
  getCurrentChainId, 
  isCorrectNetwork, 
  switchToCoreTestnet2,
  NETWORK_CONFIG 
} from '@/lib/contracts/client'

interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
  isCorrectNetwork: boolean
  balance: string | null
  isConnecting: boolean
  error: string | null
  isInitialized: boolean
}

interface WalletContextType {
  walletState: WalletState
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: () => Promise<void>
  checkConnection: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    isCorrectNetwork: false,
    balance: null,
    isConnecting: false,
    error: null,
    isInitialized: false,
  })

  // Check if wallet is connected
  const checkConnection = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        isConnected: false,
        error: 'MetaMask not installed',
        isInitialized: true,
      }))
      return
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      const chainId = await getCurrentChainId()
      
      if (accounts.length > 0) {
        const address = accounts[0]
        const isCorrect = chainId ? isCorrectNetwork(chainId) : false
        
        // Get balance
        const provider = new ethers.BrowserProvider(window.ethereum)
        const balance = await provider.getBalance(address)
        
        setWalletState(prev => ({
          ...prev,
          isConnected: true,
          address,
          chainId,
          isCorrectNetwork: isCorrect,
          balance: ethers.formatEther(balance),
          isConnecting: false,
          error: null,
          isInitialized: true,
        }))
      } else {
        setWalletState(prev => ({
          ...prev,
          isConnected: false,
          address: null,
          chainId: null,
          isCorrectNetwork: false,
          balance: null,
          isInitialized: true,
        }))
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
      setWalletState(prev => ({
        ...prev,
        error: 'Failed to check wallet connection',
        isInitialized: true,
      }))
    }
  }, [])

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask not installed'
      }))
      return
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }))

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]
      const chainId = await getCurrentChainId()
      const isCorrect = chainId ? isCorrectNetwork(chainId) : false

      // Get balance
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(address)

      setWalletState(prev => ({
        ...prev,
        isConnected: true,
        address,
        chainId,
        isCorrectNetwork: isCorrect,
        balance: ethers.formatEther(balance),
        isConnecting: false,
        error: null,
      }))
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.code === 4001 ? 'User rejected connection' : 'Failed to connect wallet'
      }))
    }
  }, [])

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState(prev => ({
      ...prev,
      isConnected: false,
      address: null,
      chainId: null,
      isCorrectNetwork: false,
      balance: null,
      isConnecting: false,
      error: null,
    }))
  }, [])

  // Switch to correct network
  const switchNetwork = useCallback(async () => {
    try {
      const success = await switchToCoreTestnet2()
      if (success) {
        // Recheck connection after network switch
        setTimeout(checkConnection, 1000)
      }
    } catch (error) {
      console.error('Error switching network:', error)
      setWalletState(prev => ({
        ...prev,
        error: 'Failed to switch network'
      }))
    }
  }, [checkConnection])

  // Listen for wallet events
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        checkConnection()
      }
    }

    const handleChainChanged = () => {
      checkConnection()
    }

    const handleDisconnect = () => {
      disconnectWallet()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    window.ethereum.on('disconnect', handleDisconnect)

    // Initial check
    checkConnection()

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
      window.ethereum.removeListener('disconnect', handleDisconnect)
    }
  }, [checkConnection, disconnectWallet])

  const value = {
    walletState,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    checkConnection,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
