<template>
  <!-- Left Page Navigation (even pages - left side of book) -->
  <template v-if="isLeftPage && showPrevious">
    <button 
      @click="goToPreviousPage"
      class="absolute top-4 left-4 z-20 bg-white/80 hover:bg-white text-pfblue rounded-full p-2 shadow-lg transition-all hover:scale-110">
      <Icon icon="mdi:chevron-left" class="w-6 h-6" />
    </button>
    <button 
      @click="goToPreviousPage"
      class="absolute bottom-20 left-4 z-20 bg-white/80 hover:bg-white text-pfblue rounded-full p-2 shadow-lg transition-all hover:scale-110">
      <Icon icon="mdi:chevron-left" class="w-6 h-6" />
    </button>
  </template>

  <!-- Right Page Navigation (odd pages - right side of book) -->
  <template v-if="!isLeftPage && showNext">
    <button 
      @click="goToNextPage"
      class="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-pfblue rounded-full p-2 shadow-lg transition-all hover:scale-110">
      <Icon icon="mdi:chevron-right" class="w-6 h-6" />
    </button>
    <button 
      @click="goToNextPage"
      class="absolute bottom-20 right-4 z-20 bg-white/80 hover:bg-white text-pfblue rounded-full p-2 shadow-lg transition-all hover:scale-110">
      <Icon icon="mdi:chevron-right" class="w-6 h-6" />
    </button>
  </template>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { Icon } from '@iconify/vue'
import { useAlbumStore } from '../stores/album'

interface Props {
  pageNumber: number  // Physical page number (0-based, including covers)
}

const props = defineProps<Props>()
const albumStore = useAlbumStore()

// Inject the toPage function from parent
const toPage = inject<(pageNumber: number) => void>('toPage')

// Determine if this is a left or right page
// In a book spread, even pages are on the left, odd pages are on the right
const isLeftPage = computed(() => {
  return props.pageNumber % 2 === 0
})

// Check if we can go to previous page
const showPrevious = computed(() => {
  return props.pageNumber > 0
})

// Check if we can go to next page
const showNext = computed(() => {
  return props.pageNumber < albumStore.totalPhysicalPages - 1
})

// Navigation functions using the page flip instance
const goToNextPage = () => {
  if (!toPage) return
  toPage(props.pageNumber + 1)
}

const goToPreviousPage = () => {
  if (!toPage) return
  toPage(props.pageNumber - 1)
}
</script>
