<template>
  <div>
    <!-- Trigger Button -->
    <button 
      @click="showModal = true"
      :disabled="userStore.envelopes <= 0"
      class="btn btn-primary w-full"
      :class="{ 'opacity-50 cursor-not-allowed': userStore.envelopes <= 0 }">
      <Icon icon="mdi:package-variant" class="w-4 h-4 mr-2" />
      Abrir Sobres ({{ userStore.envelopes }})

    </button>

    <!-- Modal -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      @click="close">
      
      <div 
        class="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl"
        @click.stop>
        
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-pfblue">Abrir Sobres</h2>
          <button 
            @click="close"
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>

        <!-- Pack Opening Section -->
        <div v-if="!openedCards.length && userStore.envelopes > 0" class="text-center py-8">
          <div class="mb-6">
            <Icon icon="mdi:package-variant" class="w-24 h-24 mx-auto text-pfblue mb-4" />
            <p class="text-lg text-gray-700 mb-2">Tienes {{ userStore.envelopes }} sobres disponibles</p>
            <p class="text-sm text-gray-500">¡Haz clic para abrir un sobre y descubrir nuevas cartas!</p>
          </div>
          
          <button 
            @click="handleOpenPack"
            :disabled="isOpening"
            class="btn btn-primary btn-lg"
            :class="{ 'opacity-50 cursor-not-allowed': isOpening }">
            <Icon v-if="isOpening" icon="mdi:loading" class="w-5 h-5 mr-2 animate-spin" />
            <Icon v-else icon="mdi:package-variant-closed" class="w-5 h-5 mr-2" />
            {{ isOpening ? 'Abriendo...' : 'Abrir Sobre' }}
          </button>
        </div>

        <!-- Opened Cards Display -->
        <div v-if="openedCards.length > 0" class="text-center">
          <h3 class="text-xl font-bold text-pfblue mb-4">¡Cartas obtenidas!</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div 
              v-for="card in openedCards" 
              :key="card.id"
              class="relative group animate-fadeIn">
              
              <CardRenderer
               :iscard="true" 
                :identifier="getCardIdentifier(card.resource)"  
                :base="card.resource" 
                ></CardRenderer>

              <!-- New Card Badge -->
              <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                ¡Nueva!
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 justify-center">
            <button 
              @click="goToRepetidas"
              class="btn btn-success">
              <Icon icon="mdi:star-plus" class="w-4 h-4 mr-2" />
              Colocar en Álbum
            </button>
            <button 
              v-if="userStore.envelopes > 0"
              @click="resetAndOpenAnother"
              class="btn btn-primary">
              <Icon icon="mdi:package-variant-closed" class="w-4 h-4 mr-2" />
              Abrir Otro ({{ userStore.envelopes }})
            </button>
            <button 
              @click="close"
              class="btn btn-secondary">
              Cerrar
            </button>
          </div>
        </div>

        <!-- No Envelopes State -->
        <div v-if="userStore.envelopes <= 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <Icon icon="mdi:package-variant-remove" class="w-16 h-16 mx-auto" />
          </div>
          <p class="text-gray-600">No tienes sobres disponibles</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { Icon } from '@iconify/vue'
import CardRenderer from './CardRenderer.vue'
import type { UserCard } from '../stores/user'
import { useNewlyOpenedCards } from '../composables/useNewlyOpenedCards'

const emit = defineEmits<{
  openRepetidas: []
}>()

const userStore = useUserStore()
const showModal = ref(false)
const isOpening = ref(false)
const openedCards = ref<UserCard[]>([])
const { addNewlyOpenedCards } = useNewlyOpenedCards()


// Extract identifier from resource URL (get the number from filename)
function getCardIdentifier(resourceUrl: string): number {
  const match = resourceUrl.match(/(\d+)\.webp$/)
  return match && match[1] ? parseInt(match[1]) : 0
}

async function handleOpenPack() {
  if (isOpening.value || userStore.envelopes <= 0) return
  
  try {
    isOpening.value = true
    const newCards = await userStore.openPack()
    if (newCards && newCards.length > 0) {
      openedCards.value = newCards
      // Track the newly opened cards
      const cardIds = newCards.map(card => card.id)
      addNewlyOpenedCards(cardIds)
    }
  } catch (error) {
    console.error('Failed to open pack:', error)
    // TODO: Show error message to user
  } finally {
    isOpening.value = false
  }
}

function resetAndOpenAnother() {
  openedCards.value = []
  handleOpenPack()
}

function goToRepetidas() {
  close()
  emit('openRepetidas')
}

function close() {
  showModal.value = false
  openedCards.value = []
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}
</style>