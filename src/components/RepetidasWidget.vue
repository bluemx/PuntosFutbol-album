<template>
  <div>
    <!-- Trigger Button -->
    <button 
      @click="showModal = true"
      class="btn  w-full">
      <Icon icon="mdi:cards-outline" class="w-4 h-4 mr-2" />
      Mis estampas ({{ extraCardsCount }})
    </button>

    <!-- Modal -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      @click="close">
      
      <div 
        class="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[85vh] flex flex-col shadow-xl"
        @click.stop>
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl font-bold text-pfblue">Mis estampas sin pegar</h2>
            <p v-if="hasNewCards" class="text-sm text-orange-600 font-medium flex items-center">
              <Icon icon="mdi:star" class="w-4 h-4 mr-1" />
              ¡Tienes nuevas estampas!
            </p>
          </div>
          <button 
            @click="close"
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <p class="text-xs  alert w-fit mb-4">
            <Icon icon="mdi:information" class="inline w-4 h-4" />
            Las estampas que se muestran son estampas no pegadas, pueden incluir repetidas y no repetidas.
        </p>

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
        <div v-if="filteredExtraCards.length > 0" class="flex-1 overflow-hidden">
          <div class="h-full overflow-x-auto overflow-y-hidden pb-4">
            <div class="flex gap-6 h-full items-center px-4 min-w-max">
              <div 
                v-for="card in filteredExtraCards" 
                :key="card.id"
                class="shrink-0 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                @click="openCardDetail(card)">
                
                <div class="relative group mb-3 min-w-[180px]">
                  <CardRenderer
                    :iscard="true" 
                    :identifier="card.identifier ? Number(card.identifier) : 0"  
                    :base="card.resource"
                    :cardType="getCardTypeForRenderer(card)"
                  />

                  <!-- New Card Star Indicator -->
                  <div v-if="isNewlyOpened(card.id)" class="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    <Icon icon="mdi:star" class="w-3 h-3" />
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
                  <div class="text-gray-400">{{ getCardType(card) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="extraCards.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <Icon icon="mdi:cards-outline" class="w-16 h-16 mx-auto" />
          </div>
          <p class="text-gray-600">No tienes estampas fuera del álbum</p>
        </div>

        <!-- No Results State -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <Icon icon="mdi:filter-off" class="w-16 h-16 mx-auto" />
          </div>
          <p class="text-gray-600">No se encontraron estampas con los filtros seleccionados</p>
        </div>
      </div>
    </div>

    <!-- Card Detail Modal -->
    <div 
      v-if="selectedCard" 
      class="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      @click="closeCardDetail">
      
      <div 
        class="bg-white rounded-lg p-6 max-w-md shadow-2xl"
        @click.stop>
        
        <!-- Card Display -->
        <div class="mb-4">
          <CardRenderer
            :iscard="true" 
            :identifier="selectedCard.identifier ? Number(selectedCard.identifier) : 0"  
            :base="selectedCard.resource"
            :cardType="getCardTypeForRenderer(selectedCard)"
          />
        </div>

        <!-- Card Info -->
        <div class="text-center mb-4">
          <p class="text-lg font-bold text-pfblue">
            {{ getCardDescription(selectedCard.identifier) }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            Estampa #{{ selectedCard.identifier }}
          </p>
          <p v-if="hasCardInAlbum(selectedCard.identifier)" class="text-sm text-yellow-600 font-medium mt-1">
            Ya tienes esta carta en el álbum
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button 
            @click="addToAlbum(selectedCard)"
            :disabled="userStore.isLoading"
            class="flex-1 btn"
            :class="[
              { 'opacity-50 cursor-not-allowed': userStore.isLoading },
              hasCardInAlbum(selectedCard.identifier) ? 'btn-secondary' : 'btn-primary'
            ]">
            <Icon icon="mdi:star-plus" class="w-4 h-4 mr-2" />
            {{ 
              userStore.isLoading ? 'Procesando...' : 
              hasCardInAlbum(selectedCard.identifier) ? 'Reemplazar' : 'Pegar en álbum' 
            }}
          </button>
          <button 
            @click="closeCardDetail"
            class="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/user'
import { Icon } from '@iconify/vue'
import CardRenderer from './CardRenderer.vue'
import { useNewlyOpenedCards } from '../composables/useNewlyOpenedCards'
import { cardsDatabase } from '../data/cards'
import { categoriesDatabase } from '../data/categories'
import { cardsDatabase as cardsAlternatives } from '../data/cardsAlternatives'

const userStore = useUserStore()
const showModal = ref(false)
const selectedCard = ref<any>(null)
const selectedCategory = ref<number | ''>('')
const selectedNumber = ref<number | ''>('')
const { isNewlyOpened, clearNewlyOpenedCards } = useNewlyOpenedCards()

// Sorted categories by order
const sortedCategories = computed(() => {
  return [...categoriesDatabase].sort((a, b) => a.order - b.order)
})

// Get all cards where inAlbum is false, ordered by identifier ascending
const extraCards = computed(() => {
  return userStore.ownedCards
    .filter(card => !card.inAlbum)
    .sort((a, b) => {
      const idA = a.identifier ? Number(a.identifier) : 0
      const idB = b.identifier ? Number(b.identifier) : 0
      return idA - idB
    })
})

// Filter cards based on category and number
const filteredExtraCards = computed(() => {
  return extraCards.value.filter(card => {
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

// Count cards that are not in album (repetidas/extras)
const extraCardsCount = computed(() => {
  return userStore.ownedCards.filter(card => !card.inAlbum).length
})

// Check if there are newly opened cards
const hasNewCards = computed(() => {
  return extraCards.value.some(card => isNewlyOpened(card.id))
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

// Get card type (Clásica, Metal, or Animada)
const getCardType = (card: any) => {
  if (!card || !card.acRegId) return 'Clásica'
  
  // Check if the card's acRegId exists in cardsAlternatives
  const alternativeCard = cardsAlternatives.find(alt => alt.acRegId === card.acRegId)
  
  if (alternativeCard?.type === 1) return 'Metal'
  if (alternativeCard?.type === 2) return 'Animada'
  
  return 'Clásica'
}

// Get card type for CardRenderer prop
const getCardTypeForRenderer = (card: any): 'normal' | 'metal' | 'animated' => {
  if (!card || !card.acRegId) return 'normal'
  const alternativeCard = cardsAlternatives.find(alt => alt.acRegId === card.acRegId)
  if (alternativeCard?.type === 1) return 'metal'
  if (alternativeCard?.type === 2) return 'animated'
  return 'normal'
}

// Open card detail modal
function openCardDetail(card: any) {
  selectedCard.value = card
}

// Close card detail modal
function closeCardDetail() {
  selectedCard.value = null
}

async function addToAlbum(card: any) {
  try {
    const updates = []
    
    // If there's already a card in album with same identifier, remove it first
    if (hasCardInAlbum(card.identifier)) {
      const existingCard = userStore.ownedCards.find(c => 
        c.inAlbum && c.identifier && Number(c.identifier) === Number(card.identifier)
      )
      if (existingCard) {
        updates.push({ cardId: existingCard.id, inAlbum: false })
      }
    }
    
    // Add the new card to album
    updates.push({ cardId: card.id, inAlbum: true })
    
    // Execute both updates in a single API call
    await userStore.updateInAlbum(updates)
    
    // Close detail modal after adding
    closeCardDetail()
  } catch (error) {
    console.error('Failed to add card to album:', error)
  }
}

function close() {
  showModal.value = false
  selectedCategory.value = ''
  selectedNumber.value = ''
  // Clear new card highlights when closing
  clearNewlyOpenedCards()
}

// Expose methods to parent component
function openModal() {
  showModal.value = true
  selectedCategory.value = ''
  selectedNumber.value = ''
}

defineExpose({
  openModal
})
</script>