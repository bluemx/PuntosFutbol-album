<template>
    <div class="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:fixed top-2 left-2 z-10 right-2 bg-white p-2 rounded-lg shadow-md bg-pattern w-auto mx-auto max-w-6xl relative">
        <button @click="toggleIndex" class="btn shrink-0">
            <Icon icon="ph:list-bullets-duotone" />
            <span class="hidden md:inline">Índice</span>
        </button>
        
        <!-- Dropdown Index -->
        <div 
            v-if="showIndex" 
            class="absolute top-full left-0 right-0 mt-2 z-50 max-h-[70vh] overflow-y-auto"
        >
            <AlbumIndex @navigate="closeIndex" />
        </div>
        <div class="flex flex-wrap md:flex-nowrap gap-2 md:ml-auto justify-center md:justify-end">
          <FriendsWidget />
          <ExchangeWidget />
          <PackOpener @openRepetidas="handleOpenRepetidas" />
          <RepetidasWidget ref="repetidasWidget" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import RepetidasWidget from './RepetidasWidget.vue'
import FriendsWidget from './FriendsWidget.vue'
import ExchangeWidget from './ExchangeWidget.vue'
import PackOpener from './PackOpener.vue'
import AlbumIndex from './AlbumIndex.vue'

const repetidasWidget = ref()
const showIndex = ref(false)

function toggleIndex() {
    showIndex.value = !showIndex.value
}

function closeIndex() {
    showIndex.value = false
}

function handleOpenRepetidas() {
  // Open the Repetidas modal
  if (repetidasWidget.value && repetidasWidget.value.openModal) {
    repetidasWidget.value.openModal()
  }
}
</script>