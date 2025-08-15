import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '../contexts/WalletContext'
import { blockUnwantedWallets } from '../utils/walletDetection'

// Block unwanted wallets globally
if (typeof window !== 'undefined') {
  // Block immediately
  blockUnwantedWallets()
  
  // Block on every page load
  window.addEventListener('load', blockUnwantedWallets)
  
  // Block on DOM content loaded
  document.addEventListener('DOMContentLoaded', blockUnwantedWallets)
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Core-Launch - NFT Launchpad',
  description: 'Create and mint NFTs on Core Blockchain Testnet2',
  keywords: ['NFT', 'Core Blockchain', 'Launchpad', 'Web3'],
  authors: [{ name: 'Core-Launch Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/corelaunch.png', sizes: '32x32', type: 'image/png' },
      { url: '/corelaunch.png', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/corelaunch.png',
    apple: '/corelaunch.png',
  },
  openGraph: {
    title: 'Core-Launch - NFT Launchpad',
    description: 'Create and mint NFTs on Core Blockchain Testnet2',
    images: ['/corelaunch.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Core-Launch - NFT Launchpad',
    description: 'Create and mint NFTs on Core Blockchain Testnet2',
    images: ['/corelaunch.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
