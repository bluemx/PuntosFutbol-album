<template>
    <div class=" w-10/12 mx-auto text-white text-center">

    <!-- Category Progress -->
      <h3 class="text-lg font-semibold mb-4">Tienes <span class=" text-blue-600 badge bg-white text-lg font-semibold">{{ userStore.totalOwnedCards }} stickers </span> en tu álbum</h3>
      <div class="grid grid-cols-3 gap-2">
        <div 
          v-for="category in categoryProgress" 
          :key="category.id"
          class=" p-1"
        >
          <div class="flex justify-between items-center  mb-1 badge">
            <span class="text-xs">{{ category.name }}</span>
            <span class="text-xs opacity-50">{{ category.ownedCount }}/{{ category.totalCount }}</span>
          </div>
          <!--
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: category.percentage + '%' }"
            ></div>
          </div>
          -->
        </div>
        </div>

      <!-- Call to Action Button -->
      <div class="mt-8 mb-4">
        <a 
          href="https://puntosfutbol.com/" 
          target="_blank"
          rel="noopener noreferrer"
          class="buy-packs-btn group inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl relative overflow-hidden">
          
          <!-- Animated background gradient -->
          <div class="absolute inset-0 bg-linear-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-size-200 animate-gradient"></div>
          
          <!-- Shine effect -->
          <div class="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-30 animate-shine"></div>
          
          <!-- Glow effect -->
          <div class="absolute inset-0 blur-xl bg-yellow-400 opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
          
          <!-- Content -->
          <div class="relative flex items-center gap-3">
            <svg class="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            </svg>
            <span class="drop-shadow-lg">Adquiere más sobres</span>
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </div>
        </a>
      </div>
      
    
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/user'


import { cardsDatabase } from '../data/cards'
import { categoriesDatabase } from '../data/categories'

const userStore = useUserStore()




const categoryProgress = computed(() => {
  return categoriesDatabase.map(category => {
    const categoryCards = cardsDatabase.filter(card => card.category === category.id)
    const ownedInCategory = categoryCards.filter(card => userStore.ownsCard(card.identifier))
    
    return {
      id: category.id,
      name: category.name,
      totalCount: categoryCards.length,
      ownedCount: ownedInCategory.length,
      percentage: categoryCards.length > 0 ? (ownedInCategory.length / categoryCards.length) * 100 : 0
    }
  })
})




</script>

<style scoped>
.btn {
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
}

/* Buy Packs Button Styles */
.buy-packs-btn {
  position: relative;
  z-index: 1;
}

/* Animated gradient background */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

/* Shine effect */
@keyframes shine {
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
}

.animate-shine {
  animation: shine 3s ease-in-out infinite;
}

/* Pulse glow effect */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.buy-packs-btn:hover .blur-xl {
  animation: pulse-glow 2s ease-in-out infinite;
}
</style>