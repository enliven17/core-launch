'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { ethers } from 'ethers'
import { 
  getCurrentChainId, 
  isCorrectNetwork, 
  switchToCoreTestnet2
} from '../lib/contracts/client'
import { NETWORK_CONFIG } from '../lib/contracts/constants'
import { blockUnwantedWallets } from '../utils/walletDetection'

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
      
      if (accounts.length > 0) {
        const address = accounts[0]
        
        let chainId: number | null = null
        try {
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
          chainId = parseInt(chainIdHex, 16)
          console.log('🔗 Raw chain ID from MetaMask:', chainIdHex, '→ Parsed:', chainId)
        } catch (error) {
          console.error('❌ Error getting chain ID:', error)
          chainId = null
        }
        
        const expectedChainId = NETWORK_CONFIG.CHAIN_ID
        const isCorrect = chainId === expectedChainId
        
        console.log('🔍 Wallet connection check:', {
          address,
          chainId,
          expectedChainId,
          isCorrect,
          networkName: chainId === 1114 ? 'Core Testnet2' : 
                      chainId === 1 ? 'Ethereum Mainnet' :
                      chainId === 56 ? 'BSC Mainnet' :
                      chainId === 137 ? 'Polygon' : 'Unknown',
          comparison: `${chainId} === ${expectedChainId} = ${isCorrect}`
        })
        
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
      
      let chainId: number | null = null
      try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
        chainId = parseInt(chainIdHex, 16)
        console.log('🔗 Raw chain ID from MetaMask:', chainIdHex, '→ Parsed:', chainId)
      } catch (error) {
        console.error('❌ Error getting chain ID:', error)
        chainId = null
      }
      
      const expectedChainId = NETWORK_CONFIG.CHAIN_ID
      const isCorrect = chainId === expectedChainId

      console.log('🔗 Wallet connected:', {
        address,
        chainId,
        expectedChainId,
        isCorrect,
        networkName: chainId === 1114 ? 'Core Testnet2' : 
                    chainId === 1 ? 'Ethereum Mainnet' :
                    chainId === 56 ? 'BSC Mainnet' :
                    chainId === 137 ? 'Polygon' : 'Unknown',
        comparison: `${chainId} === ${expectedChainId} = ${isCorrect}`
      })

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

  const switchNetwork = useCallback(async () => {
    try {
      const success = await switchToCoreTestnet2()
      if (success) {
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

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    blockUnwantedWallets()

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

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    checkConnection()

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [checkConnection])

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

