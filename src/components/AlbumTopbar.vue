<template>
    <div class="flex items-center gap-2 md:fixed top-1 left-1 z-10 right-1 bg-white p-2 rounded-lg shadow-md bg-pattern w-full md:w-auto">
        <PackOpener @openRepetidas="handleOpenRepetidas" />
        <RepetidasWidget ref="repetidasWidget" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RepetidasWidget from './RepetidasWidget.vue';
import PackOpener from './PackOpener.vue';

const repetidasWidget = ref()

function handleOpenRepetidas() {
  // Open the Repetidas modal
  if (repetidasWidget.value && repetidasWidget.value.openModal) {
    repetidasWidget.value.openModal()
  }
}
</script>