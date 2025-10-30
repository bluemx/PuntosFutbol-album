<template>
<div class="md:absolute top-0 bottom-0 right-1/2 left-0 w-full md:w-1/2 h-full p-0 flex flex-col items-center justify-center gap-8 ">
    <div>
        <img class="size-40 -mb-4 shrink-0 object-cover rounded-full border-8 border-blue-500 mx-auto" alt="@hunvreus" :src="userStore.avatar">
        <div class="badge bg-blue-500">
            <strong>{{ userStore.name }}</strong>
        </div>
    </div>
    <UserCollection />
</div>

</template>


<script setup lang="ts">
import { useUserStore } from '../stores/user'
import UserCollection from './UserCollection.vue';

const userStore = useUserStore();

</script>