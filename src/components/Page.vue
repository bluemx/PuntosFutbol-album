<template>
    <div class="page relative innerpage card p-0 overflow-hidden" >
        <div class="page-content flex flex-col h-full  " :style="bgStyle('/pages/page'+thisPage+'.webp')">
            
            <h2 v-if="categoryName" class="badge mx-auto pt-1 -mt-1 bg-blue-500">{{ categoryName }}</h2>
            
            <div class="flex flex-wrap justify-center items-between gap-3 grow-2 p-2" >
                <div v-for="card in pageCards" :key="card.identifier" class="flex justify-center items-center flex-col"  :class="card.disposition === 'Horizontal' ? ' w-1/4' : '  w-1/5'">
                    <!-- Show CardView if user owns the card, otherwise show placeholder -->
                    <CardView v-if="userStore.ownsCard(card.identifier)" :cardId="card.identifier" />
                    
                    <!-- Placeholder for unowned cards -->
                    <div 
                        v-else
                        class=" relative card-slot border w-full grow-0 shrink-0 border-dashed border-blue-500/50 bg-black/20 p-2 rounded-[6%] flex flex-col justify-center items-center text-center text-white "
                        :class="card.disposition === 'Horizontal' ? 'aspect-5/4' : 'aspect-4/5'"
                    >
                        <div class="font-bold text-md md:text-xl bg-linear-to-br from-blue-200 to-cyan-500 text-transparent bg-clip-text ">{{ card.identifier.toString().padStart(3, '0') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getPageInfo } from '../utils/pageDistribution'
import { useUserStore } from '../stores/user'
import CardView from './CardView.vue'

interface Props {
  thisPage?: number;
}

const props = defineProps<Props>();
const userStore = useUserStore()

const categoryName = computed(() => {
  if (!props.thisPage) return null
  const info = getPageInfo(props.thisPage)
  return info?.categoryName || null
})

const pageCards = computed(() => {
  if (!props.thisPage) return []
  const info = getPageInfo(props.thisPage)
  return info?.cards || []
})




function bgStyle(url: string) {
    return url ? {
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    } : {};
}

</script>