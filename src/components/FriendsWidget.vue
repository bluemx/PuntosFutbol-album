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
        <div v-else-if="friends.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="friend in friends" 
            :key="friend.friendCustomerID"
            class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            
            <!-- Avatar -->
            <div class="shrink-0">
              <img 
                v-if="friend.avatarImage"
                :src="friend.avatarImage" 
                :alt="friend.nickname"
                class="w-16 h-16 rounded-full object-cover border-2 border-pfblue"
              />
              <div 
                v-else
                class="w-16 h-16 rounded-full bg-pfblue flex items-center justify-center text-white text-xl font-bold">
                {{ getInitials(friend.nickname) }}
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold text-pfblue truncate">{{ friend.nickname }}</h3>
              <div class="flex items-center gap-2 mt-1">
                <Icon icon="mdi:cards-outline" class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-600">
                  {{ friend.notInAlbum }} stickers sin pegar
                </span>
              </div>
            </div>

            <!-- Action Button -->
            <button 
              class="btn btn-sm btn-primary shrink-0"
              @click.stop="openStickerSelector(friend)">
              Enviar stickers
            </button>
          </div>
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
            <h2 class="text-2xl font-bold text-pfblue">Enviar stickers a {{ selectedFriend.nickname }}</h2>
            <p class="text-sm text-gray-600 mt-1">
              Selecciona los stickers que quieres enviar ({{ selectedStickers.length }} seleccionados)
            </p>
          </div>
          <button 
            @click="closeStickerSelector"
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <!-- Horizontal Carousel -->
        <div v-if="availableStickers.length > 0" class="flex-1 overflow-hidden">
          <div class="h-full overflow-x-auto overflow-y-hidden pb-4">
            <div class="flex gap-6 h-full items-center px-4 min-w-max">
              <div 
                v-for="card in availableStickers" 
                :key="card.id"
                class="shrink-0 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                :class="{ 'ring-4 ring-pfblue': isSelected(card.id) }"
                @click="toggleSelection(card)">
                
                <div class="relative group mb-3 min-w-[180px]">
                  <CardRenderer
                    :iscard="true" 
                    :identifier="card.identifier ? Number(card.identifier) : 0"  
                    :base="card.resource" 
                  />

                  <!-- Selection Indicator -->
                  <div 
                    v-if="isSelected(card.id)" 
                    class="absolute inset-0 bg-pfblue/20 flex items-center justify-center rounded-[6%]">
                    <Icon icon="mdi:check-circle" class="w-12 h-12 text-pfblue" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center py-12">
            <Icon icon="mdi:cards-outline" class="w-16 h-16 mx-auto text-gray-400" />
            <p class="text-gray-600 mt-4">No tienes stickers disponibles para enviar</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mt-6 pt-4 border-t">
          <button 
            @click="sendSelectedStickers"
            :disabled="selectedStickers.length === 0 || isSending"
            class="flex-1 btn btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': selectedStickers.length === 0 || isSending }">
            <Icon v-if="isSending" icon="mdi:loading" class="w-4 h-4 mr-2 animate-spin" />
            <Icon v-else icon="mdi:send" class="w-4 h-4 mr-2" />
            {{ isSending ? 'Enviando...' : `Enviar ${selectedStickers.length} sticker${selectedStickers.length !== 1 ? 's' : ''}` }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { Icon } from '@iconify/vue'
import { apiService, type Friend } from '../services/api'
import CardRenderer from './CardRenderer.vue'

const userStore = useUserStore()
const showModal = ref(false)
const friends = ref<Friend[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Sticker selector state
const selectedFriend = ref<Friend | null>(null)
const selectedStickers = ref<number[]>([])
const isSending = ref(false)

// Confirmation message state
const showConfirmation = ref(false)
const confirmationMessage = ref('')

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

// Get initials from nickname
function getInitials(nickname: string): string {
  return nickname
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Load friends from API
async function loadFriends() {
  if (!userStore.customerId) {
    error.value = 'No hay usuario activo'
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
}

function closeStickerSelector() {
  selectedFriend.value = null
  selectedStickers.value = []
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
    error.value = 'Error al enviar stickers'
  } finally {
    isSending.value = false
  }
}

function close() {
  showModal.value = false
}

// Expose method to open modal from parent
function openModal() {
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
