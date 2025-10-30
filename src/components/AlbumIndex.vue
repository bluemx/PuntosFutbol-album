<template>
<div class="card p-0.5 md:p-6 overflow-auto max-h-full ring">
    <h2 class="text-2xl font-bold mb-2 text-center">Secciones</h2>
    
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-md">
        <template v-for="category in categoryDistribution">
            <button class="btn-outline" @click="navigateToCategory(category.categoryId)">{{ category.categoryName }}</button>
        </template>
    </div>
    
</div>
</template>

<script setup lang="ts">
import { useAlbumStore } from '../stores/album';
import { computed } from 'vue';

const albumStore = useAlbumStore();

// Get category distribution for the buttons
const categoryDistribution = computed(() => albumStore.categoryDistribution);



// Navigation function to go to a specific category
const navigateToCategory = (categoryId: number) => {
  const categoryPages = albumStore.getCategoryPages(categoryId);
  if (categoryPages && categoryPages.pages.length > 0) {
    // Navigate to the first page of this category
    const firstPageOfCategory = categoryPages.startPage;
    albumStore.goToPage(firstPageOfCategory); // -1 because store uses 0-indexed pages
    
    console.log(`Navigated to ${categoryPages.categoryName} (page ${firstPageOfCategory})`);
  }
};



</script>