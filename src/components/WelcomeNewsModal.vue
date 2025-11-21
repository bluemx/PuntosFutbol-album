<template>
  <div 
    v-if="showModal && stickers.length > 0" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
    @click="close">
    
    <div 
      class="bg-white rounded-2xl p-8 max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl w-[90vw]"
      @click.stop>
      
      <!-- Header -->
      <div class="flex justify-between items-start mb-6">
        <div class="flex-1"></div>
        <div class="flex-1 text-center">
          <div class="flex justify-center mb-4">
            <div class="w-20 h-20 bg-pfblue rounded-full flex items-center justify-center">
              <Icon icon="mdi:gift" class="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 class="text-3xl font-bold text-pfblue mb-2">¡Novedades en tu Álbum!</h2>
          <p class="text-gray-600">Tienes {{ stickers.length }} estampa{{ stickers.length !== 1 ? 's' : '' }} nueva{{ stickers.length !== 1 ? 's' : '' }}</p>
        </div>
        <div class="flex-1 flex justify-end">
          <button 
            @click="close"
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Stickers Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div 
          v-for="sticker in stickers" 
          :key="sticker.stickerId"
          @click="openCardDetail(sticker)"
          class="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
          
          <!-- Sticker Image -->
          <div class="relative mb-3">
            <img 
              :src="sticker.resource" 
              :alt="`Sticker ${sticker.identifier}`"
              class="w-full h-32 object-contain rounded-lg bg-white p-2">
            
            <!-- Identifier Badge -->
            <div class="absolute top-1 right-1 bg-pfblue text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
              {{ sticker.identifier }}
            </div>
          </div>

          <!-- Sticker Info -->
          <div class="space-y-2">
            <!-- Status -->
            <div class="flex items-center gap-2 text-sm">
              <Icon 
                :icon="getStatusIcon(sticker.customerStickerStatusID)" 
                class="w-4 h-4"
                :class="getStatusColor(sticker.customerStickerStatusID)" />
              <span class="text-xs font-medium text-gray-700">
                {{ sticker.customerStickerStatus }}
              </span>
            </div>

            <!-- Giver Info (if it's a gift) -->
            <div 
              v-if="sticker.nickNameGave" 
              class="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm">
              
              <!-- Avatar or Initials -->
              <div class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-pfblue text-white text-xs font-bold shrink-0">
                <img 
                  v-if="sticker.avatarImage" 
                  :src="sticker.avatarImage" 
                  :alt="sticker.nickNameGave"
                  class="w-full h-full object-cover">
                <span v-else>{{ getInitials(sticker.nickNameGave) }}</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-500">De:</p>
                <p class="text-xs font-bold text-pfblue truncate">{{ sticker.nickNameGave }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Close Button -->
      <button 
        @click="close"
        class="btn w-full bg-pfblue hover:bg-pfblue/90 text-white text-lg py-3">
        ¡Entendido!
      </button>
    </div>

    <!-- Card Detail Modal -->
    <div 
      v-if="selectedCard" 
      class="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-md"
      @click="closeCardDetail">
      
      <div 
        class="bg-white rounded-2xl p-8 max-w-2xl shadow-2xl"
        @click.stop>
        
        <!-- Close Button -->
        <button 
          @click="closeCardDetail"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
          <Icon icon="mdi:close" class="w-8 h-8" />
        </button>

        <!-- Card Image -->
        <div class="flex justify-center mb-6">
          <div class="relative">
            <img 
              :src="selectedCard.resource" 
              :alt="`Sticker ${selectedCard.identifier}`"
              class="max-w-sm w-full h-auto object-contain rounded-lg shadow-lg">
            
            <!-- Identifier Badge -->
            <div class="absolute top-2 right-2 bg-pfblue text-white text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
              {{ selectedCard.identifier }}
            </div>
          </div>
        </div>

        <!-- Card Info -->
        <div class="space-y-4">
          <!-- Status -->
          <div class="flex items-center justify-center gap-2">
            <Icon 
              :icon="getStatusIcon(selectedCard.customerStickerStatusID)" 
              class="w-6 h-6"
              :class="getStatusColor(selectedCard.customerStickerStatusID)" />
            <span class="text-lg font-medium text-gray-700">
              {{ selectedCard.customerStickerStatus }}
            </span>
          </div>

          <!-- Giver Info (if it's a gift) -->
          <div 
            v-if="selectedCard.nickNameGave" 
            class="flex items-center justify-center gap-3 bg-gray-50 rounded-lg p-4">
            
            <!-- Avatar or Initials -->
            <div class="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-pfblue text-white text-sm font-bold shrink-0">
              <img 
                v-if="selectedCard.avatarImage" 
                :src="selectedCard.avatarImage" 
                :alt="selectedCard.nickNameGave"
                class="w-full h-full object-cover">
              <span v-else>{{ getInitials(selectedCard.nickNameGave) }}</span>
            </div>
            
            <div>
              <p class="text-sm text-gray-500">Regalo de:</p>
              <p class="text-lg font-bold text-pfblue">{{ selectedCard.nickNameGave }}</p>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <button 
          @click="closeCardDetail"
          class="btn w-full bg-pfblue hover:bg-pfblue/90 text-white mt-6">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useUserStore } from '../stores/user'
import type { StickerToView } from '../services/api'

const userStore = useUserStore()
const showModal = ref(false)
const stickers = ref<StickerToView[]>([])
const selectedCard = ref<StickerToView | null>(null)

// Watch for stickersToView changes
watch(() => userStore.stickersToView, (newStickers) => {
  if (newStickers && newStickers.length > 0) {
    stickers.value = newStickers
    showModal.value = true
  }
}, { immediate: true })

function openCardDetail(card: StickerToView) {
  selectedCard.value = card
}

function closeCardDetail() {
  selectedCard.value = null
}

function getInitials(name: string): string {
  if (!name) return '?'
  const words = name.trim().split(' ').filter(w => w.length > 0)
  if (words.length >= 2 && words[0]?.[0] && words[1]?.[0]) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  if (words.length > 0 && words[0]) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return '?'
}

function getStatusIcon(statusId: number): string {
  switch (statusId) {
    case 2: // Gift
      return 'mdi:gift'
    case 3: // Exchange
      return 'mdi:swap-horizontal'
    default:
      return 'mdi:star'
  }
}

function getStatusColor(statusId: number): string {
  switch (statusId) {
    case 2: // Gift
      return 'text-green-500'
    case 3: // Exchange
      return 'text-blue-500'
    default:
      return 'text-yellow-500'
  }
}

function close() {
  showModal.value = false
  // Clear the stickersToView from store
  userStore.stickersToView = []
}
</script>
