import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MOCK_CURRENT_USER, User } from '@/data/users'
import { MOCK_BOTTLES, Bottle } from '@/data/bottles'
import { MOCK_WAITLIST, WaitlistEntry } from '@/data/waitlist'
import { MOCK_ALBUMS, Album } from '@/data/albums'

type Store = {
  // Auth (always logged in for demo)
  user: User | null
  isAuthenticated: boolean
  signIn: () => void
  signOut: () => void

  // Spotify
  spotifyConnected: boolean
  spotifyLoading: boolean
  connectSpotify: () => Promise<void>

  // Bottles
  bottles: Bottle[]
  claimBottle: (serialNumber: string, userId: string) => boolean
  getUserBottles: (userId: string) => Bottle[]

  // Waitlist
  waitlist: WaitlistEntry[]
  addToWaitlist: (email: string, albumId?: string) => Promise<boolean>

  // Albums (for inventory tracking)
  albums: Album[]
  decrementInventory: (albumId: string) => void

  // Cart (simulate Stripe)
  cartAlbumId: string | null
  addToCart: (albumId: string) => void
  clearCart: () => void
  checkout: () => Promise<{ success: boolean; orderId: string }>

  // Toast notifications
  toast: { message: string; type: 'success' | 'error' } | null
  showToast: (message: string, type: 'success' | 'error') => void
  clearToast: () => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Auth
      user: MOCK_CURRENT_USER,
      isAuthenticated: true,
      signIn: () => {
        set({ user: MOCK_CURRENT_USER, isAuthenticated: true })
        get().showToast('Signed in successfully', 'success')
      },
      signOut: () => {
        set({
          user: null,
          isAuthenticated: false,
          spotifyConnected: false
        })
        get().showToast('Signed out', 'success')
      },

      // Spotify
      spotifyConnected: false,
      spotifyLoading: false,
      connectSpotify: async () => {
        set({ spotifyLoading: true })
        await new Promise(resolve => setTimeout(resolve, 2000))
        set({
          spotifyConnected: true,
          spotifyLoading: false,
          user: get().user ? { ...get().user!, spotifyConnected: true } : null
        })
        get().showToast('Spotify connected successfully', 'success')
      },

      // Bottles
      bottles: MOCK_BOTTLES,
      claimBottle: (serialNumber, userId) => {
        const bottle = get().bottles.find(b => b.serialNumber === serialNumber)

        if (!bottle) {
          get().showToast('Invalid serial number', 'error')
          return false
        }

        if (bottle.status === 'claimed') {
          get().showToast('This bottle has already been claimed', 'error')
          return false
        }

        set(state => ({
          bottles: state.bottles.map(b =>
            b.serialNumber === serialNumber
              ? {
                  ...b,
                  claimedBy: userId,
                  claimedAt: new Date().toISOString(),
                  status: 'claimed' as const
                }
              : b
          )
        }))

        get().showToast('Bottle claimed successfully!', 'success')
        return true
      },
      getUserBottles: (userId) => {
        return get().bottles.filter(b => b.claimedBy === userId)
      },

      // Waitlist
      waitlist: MOCK_WAITLIST,
      addToWaitlist: async (email, albumId) => {
        const exists = get().waitlist.some(
          entry => entry.email === email && entry.albumId === (albumId || null)
        )

        if (exists) {
          get().showToast("You're already on the waitlist", 'error')
          return false
        }

        const entry: WaitlistEntry = {
          id: `wait-${Date.now()}`,
          email,
          albumId: albumId || null,
          createdAt: new Date().toISOString(),
          notified: false
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        set(state => ({ waitlist: [...state.waitlist, entry] }))
        get().showToast("You're in. Watch for a message when the drop opens.", 'success')
        return true
      },

      // Albums
      albums: MOCK_ALBUMS,
      decrementInventory: (albumId) => {
        set(state => ({
          albums: state.albums.map(a =>
            a.id === albumId
              ? { ...a, remainingInventory: Math.max(0, a.remainingInventory - 1) }
              : a
          )
        }))
      },

      // Cart
      cartAlbumId: null,
      addToCart: (albumId) => {
        set({ cartAlbumId: albumId })
      },
      clearCart: () => {
        set({ cartAlbumId: null })
      },
      checkout: async () => {
        const albumId = get().cartAlbumId
        if (!albumId) return { success: false, orderId: '' }

        await new Promise(resolve => setTimeout(resolve, 2000))

        const orderId = `order-${Date.now()}`
        get().decrementInventory(albumId)
        set({ cartAlbumId: null })
        get().showToast('Order placed successfully!', 'success')
        return { success: true, orderId }
      },

      // Toast
      toast: null,
      showToast: (message, type) => {
        set({ toast: { message, type } })
        setTimeout(() => set({ toast: null }), 3000)
      },
      clearToast: () => set({ toast: null })
    }),
    {
      name: 'despois-store',
      partialize: (state) => ({
        spotifyConnected: state.spotifyConnected,
        bottles: state.bottles,
        waitlist: state.waitlist,
        albums: state.albums,
      })
    }
  )
)
