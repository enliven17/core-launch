export interface WalletInfo {
  type: 'metamask' | 'none'
  isAvailable: boolean
  name: string
  description: string
}

export function detectWallets(): WalletInfo[] {
  const wallets: WalletInfo[] = []

  // Check MetaMask only - ignore all other wallets
  if (typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask) {
    wallets.push({
      type: 'metamask',
      isAvailable: true,
      name: 'MetaMask',
      description: 'Ethereum wallet for Core Blockchain'
    })
  } else {
    wallets.push({
      type: 'metamask',
      isAvailable: false,
      name: 'MetaMask',
      description: 'Please install MetaMask extension'
    })
  }

  return wallets
}

export function getPreferredWallet(): WalletInfo | null {
  const wallets = detectWallets()
  
  // Only use MetaMask for Core blockchain
  const metamask = wallets.find(w => w.type === 'metamask' && w.isAvailable)
  return metamask || null
}

export function isMetaMaskAvailable(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.ethereum !== 'undefined' && 
         window.ethereum.isMetaMask === true
}

// Block Flow Wallet and other unwanted wallets
export function blockUnwantedWallets(): void {
  if (typeof window !== 'undefined') {
    // Block Flow Wallet
    if ((window as any).flow) {
      console.log('🚫 Blocking Flow Wallet access')
      delete (window as any).flow
    }
    
    // Block other unwanted wallet providers
    const unwantedProviders = ['flow', 'phantom', 'solflare', 'walletconnect']
    unwantedProviders.forEach(provider => {
      if ((window as any)[provider]) {
        console.log(`🚫 Blocking ${provider} wallet access`)
        delete (window as any)[provider]
      }
    })
    
    // Set up continuous blocking
    setInterval(() => {
      unwantedProviders.forEach(provider => {
        if ((window as any)[provider]) {
          console.log(`🚫 Continuously blocking ${provider} wallet access`)
          delete (window as any)[provider]
        }
      })
    }, 1000) // Check every second
  }
}

// Initialize blocking immediately
if (typeof window !== 'undefined') {
  blockUnwantedWallets()
  
  // Block on window focus (when user returns to tab)
  window.addEventListener('focus', blockUnwantedWallets)
  
  // Block on visibility change
  document.addEventListener('visibilitychange', blockUnwantedWallets)
}
