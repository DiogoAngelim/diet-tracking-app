'use client'

import { useEffect } from 'react'

export function PWAInstaller() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
        })
        .then((reg) => {
          console.log('[PWA] Service Worker registered:', reg)

          // Check for updates periodically
          setInterval(() => {
            reg.update()
          }, 60000) // Check every minute

          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available, show update prompt
                  console.log('[PWA] New version available')
                  // You can dispatch an event here to show a toast/notification
                  window.dispatchEvent(
                    new CustomEvent('sw-update', { detail: { registration: reg } })
                  )
                }
              })
            }
          })
        })
        .catch((err) => {
          console.error('[PWA] Service Worker registration failed:', err)
        })
    }

    // Detect PWA display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleDisplayModeChange = () => {
      if (mediaQuery.matches) {
        console.log('[PWA] App is in standalone mode')
      }
    }
    mediaQuery.addEventListener('change', handleDisplayModeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleDisplayModeChange)
    }
  }, [])

  return null
}
