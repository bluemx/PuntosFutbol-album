<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-900 text-white">
    <!-- Waiting for Customer ID -->
    <div v-if="!customerIdReceived" class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
      <h2 class="text-2xl font-bold mb-2">Esperando información...</h2>
      <p class="text-blue-200">Conectando con el sistema...</p>
    </div>

    <!-- Loading State -->
    <div v-else-if="userStore.isLoading" class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
      <h2 class="text-2xl font-bold mb-2">Cargando tu álbum...</h2>
      <p class="text-blue-200">Obteniendo tu colección de estampas...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="userStore.error" class="text-center max-w-md">
      <div class="text-6xl mb-4">❌</div>
      <h2 class="text-2xl font-bold mb-2">Ocurrió un error al cargar el contenido</h2>
      <p class="text-red-200 mb-6">{{ userStore.error }}</p>
      <button
        @click="retryLoad"
        class="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>

    <!-- Success State -->
    <div v-else-if="userStore.isLoggedIn" class="text-center">
      <h2 class="text-3xl font-bold mb-4">Bienvenido a tu álbum</h2>
      <img src="/logow-anim.svg" class="w-40 mx-auto" />
      
      <div class="bg-white/10 rounded-lg p-6 mb-6 backdrop-blur-sm mt-10">
        <div class="text-sm text-blue-200">Cuentas con {{ userStore.totalOwnedCards }} de {{ cardsDatabase.length }} estampas</div>
      </div>

      <button
        @click="continueToAlbum"
        class="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
      >
        Abrir Álbum
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { cardsDatabase } from '../data/cards';

const emit = defineEmits<{
  ready: []
}>()

const userStore = useUserStore()

const customerIdReceived = ref(false)
let customerId = ''

const loadUserData = async () => {
  try {
    await userStore.loadUserData(customerId)
  } catch (error) {
    console.error('Failed to load user data:', error)
  }
}

const retryLoad = () => {
  loadUserData()
}

const continueToAlbum = () => {
  emit('ready')
}

// Check for customer ID in URL hash
const checkUrlForCustomerId = () => {
  const hash = window.location.hash
  if (hash) {
    const match = hash.match(/ci=([^&]+)/)
    if (match && match[1]) {
      customerId = match[1]
      customerIdReceived.value = true
      console.log('✅ Customer ID found in URL:', customerId)
      loadUserData()
      return true
    }
  }
  return false
}

// Handle postMessage from parent window
const handleMessage = (event: MessageEvent) => {
  console.log('📨 Received postMessage:', event.data)
  
  if (event.data && event.data.type === 'customerID') {
    customerId = event.data.customerID
    customerIdReceived.value = true
    console.log('✅ Received customer ID from parent:', customerId)
    loadUserData()
  }
}

onMounted(() => {
  // First, check URL hash for customer ID
  const foundInUrl = checkUrlForCustomerId()
  
  if (!foundInUrl) {
    // If not in URL, listen for postMessage from parent
    window.addEventListener('message', handleMessage)
    console.log('👂 Listening for customerID postMessage from parent...')
    
    // Send ready signal to parent
    if (window.parent) {
      window.parent.postMessage({ type: 'iframeReady' }, '*')
      console.log('📤 Sent iframeReady message to parent')
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped>
.btn {
  transition: all 0.2s;
  transform: scale(1);
}

.btn:hover {
  transform: scale(1.05);
}

.btn:active {
  transform: scale(0.95);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>