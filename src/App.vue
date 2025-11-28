
<template>
  <div class="min-h-screen w-full">

    <!-- Loading/Setup Phase -->
    <UserLoader v-if="!isReady" @ready="handleUserReady" />
    
    <!-- Main Album Interface -->
    <div v-else class="min-h-screen w-full flex flex-col overflow-auto gap-2 p-2 md:p-0 items-center justify-center bg-center bg-cover" :style="{ backgroundImage: `url(${mainbg})` }">
      
      <AlbumTopbar />
      <!-- Album Components -->
      <AlbumPages />
      <AlbumNavigation />
      
      <!-- Welcome News Modal -->
      <WelcomeNewsModal />
      
      <!-- Exchange Matches Modal -->
      <ExchangeMatchesModal />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AlbumPages from './components/AlbumPages.vue'
import AlbumNavigation from './components/AlbumNavigation.vue'
import AlbumTopbar from './components/AlbumTopbar.vue'
import UserLoader from './components/UserLoader.vue'
import WelcomeNewsModal from './components/WelcomeNewsModal.vue'
import ExchangeMatchesModal from './components/ExchangeMatchesModal.vue'
import mainbg from '/mainbg.webp'

// State
const isReady = ref(false)

// Methods
const handleUserReady = () => {
  console.log('✅ User data loaded, showing album interface')
  isReady.value = true
}

// Send iframe size to parent window
const sendSizeToParent = () => {
  const appElement = document.getElementById('app')
  const height = appElement ? appElement.scrollHeight : window.innerHeight
  
  const message = {
    type: 'iframeSize',
    width: window.innerWidth,
    height: height
  }
  console.log('📏 Sending size to parent:', message)
  
  // Always send, even if not in iframe (for testing)
  if (window.parent) {
    window.parent.postMessage(message, '*')
  }
}

// Setup resize listener and continuous monitoring
onMounted(() => {
  // Send initial size immediately
  sendSizeToParent()
  
  // Send size after a short delay to catch any rendering changes
  setTimeout(sendSizeToParent, 100)
  setTimeout(sendSizeToParent, 500)
  setTimeout(sendSizeToParent, 1000)
  
  // Listen for resize events
  window.addEventListener('resize', sendSizeToParent)
  
  // Listen for load event
  window.addEventListener('load', sendSizeToParent)
  
  // Use ResizeObserver to detect any DOM changes that affect size
  const resizeObserver = new ResizeObserver(() => {
    sendSizeToParent()
  })
  resizeObserver.observe(document.body)
  
  // Store observer for cleanup
  ;(window as any)._sizeObserver = resizeObserver
})

onUnmounted(() => {
  window.removeEventListener('resize', sendSizeToParent)
  window.removeEventListener('load', sendSizeToParent)
  if ((window as any)._sizeObserver) {
    ;(window as any)._sizeObserver.disconnect()
  }
})
</script>

<style scoped>
/* Basecoat CSS and Tailwind handle all styling */
</style>
