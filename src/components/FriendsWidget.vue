<template>
  <div>
    <!-- Trigger Button -->
    <button 
      @click="loadFriends"
      :disabled="isLoading"
      class="btn w-full">
      <Icon icon="mdi:account-group" class="w-4 h-4 mr-2" />
      Amigos
    </button>

    <!-- Modal -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      @click="close">
      
      <div 
        class="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto shadow-xl"
        @click.stop>
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-pfblue">Mis Amigos</h2>
          <button 
            @click="close"
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <!-- Search Filter -->
        <div v-if="!isLoading && !error && friends.length > 0" class="mb-4">
          <div class="relative">
            <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por Alias"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pfblue focus:border-transparent">
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <Icon icon="mdi:loading" class="w-12 h-12 mx-auto animate-spin text-pfblue" />
          <p class="text-gray-600 mt-4">Cargando amigos...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <Icon icon="mdi:alert-circle" class="w-12 h-12 mx-auto text-red-500" />
          <p class="text-red-600 mt-4">{{ error }}</p>
          <button @click="loadFriends" class="btn btn-primary mt-4">
            Reintentar
          </button>
        </div>

        <!-- Friends List -->
        <div v-else-if="filteredFriends.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="friend in filteredFriends" 
            :key="friend.friendCustomerID"
            class="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            
            <!-- Avatar -->
            <div class="shrink-0">
              <img 
                :src="friend.avatarImage || 'https://cdn.myblueengine.com/PuntosFut/Images/default.png'" 
                :alt="friend.nickname"
                class="w-16 h-16 rounded-full object-cover border-2 border-pfblue"
              />
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold text-pfblue truncate">{{ friend.nickname }}</h3>
              <!--
              <div class="flex items-center gap-2 mt-1">
                <Icon icon="mdi:cards-outline" class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-600">
                  {{ friend.notInAlbum }} estampas sin pegar
                </span>
              </div>
            -->
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-2 shrink-0">
              <button 
                class="btn btn-sm bg-linear-to-r from-green-700 to-teal-800 hover:text-amber-300 text-white"
                @click.stop="viewFriendStickers(friend)">
                Ver estampas pegadas ({{ friend.inAlbum }})
              </button>
              <button 
                class="btn btn-sm bg-linear-to-r from-amber-600 to-orange-700 hover:text-white text-white"
                @click.stop="viewFriendLooseStickers(friend)">
                Ver estampas sin pegar ({{ friend.notInAlbum }})
              </button>
              <button 
                class="btn btn-sm btn-primary"
                @click.stop="openStickerSelector(friend)">
                Enviar estampas
              </button>
            </div>
          </div>
        </div>

        <!-- No Results State -->
        <div v-else-if="friends.length > 0 && filteredFriends.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <Icon icon="mdi:magnify" class="w-16 h-16 mx-auto" />
          </div>
          <p class="text-gray-600">No se encontraron amigos con "{{ searchQuery }}"</p>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <Icon icon="mdi:account-group-outline" class="w-16 h-16 mx-auto" />
          </div>
          <p class="text-gray-600">No tienes amigos agregados</p>
        </div>
      </div>
    </div>

    <!-- Sticker Selector Modal -->
    <div 
      v-if="selectedFriend" 
      class="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-md"
      @click="closeStickerSelector">
      
      <div 
        class="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[85vh] flex flex-col shadow-xl"
        @click.stop>
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-pfblue">Enviar estampas a {{ selectedFriend.nickname }}</h2>
            <p class="text-sm text-gray-600 mt-1">
              Selecciona las estampas que quieres enviar ({{ selectedStickers.length }} seleccionados)
            </p>
          </div>
          <button 
            @click="closeStickerSelector"
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <!-- Filter Controls -->
        <div class="mb-4 flex gap-3">
          <!-- Category Selector -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select 
              v-model="selectedCategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pfblue focus:border-transparent">
              <option value="">Todas las categorías</option>
              <option v-for="cat in sortedCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          
          <!-- Number Chooser -->
          <div class="w-48">
            <label class="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <input 
              v-model.number="selectedNumber"
              type="number"
              min="1"
              placeholder="Número de estampa"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pfblue focus:border-transparent">
          </div>
        </div>

        <!-- Horizontal Carousel -->
        <div v-if="filteredAvailableStickers.length > 0" class="flex-1 overflow-hidden">
          <div class="h-full overflow-x-auto overflow-y-hidden pb-4">
            <div class="flex gap-6 h-full items-center px-4 min-w-max">
              <div 
                v-for="card in filteredAvailableStickers" 
                :key="card.id"
                class="shrink-0 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                :class="{ 'ring-4 ring-pfblue': isSelected(card.id) }"
                @click="toggleSelection(card)">
                
                <div class="relative group mb-3 min-w-[180px]">
                  <CardRenderer
                    :iscard="true" 
                    :identifier="card.identifier ? Number(card.identifier) : 0"  
                    :base="card.resource"
                    :cardType="getCardTypeForRenderer(card)"
                  />

                  <!-- Selection Indicator -->
                  <div 
                    v-if="isSelected(card.id)" 
                    class="absolute inset-0 bg-pfblue/20 flex items-center justify-center rounded-[6%]">
                    <Icon icon="mdi:check-circle" class="w-12 h-12 text-pfblue" />
                  </div>

                  <!-- Already in Album Indicator -->
                  <div v-if="hasCardInAlbum(card.identifier)" class="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Repetida
                  </div>
                </div>

                <!-- Card Info -->
                <div class="text-center text-xs text-gray-600 max-w-[180px]">
                  <div class="font-semibold truncate">{{ getCardDescription(card.identifier) }}</div>
                  <div class="text-gray-500">{{ getCategoryName(card.identifier) }}</div>
                  <div class="text-gray-400">{{ getCardType(card.identifier) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="availableStickers.length === 0" class="flex-1 flex items-center justify-center">
          <div class="text-center py-12">
            <Icon icon="mdi:cards-outline" class="w-16 h-16 mx-auto text-gray-400" />
            <p class="text-gray-600 mt-4">No tienes estampas disponibles para enviar</p>
          </div>
        </div>

        <!-- No Results State -->
        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center py-12">
            <Icon icon="mdi:filter-off" class="w-16 h-16 mx-auto text-gray-400" />
            <p class="text-gray-600 mt-4">No se encontraron estampas con los filtros seleccionados</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mt-6 pt-4 border-t">
          <button 
            @click="sendSelectedStickers"
            :disabled="selectedStickers.length === 0 || isSending"
            class="flex-1 btn bg-linear-to-r from-green-700 to-teal-800 hover:text-amber-300"
            :class="{ 'opacity-50 cursor-not-allowed': selectedStickers.length === 0 || isSending }">
            <Icon v-if="isSending" icon="mdi:loading" class="w-4 h-4 mr-2 animate-spin" />
            <Icon v-else icon="mdi:send" class="w-4 h-4 mr-2" />
            {{ isSending ? 'Enviando...' : `Enviar ${selectedStickers.length} estampa${selectedStickers.length !== 1 ? 's' : ''}` }}
          </button>
          <button 
            @click="closeStickerSelector"
            class="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div 
      v-if="showConfirmation" 
      class="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-md"
      @click="showConfirmation = false">
      
      <div 
        class="bg-white rounded-lg p-8 max-w-md shadow-xl animate-bounce-in"
        @click.stop>
        
        <!-- Success Icon -->
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Icon icon="mdi:check-circle" class="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        <!-- Message -->
        <h3 class="text-2xl font-bold text-center text-pfblue mb-2">¡Envío completado!</h3>
        <p class="text-center text-gray-600 mb-6">{{ confirmationMessage }}</p>
        
        <!-- Close Button -->
        <button 
          @click="showConfirmation = false"
          class="btn w-full bg-green-500 hover:bg-green-600 text-white">
          Aceptar
        </button>
      </div>
    </div>

    <!-- Friend Stickers Viewer Modal -->
    <div 
      v-if="showFriendStickersModal && viewingFriend" 
      class="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-md"
      @click="closeFriendStickersModal">
      
      <div 
        class="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[85vh] flex flex-col shadow-xl"
        @click.stop>
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-pfblue">Estampas de {{ viewingFriend.nickname }}</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ friendStickers.length }} estampa{{ friendStickers.length !== 1 ? 's' : '' }} pegada{{ friendStickers.length !== 1 ? 's' : '' }}
            </p>
          </div>
          <button 
            @click="closeFriendStickersModal"
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>
        <!-- Filter Controls -->
        <!-- Category Selector -->
        <!--
        <div class="mb-4 flex gap-3">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select 
              v-model="friendStickerCategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pfblue focus:border-transparent">
              <option value="">Todas las categorías</option>
              <option v-for="cat in sortedCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
        -->
        <!-- Number Chooser -->
         <!--
          <div class="w-48">
            <label class="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <input 
              v-model.number="friendStickerNumber"
              type="number"
              min="1"
              placeholder="Número de estampa"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pfblue focus:border-transparent">
          </div>
        </div>
      -->
        <!-- Loading State -->
        <div v-if="isLoadingFriendStickers" class="flex-1 flex items-center justify-center">
          <div class="text-center py-12">
            <Icon icon="mdi:loading" class="w-12 h-12 mx-auto animate-spin text-pfblue" />
            <p class="text-gray-600 mt-4">Cargando estampas...</p>
          </div>
        </div>

        <!-- Stickers Horizontal Scroll -->
        <div v-else-if="filteredFriendStickers.length > 0" class="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div class="flex gap-4 snap-x snap-mandatory">
            <div 
              v-for="card in filteredFriendStickers" 
              :key="card.id"
              class="relative group shrink-0 snap-start w-32">
              
              <CardRenderer
                :iscard="true" 
                :identifier="card.identifier ? Number(card.identifier) : 0"  
                :base="card.resource"
                :cardType="getCardTypeForRenderer(card)"
              />

              <!-- Card Info -->
              <div class="mt-2 text-center text-xs text-gray-600">
                <div class="font-semibold truncate">{{ getCardDescription(card.identifier) }}</div>
                <div class="text-gray-500">{{ getCategoryName(card.identifier) }}</div>
                <div class="text-gray-400">{{ getCardType(card.identifier) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoadingFriendStickers && friendStickers.length === 0" class="flex-1 flex items-center justify-center">
          <div class="text-center py-12">
            <Icon icon="mdi:cards-outline" class="w-16 h-16 mx-auto text-gray-400" />
            <p class="text-gray-600 mt-4">No tienes estampas pegadas</p>
          </div>
        </div>

        <!-- No Results State -->
        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center py-12">
            <Icon icon="mdi:filter-off" class="w-16 h-16 mx-auto text-gray-400" />
            <p class="text-gray-600 mt-4">No se encontraron estampas con los filtros seleccionados</p>
          </div>
        </div>

        <!-- Close Button -->
        <div class="mt-6 pt-4 border-t">
          <button 
            @click="closeFriendStickersModal"
            class="btn w-full btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Friend Loose Stickers Viewer Modal -->
    <div 
      v-if="showFriendLooseStickersModal && viewingLooseFriend" 
      class="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-md"
      @click="closeFriendLooseStickersModal">
      
      <div 
        class="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[85vh] flex flex-col shadow-xl"
        @click.stop>
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-pfblue">Estampas sin pegar de {{ viewingLooseFriend.nickname }}</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ friendLooseStickers.length }} estampa{{ friendLooseStickers.length !== 1 ? 's' : '' }} sin pegar
            </p>
          </div>
          <button 
            @click="closeFriendLooseStickersModal"
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingFriendLooseStickers" class="flex-1 flex items-center justify-center">
          <div class="text-center py-12">
            <Icon icon="mdi:loading" class="w-12 h-12 mx-auto animate-spin text-pfblue" />
            <p class="text-gray-600 mt-4">Cargando estampas...</p>
          </div>
        </div>

        <!-- Stickers Horizontal Scroll -->
        <div v-else-if="filteredFriendLooseStickers.length > 0" class="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div class="flex gap-4 snap-x snap-mandatory">
            <div 
              v-for="card in filteredFriendLooseStickers" 
              :key="card.id"
              class="relative group shrink-0 snap-start w-32">
              
              <CardRenderer
                :iscard="true" 
                :identifier="card.identifier ? Number(card.identifier) : 0"  
                :base="card.resource"
                :cardType="getCardTypeForRenderer(card)"
              />

              <!-- Card Info -->
              <div class="mt-2 text-center text-xs text-gray-600">
                <div class="font-semibold truncate">{{ getCardDescription(card.identifier) }}</div>
                <div class="text-gray-500">{{ getCategoryName(card.identifier) }}</div>
                <div class="text-gray-400">{{ getCardType(card.identifier) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoadingFriendLooseStickers && friendLooseStickers.length === 0" class="flex-1 flex items-center justify-center">
          <div class="text-center py-12">
            <Icon icon="mdi:cards-outline" class="w-16 h-16 mx-auto text-gray-400" />
            <p class="text-gray-600 mt-4">s estampas sin pegar</p>
          </div>
        </div>

        <!-- No Results State -->
        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center py-12">
            <Icon icon="mdi:filter-off" class="w-16 h-16 mx-auto text-gray-400" />
            <p class="text-gray-600 mt-4">No se encontraron estampas con los filtros seleccionados</p>
          </div>
        </div>

        <!-- Close Button -->
        <div class="mt-6 pt-4 border-t">
          <button 
            @click="closeFriendLooseStickersModal"
            class="btn w-full btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { Icon } from '@iconify/vue'
import { apiService, type Friend } from '../services/api'
import CardRenderer from './CardRenderer.vue'
import { cardsDatabase } from '../data/cards'
import { cardsDatabase as cardsAlternatives } from '../data/cardsAlternatives'
import { categoriesDatabase } from '../data/categories'

const userStore = useUserStore()

// Get card type for CardRenderer component
const getCardTypeForRenderer = (card: any): 'normal' | 'metal' | 'animated' => {
  if (!card || !card.acRegId) return 'normal'
  const alternativeCard = cardsAlternatives.find(alt => alt.acRegId === card.acRegId)
  if (alternativeCard?.type === 1) return 'metal'
  if (alternativeCard?.type === 2) return 'animated'
  return 'normal'
}

const showModal = ref(false)
const friends = ref<Friend[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')

// Sticker selector state
const selectedFriend = ref<Friend | null>(null)
const selectedStickers = ref<number[]>([])
const isSending = ref(false)
const selectedCategory = ref<number | ''>('')
const selectedNumber = ref<number | ''>('')

// Sorted categories by order
const sortedCategories = computed(() => {
  return [...categoriesDatabase].sort((a, b) => a.order - b.order)
})

// Confirmation message state
const showConfirmation = ref(false)
const confirmationMessage = ref('')

// Friend stickers viewer state
const showFriendStickersModal = ref(false)
const viewingFriend = ref<Friend | null>(null)
const friendStickers = ref<any[]>([])
const isLoadingFriendStickers = ref(false)
const friendStickerCategory = ref<number | ''>('')
const friendStickerNumber = ref<number | ''>('')

// Friend loose stickers viewer state
const showFriendLooseStickersModal = ref(false)
const viewingLooseFriend = ref<Friend | null>(null)
const friendLooseStickers = ref<any[]>([])
const isLoadingFriendLooseStickers = ref(false)
const friendLooseStickerCategory = ref<number | ''>('')
const friendLooseStickerNumber = ref<number | ''>('')

// Note: counts are now provided by API on Friend (inAlbum, notInAlbum)

// Filter friends by nickname
const filteredFriends = computed(() => {
  if (!searchQuery.value.trim()) {
    return friends.value
  }

  const query = searchQuery.value.toLowerCase().trim()
  return friends.value.filter(friend => 
    friend.nickname.toLowerCase().includes(query)
  )
})

// Get available stickers (not in album)
const availableStickers = computed(() => {
  return userStore.ownedCards
    .filter(card => !card.inAlbum)
    .sort((a, b) => {
      const idA = a.identifier ? Number(a.identifier) : 0
      const idB = b.identifier ? Number(b.identifier) : 0
      return idA - idB
    })
})

// Filter available stickers based on category and number
const filteredAvailableStickers = computed(() => {
  return availableStickers.value.filter(card => {
    // Filter by number if specified (only if it's a valid number)
    if (selectedNumber.value !== '' && selectedNumber.value !== null && selectedNumber.value !== undefined && !isNaN(Number(selectedNumber.value))) {
      const cardIdentifier = card.identifier ? Number(card.identifier) : 0
      if (cardIdentifier !== Number(selectedNumber.value)) {
        return false
      }
    }

    // Filter by category if specified
    if (selectedCategory.value !== '' && selectedCategory.value !== null && selectedCategory.value !== undefined) {
      const cardData = cardsDatabase.find(c => c.identifier === Number(card.identifier))
      if (!cardData || cardData.category !== selectedCategory.value) {
        return false
      }
    }

    return true
  })
})

// Filter friend loose stickers based on category and number
const filteredFriendLooseStickers = computed(() => {
  return friendLooseStickers.value.filter(card => {
    // Filter by number if specified
    if (friendLooseStickerNumber.value !== '' && friendLooseStickerNumber.value !== null && friendLooseStickerNumber.value !== undefined && !isNaN(Number(friendLooseStickerNumber.value))) {
      const cardIdentifier = card.identifier ? Number(card.identifier) : 0
      if (cardIdentifier !== Number(friendLooseStickerNumber.value)) {
        return false
      }
    }

    // Filter by category if specified
    if (friendLooseStickerCategory.value !== '' && friendLooseStickerCategory.value !== null && friendLooseStickerCategory.value !== undefined) {
      const cardData = cardsDatabase.find(c => c.identifier === Number(card.identifier))
      if (!cardData || cardData.category !== friendLooseStickerCategory.value) {
        return false
      }
    }

    return true
  })
})

// Filter friend stickers based on category and number
const filteredFriendStickers = computed(() => {
  return friendStickers.value.filter(card => {
    // Filter by number if specified
    if (friendStickerNumber.value !== '' && friendStickerNumber.value !== null && friendStickerNumber.value !== undefined && !isNaN(Number(friendStickerNumber.value))) {
      const cardIdentifier = card.identifier ? Number(card.identifier) : 0
      if (cardIdentifier !== Number(friendStickerNumber.value)) {
        return false
      }
    }

    // Filter by category if specified
    if (friendStickerCategory.value !== '' && friendStickerCategory.value !== null && friendStickerCategory.value !== undefined) {
      const cardData = cardsDatabase.find(c => c.identifier === Number(card.identifier))
      if (!cardData || cardData.category !== friendStickerCategory.value) {
        return false
      }
    }

    return true
  })
})

// Check if a card with the same identifier is already in album
const hasCardInAlbum = (identifier: string | number | null) => {
  if (identifier === null) return false
  return userStore.ownedCards.some(card => 
    card.inAlbum && card.identifier && Number(card.identifier) === Number(identifier)
  )
}

// Get card description from database
const getCardDescription = (identifier: string | number | null) => {
  if (identifier === null) return ''
  const cardData = cardsDatabase.find(c => c.identifier === Number(identifier))
  return cardData?.desc || ''
}

// Get category name from database
const getCategoryName = (identifier: string | number | null) => {
  if (identifier === null) return ''
  const cardData = cardsDatabase.find(c => c.identifier === Number(identifier))
  if (!cardData) return ''
  const category = categoriesDatabase.find(cat => cat.id === cardData.category)
  return category?.name || ''
}

// Get card type (Normal, Metal, or Animada)
const getCardType = (identifier: string | number | null) => {
  if (identifier === null) return 'Clásica'
  const cardData = cardsDatabase.find(c => c.identifier === Number(identifier))
  if (!cardData) return 'Clásica'
  if (cardData.metal) return 'Metal'
  if (cardData.anim) return 'Animada'
  return 'Clásica'
}

// Load friends from API
async function loadFriends() {
  if (!userStore.customerId) {
    error.value = 'No hay socio activo'
    return
  }

  showModal.value = true
  isLoading.value = true
  error.value = null

  try {
    const response = await apiService.getFriends(userStore.customerId)
    if (response.success) {
      friends.value = response.data
    } else {
      error.value = response.errorDescription || 'Error al cargar amigos'
    }
  } catch (err) {
    console.error('Failed to load friends:', err)
    error.value = 'No se pudo conectar con el servidor'
  } finally {
    isLoading.value = false
  }
}

function openStickerSelector(friend: Friend) {
  selectedFriend.value = friend
  selectedStickers.value = []
  selectedCategory.value = ''
  selectedNumber.value = ''
}

function closeStickerSelector() {
  selectedFriend.value = null
  selectedStickers.value = []
  selectedCategory.value = ''
  selectedNumber.value = ''
}

function toggleSelection(card: { id: number }) {
  const index = selectedStickers.value.indexOf(card.id)
  if (index === -1) {
    selectedStickers.value.push(card.id)
  } else {
    selectedStickers.value.splice(index, 1)
  }
}

function isSelected(cardId: number): boolean {
  return selectedStickers.value.includes(cardId)
}

async function sendSelectedStickers() {
  if (!selectedFriend.value || selectedStickers.value.length === 0) return
  
  isSending.value = true
  
  try {
    // Map selected card IDs to the required format with acRegId
    const stickersToSend = availableStickers.value
      .filter(card => selectedStickers.value.includes(card.id))
      .map(card => ({
        customerStickerId: card.id,
        ACRegId: card.acRegId
      }))
    
    const response = await apiService.sendGift(
      userStore.customerId,
      selectedFriend.value.friendCustomerID,
      stickersToSend
    )
    
    // Remove sent stickers from user's collection
    selectedStickers.value.forEach(cardId => {
      const index = userStore.ownedCards.findIndex(c => c.id === cardId)
      if (index !== -1) {
        userStore.ownedCards.splice(index, 1)
      }
    })
    
    // Show success message
    confirmationMessage.value = response.data.message
    showConfirmation.value = true
    
    // Close selector and reload friends
    closeStickerSelector()
    await loadFriends()
  } catch (err) {
    console.error('Error sending gift:', err)
    error.value = 'Error al enviar estampas'
  } finally {
    isSending.value = false
  }
}

async function viewFriendStickers(friend: Friend) {
  viewingFriend.value = friend
  showFriendStickersModal.value = true
  isLoadingFriendStickers.value = true
  friendStickerCategory.value = ''
  friendStickerNumber.value = ''
  friendStickers.value = []
  
  try {
    const response = await apiService.getCustomerStickersCustom(friend.friendCustomerID)
    if (response.success && response.data.userCards) {
      const validCards = response.data.userCards.filter(card => card.id > 0)
      
      // Filter only cards that are in album (inAlbum: true)
      friendStickers.value = validCards
        .filter(card => card.inAlbum)
        .sort((a, b) => {
          const idA = a.identifier ? Number(a.identifier) : 0
          const idB = b.identifier ? Number(b.identifier) : 0
          return idA - idB
        })
    }
  } catch (err) {
    console.error('Error loading friend stickers:', err)
  } finally {
    isLoadingFriendStickers.value = false
  }
}

function closeFriendStickersModal() {
  showFriendStickersModal.value = false
  viewingFriend.value = null
  friendStickers.value = []
  friendStickerCategory.value = ''
  friendStickerNumber.value = ''
}

async function viewFriendLooseStickers(friend: Friend) {
  viewingLooseFriend.value = friend
  showFriendLooseStickersModal.value = true
  isLoadingFriendLooseStickers.value = true
  friendLooseStickerCategory.value = ''
  friendLooseStickerNumber.value = ''
  friendLooseStickers.value = []
  
  try {
    const response = await apiService.getCustomerStickersCustom(friend.friendCustomerID)
    if (response.success && response.data.userCards) {
      const validCards = response.data.userCards.filter(card => card.id > 0)
      
      // Filter only cards that are NOT in album (inAlbum: false)
      friendLooseStickers.value = validCards
        .filter(card => !card.inAlbum)
        .sort((a, b) => {
          const idA = a.identifier ? Number(a.identifier) : 0
          const idB = b.identifier ? Number(b.identifier) : 0
          return idA - idB
        })
    }
  } catch (err) {
    console.error('Error loading friend loose stickers:', err)
  } finally {
    isLoadingFriendLooseStickers.value = false
  }
}

function closeFriendLooseStickersModal() {
  showFriendLooseStickersModal.value = false
  viewingLooseFriend.value = null
  friendLooseStickers.value = []
  friendLooseStickerCategory.value = ''
  friendLooseStickerNumber.value = ''
}

function close() {
  showModal.value = false
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedNumber.value = ''
}

// Expose method to open modal from parent
function openModal() {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedNumber.value = ''
  loadFriends()
}

defineExpose({
  openModal
})
</script>

<style scoped>
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}
</style>
