<template>
  <!-- Left Page Navigation (even pages - left side of book) -->
  <template v-if="isLeftPage && !isFirstContentPage">
    <button 
      @click="goToPreviousPage"
      class="absolute top-2 left-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer">
      <Icon icon="mdi:arrow-left-top-bold" class="w-6 h-6" />
    </button>
    <button 
      @click="goToPreviousPage"
      class="absolute bottom-2 left-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer">
      <Icon icon="mdi:arrow-left-bottom-bold" class="w-6 h-6" />
    </button>
  </template>

  <!-- Right Page Navigation (odd pages - right side of book) -->
  <template v-if="!isLeftPage">
    <button 
      @click="goToNextPage"
      class="absolute top-2 right-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer">
      <Icon icon="mdi:arrow-right-top-bold" class="w-6 h-6" />
    </button>
    <button 
      @click="goToNextPage"
      class="absolute bottom-2 right-1 z-20 text-white hover:text-pfcyan hover:scale-110 cursor-pointer">
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
