<template>
<div v-if="!albumStore.isLandscape || albumStore.currentPage === 0" class="md:absolute top-0 bottom-0 right-1/2 left-0 w-full md:w-1/2 h-full p-0 flex flex-col items-center justify-center gap-8 z-1">
    <div>
        <div class="card rounded-full aspect-square p-0 h-fit w-fit mx-auto flex justify-center items-center">
            <img class="size-40 aspect-square  shrink-0 object-cover rounded-full  mx-auto" alt="@hunvreus" :src="userStore.avatar">
        </div>
        <div class="card py-1 px-2 bg-pattern">
            <strong>{{ userStore.name }}</strong>
        </div>
    </div>

    <UserCollection  />
</div>

</template>


<script setup lang="ts">
import { useUserStore } from '../stores/user'
import { useAlbumStore } from '../stores/album'
import UserCollection from './UserCollection.vue';

const userStore = useUserStore();
const albumStore = useAlbumStore();

</script>