<template>
  <!-- Desktop: Left/Right arrows based on page side -->
  <!-- Mobile (≤580px): All 4 arrows on all pages except cover (-1) and back cover (totalPages + 1) -->
  
  <!-- Cover page (-1): Only right arrows (desktop and mobile) -->
  <template v-if="props.thisPage === -1">
    <button 
      @click="goToNextPage"
      class="page-arrow page-arrow-top-right absolute top-2 right-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer">
      <Icon icon="mdi:arrow-right-top-bold" class="w-6 h-6" />
    </button>
    <button 
      @click="goToNextPage"
      class="page-arrow page-arrow-bottom-right absolute bottom-2 right-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer">
      <Icon icon="mdi:arrow-right-bottom-bold" class="w-6 h-6" />
    </button>
  </template>

  <!-- Back cover page (totalPages + 1): Only left arrows (desktop and mobile) -->
  <template v-else-if="isBackCoverPage">
    <button 
      @click="goToPreviousPage"
      class="page-arrow page-arrow-top-left absolute top-2 left-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer">
      <Icon icon="mdi:arrow-left-top-bold" class="w-6 h-6" />
    </button>
    <button 
      @click="goToPreviousPage"
      class="page-arrow page-arrow-bottom-left absolute bottom-2 left-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer">
      <Icon icon="mdi:arrow-left-bottom-bold" class="w-6 h-6" />
    </button>
  </template>

  <!-- Regular pages: Desktop shows left/right based on page, Mobile shows all 4 -->
  <template v-else>
    <!-- Left arrows (always on mobile, only on even pages for desktop) -->
    <button 
      @click="goToPreviousPage"
      class="page-arrow page-arrow-top-left absolute top-2 left-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer"
      :class="{ 'mobile-show-all': !isLeftPage, 'desktop-hide-first': isFirstContentPage }">
      <Icon icon="mdi:arrow-left-top-bold" class="w-6 h-6" />
    </button>
    <button 
      @click="goToPreviousPage"
      class="page-arrow page-arrow-bottom-left absolute bottom-2 left-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer"
      :class="{ 'mobile-show-all': !isLeftPage, 'desktop-hide-first': isFirstContentPage }">
      <Icon icon="mdi:arrow-left-bottom-bold" class="w-6 h-6" />
    </button>

    <!-- Right arrows (always on mobile, only on odd pages for desktop) -->
    <button 
      @click="goToNextPage"
      class="page-arrow page-arrow-top-right absolute top-2 right-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer"
      :class="{ 'mobile-show-all': isLeftPage }">
      <Icon icon="mdi:arrow-right-top-bold" class="w-6 h-6" />
    </button>
    <button 
      @click="goToNextPage"
      class="page-arrow page-arrow-bottom-right absolute bottom-2 right-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer"
      :class="{ 'mobile-show-all': isLeftPage }">
      <Icon icon="mdi:arrow-right-bottom-bold" class="w-6 h-6" />
    </button>
  </template>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  thisPage?: number
  isFirstContentPage: boolean
  totalPages?: number
}

const props = defineProps<Props>()

// Inject the toPage function from parent
const toPage = inject<(pageNumber: number) => void>('toPage')

// Determine if this is a left or right page
// In a book spread, even pages are on the left, odd pages are on the right
const isLeftPage = computed(() => {
  if (props.thisPage === undefined || props.thisPage === null) return false
  return props.thisPage % 2 === 0
})

// Check if this is the back cover page
const isBackCoverPage = computed(() => {
  if (props.totalPages === undefined) return false
  return props.thisPage === props.totalPages + 1
})

// Navigation functions using the page flip instance
const goToNextPage = () => {
  if (!toPage) return
  const currentPhysicalPage = (props.thisPage ?? 0) + 1 // +1 because physical pages include covers
  const nextPhysicalPage = currentPhysicalPage + 1
  toPage(nextPhysicalPage)
}

const goToPreviousPage = () => {
  if (!toPage) return
  const currentPhysicalPage = (props.thisPage ?? 0) + 1 // +1 because physical pages include covers
  const prevPhysicalPage = currentPhysicalPage - 1
  toPage(prevPhysicalPage)
}
</script>

<style scoped>
/* Desktop: Hide arrows that shouldn't show on left/right pages */
@media (min-width: 581px) {
  .mobile-show-all {
    display: none;
  }
  
  .desktop-hide-first {
    display: none;
  }
}

/* Mobile: Position arrows in four corners and show all (580px and below) */
@media (max-width: 580px) {
  .page-arrow-top-left {
    top: 0.5rem;
    left: 0.5rem;
  }
  
  .page-arrow-bottom-left {
    bottom: 0.5rem;
    left: 0.5rem;
  }
  
  .page-arrow-top-right {
    top: 0.5rem;
    right: 0.5rem;
  }
  
  .page-arrow-bottom-right {
    bottom: 0.5rem;
    right: 0.5rem;
  }
  
  /* Show all arrows on mobile */
  .mobile-show-all {
    display: block;
  }
}
</style>
