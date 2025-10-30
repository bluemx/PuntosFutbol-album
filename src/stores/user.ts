import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '../services/api'

// Keep the full UserCard structure from API
export interface UserCard {
  id: number
  identifier: string | number | null
  resource: string
  token: number
  type: string
  inAlbum: boolean
}

export const useUserStore = defineStore('user', () => {
  // State
  const customerId = ref<string>('')
  const name = ref<string>('')
  const avatar = ref<string>('')
  const envelopes = ref<number>(0)
  const ownedCards = ref<UserCard[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  

  // Getters
  const isLoggedIn = computed(() => customerId.value !== '')
  const totalOwnedCards = computed(() => ownedCards.value.length)
  

  // Check whether the user has placed this album card into their album.
  // Mapping rule: page card id (number) -> userCard.identifier (number or string).
  function ownsCard(cardId: number) {
    const match = ownedCards.value.find(card => {
      if (card.identifier === null) return false
      return Number(card.identifier) === cardId
    })
    
    if (match) {
      console.log(`Card ${cardId}: found userCard with identifier ${match.identifier}, inAlbum: ${match.inAlbum}`)
    }
    
    return ownedCards.value.some(card => {
      if (card.identifier === null) return false
      // Handle both number and string identifiers
      return (Number(card.identifier) === cardId) && !!card.inAlbum
    })
  }

  // Return the actual UserCard that occupies this album position (by identifier)
  // and is currently in the album. Returns null when not present.
  function getOwnedCard(cardId: number) {
    return ownedCards.value.find(card => {
      if (card.identifier === null) return false
      // Handle both number and string identifiers
      return (Number(card.identifier) === cardId) && !!card.inAlbum
    }) || null
  }
  
  const getCardQuantity = computed(() => (cardIdentifier: number) => {
    // Count how many times this card identifier appears (for duplicates at same position)
    return ownedCards.value.filter(card => 
      card.identifier && Number(card.identifier) === cardIdentifier
    ).length
  })

  // Actions
  const loadUserData = async (userId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await apiService.getCustomerStickers(userId)
      if (!response.success) {
        throw new Error(response.errorDescription || 'API responded with an error')
      }
      console.log(response.data)
      customerId.value = String(response.data.id)
        name.value = String(response.data.name)
        avatar.value = String(response.data.avatar)
        envelopes.value = Number(response.data.envelopes) || 0
      // Keep the entire UserCard structure intact
      ownedCards.value = response.data.userCards || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load user data'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateInAlbum = async (updates: Array<{ cardId: number; inAlbum: boolean }>) => {
    if (!customerId.value) return
    try {
      isLoading.value = true
      const payload = updates.map(u => ({ StickerId: u.cardId, InAlbum: u.inAlbum ? 1 : 0 }))
      const resp = await apiService.updateCustomerStickers(customerId.value, payload)
      if (!resp.success) {
        throw new Error(resp.errorDescription || 'Failed to update stickers')
      }
      // sync local state
      for (const u of updates) {
        const card = ownedCards.value.find(c => c.id === u.cardId)
        if (card) card.inAlbum = u.inAlbum
      }
    } finally {
      isLoading.value = false
    }
  }

  const addCard = (card: UserCard) => {
    // Add the full UserCard to the collection
    ownedCards.value.push(card)
  }

  const removeCard = (cardId: number) => {
    // Remove the first occurrence of this card
    const cardIndex = ownedCards.value.findIndex(card => card.id === cardId)
    if (cardIndex !== -1) {
      ownedCards.value.splice(cardIndex, 1)
    }
  }

  const openPack = async () => {
    if (!customerId.value || envelopes.value <= 0) return null
    
    try {
      isLoading.value = true
      const response = await apiService.openPack(customerId.value)
      if (!response.success) {
        throw new Error(response.errorDescription || 'Failed to open pack')
      }
      
      // Add new cards to ownedCards
      const newCards = response.data.userCards || []
      ownedCards.value.push(...newCards)
      
      // Decrease envelope count
      envelopes.value = Math.max(0, envelopes.value - 1)
      
      return newCards
    } catch (error) {
      console.error('Failed to open pack:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    customerId.value = ''
    envelopes.value = 0
    ownedCards.value = []
    error.value = null
    isLoading.value = false
  }

  return {
    // State
    customerId,
    name,
    avatar,
    envelopes,
    ownedCards,
    isLoading,
    error,
    // Getters
    isLoggedIn,
    totalOwnedCards,
    ownsCard,
    getOwnedCard,
    getCardQuantity,
    // Actions
    loadUserData,
    updateInAlbum,
    addCard,
    removeCard,
    openPack,
    reset
  }
})