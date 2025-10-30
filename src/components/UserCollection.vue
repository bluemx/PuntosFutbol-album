<template>
    <div class=" w-10/12 mx-auto">

    <!-- Category Progress -->
      <h3 class="text-lg font-semibold mb-4">Tu progreso (<span class="font-bold text-sm text-blue-600">{{ userStore.totalOwnedCards }} tarjetas </span>)</h3>
      <div class="grid grid-cols-3 gap-2">
        <div 
          v-for="category in categoryProgress" 
          :key="category.id"
          class=" p-1"
        >
          <div class="flex justify-between items-center  mb-1">
            <span class="text-xs">{{ category.name }}</span>
            <span class="text-xs opacity-50">{{ category.ownedCount }}/{{ category.totalCount }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: category.percentage + '%' }"
            ></div>
          </div>
        </div>
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
</style>