<template>
    <div class="metal-overlay0 absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      <img
           :src="src" 
           alt="Metal!" 
           class="absolute top-0 left-0 w-full h-full object-cover grayscale mix-blend-color opacity-80"
           loading="lazy"
        />
    </div>
    <div class="metal-overlay2 absolute top-0 left-0 w-full h-full pointer-events-none z-40">
      <img
           :src="src" 
           alt="Metal!" 
           class="absolute top-0 left-0 w-full h-full object-cover grayscale"
           loading="lazy"
        />
    </div>
    <div class="metal-overlay3 absolute top-0 left-0 w-full h-full pointer-events-none z-40">
      <img
           :src="src" 
           alt="Metal!" 
           class="absolute top-0 left-0 w-full h-full object-cover grayscale"
           loading="lazy"
        />
    </div>
  <div class="metal-overlay absolute top-0 left-0 w-full h-full pointer-events-none z-50"></div>
  
  <!-- Sparkle particles -->
  <div class="sparkles-container absolute top-0 left-0 w-full h-full pointer-events-none z-51">
    <div v-for="i in 102" :key="i" 
         class="sparkle"
         :style="{
           '--delay': `${Math.random() * 3}s`,
           '--duration': `${2 + Math.random() * 2}s`,
           '--x': `${Math.random() * 100}%`,
           '--y': `${Math.random() * 100}%`
         }"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string;
}

defineProps<Props>();
</script>

<style scoped>
.metal-overlay {
  background-color: #c5b99e;
  background-image: radial-gradient(
    circle farthest-corner at top left, rgb(227, 255, 15) 0%, rgba(225, 243, 97,0) 50%),
    radial-gradient(
    circle farthest-side at top right, rgb(0, 85, 255) 0%, rgba(181, 176, 177,0) 10%),
    radial-gradient(circle farthest-corner at bottom right, rgba(204, 104, 119,1) 0%, rgba(204, 104, 119, 0) 33%),
    radial-gradient(
    circle farthest-corner at top right, rgb(48, 210, 255) 0%, rgba(155, 221, 240,0) 50%),
    radial-gradient(ellipse at bottom center, rgb(165, 0, 254) 0%, rgba(254, 43, 0, 0) 80%);

  mix-blend-mode:overlay;
  animation: metalShift 3.2s ease-in-out infinite;
  
  /* Rectangular mask - show outer border, hide center */
  -webkit-mask: linear-gradient(#fff 0 0) content-box, 
                linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);

    border:10px solid #000;
    border-bottom-color: #fff;
    border-right-color: #fff;
    border-radius: 10%;
    filter: blur(4px);

}

@keyframes metalShift {
  0% {
    border:10px solid #000;
    border-bottom-color: #fff;
    border-right-color: #fff;
    opacity:0;
    background-image: radial-gradient(
      circle farthest-corner at top left, rgb(227, 255, 15) 0%, rgba(225, 243, 97,0) 50%),
      radial-gradient(
      circle farthest-side at top right, rgb(0, 85, 255) 0%, rgba(181, 176, 177,0) 10%),
      radial-gradient(circle farthest-corner at bottom right, rgba(204, 104, 119,1) 0%, rgba(204, 104, 119, 0) 33%),
      radial-gradient(
      circle farthest-corner at top right, rgb(48, 210, 255) 0%, rgba(155, 221, 240,0) 50%),
      radial-gradient(ellipse at bottom center, rgb(165, 0, 254) 0%, rgba(254, 43, 0, 0) 80%);
  }
  25% {
    border-width: 4px;
    opacity:0.5;
    background-image: radial-gradient(
      circle farthest-corner at top left, rgb(227, 255, 15) 0%, rgba(225, 243, 97,0) 50%),
      radial-gradient(
      circle farthest-side at top right, rgb(0, 85, 255) 0%, rgba(181, 176, 177,0) 10%),
      radial-gradient(circle farthest-corner at bottom right, rgba(204, 104, 119,1) 0%, rgba(204, 104, 119, 0) 33%),
      radial-gradient(
      circle farthest-corner at top right, rgb(48, 210, 255) 0%, rgba(155, 221, 240,0) 50%),
      radial-gradient(ellipse at bottom center, rgb(165, 0, 254) 0%, rgba(254, 43, 0, 0) 80%);
  }
  50% {
    border-width: 10px;
    opacity:0;
    background-image: radial-gradient(
      circle farthest-corner at top left, rgb(227, 255, 15) 0%, rgba(225, 243, 97,0) 50%),
      radial-gradient(
      circle farthest-side at top right, rgb(0, 85, 255) 0%, rgba(181, 176, 177,0) 10%),
      radial-gradient(circle farthest-corner at bottom right, rgba(204, 104, 119,1) 0%, rgba(204, 104, 119, 0) 33%),
      radial-gradient(
      circle farthest-corner at top right, rgb(48, 210, 255) 0%, rgba(155, 221, 240,0) 50%),
      radial-gradient(ellipse at bottom center, rgb(165, 0, 254) 0%, rgba(254, 43, 0, 0) 80%);
  }
  
  51% {
    border:10px dashed #000;
    border-top-color: #fff;
    border-right-color: #fff;
    opacity:0;
    background-image: radial-gradient(
      circle farthest-corner at bottom right, rgb(200, 150, 255) 0%, rgba(200, 150, 255,0) 50%),
      radial-gradient(
      circle farthest-side at bottom right, rgb(255, 200, 50) 0%, rgba(255, 200, 50,0) 10%),
      radial-gradient(circle farthest-corner at top left, rgba(100, 200, 255,1) 0%, rgba(100, 200, 255, 0) 33%),
      radial-gradient(
      circle farthest-corner at top left, rgb(255, 100, 150) 0%, rgba(255, 100, 150,0) 50%),
      radial-gradient(ellipse at center left, rgb(150, 255, 100) 0%, rgba(150, 255, 100, 0) 80%);
  }

  75% {
     border-width: 4px;
    opacity:0.5;
    background-image: radial-gradient(
      circle farthest-corner at bottom right, rgb(200, 150, 255) 0%, rgba(200, 150, 255,0) 50%),
      radial-gradient(
      circle farthest-side at bottom right, rgb(255, 200, 50) 0%, rgba(255, 200, 50,0) 10%),
      radial-gradient(circle farthest-corner at top left, rgba(100, 200, 255,1) 0%, rgba(100, 200, 255, 0) 33%),
      radial-gradient(
      circle farthest-corner at top left, rgb(255, 100, 150) 0%, rgba(255, 100, 150,0) 50%),
      radial-gradient(ellipse at center left, rgb(150, 255, 100) 0%, rgba(150, 255, 100, 0) 80%);
  }

  100% {
     border-width: 10px;
    opacity:0;
    background-image: radial-gradient(
      circle farthest-corner at bottom right, rgb(200, 150, 255) 0%, rgba(200, 150, 255,0) 50%),
      radial-gradient(
      circle farthest-side at bottom right, rgb(255, 200, 50) 0%, rgba(255, 200, 50,0) 10%),
      radial-gradient(circle farthest-corner at top left, rgba(100, 200, 255,1) 0%, rgba(100, 200, 255, 0) 33%),
      radial-gradient(
      circle farthest-corner at top left, rgb(255, 100, 150) 0%, rgba(255, 100, 150,0) 50%),
      radial-gradient(ellipse at center left, rgb(150, 255, 100) 0%, rgba(150, 255, 100, 0) 80%);
  }
}

.metal-overlay2{
    mix-blend-mode:hard-light;
    mask-image: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 0%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 200% 80%;
  mask-size: 200% 80%;
  -webkit-mask-position: 0% 0%;
  mask-position: 0% 0%;
animation: overlaySweep 2.1s linear infinite;
    
}


.metal-overlay3{
    mix-blend-mode:color-dodge;
    mask-image: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 0%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 200% 80%;
  mask-size: 200% 80%;
  -webkit-mask-position: 0% 0%;
  mask-position: 0% 0%;
    animation: overlaySweep3 2.1s linear infinite;
}

@keyframes overlaySweep {
  0%   { -webkit-mask-position: 0% -600%;    mask-position: 0% -600%; transform:translate(-3%); }
  100%  { -webkit-mask-position: 100% 600%;  mask-position: 100% 600%; transform:translate(3%); }
}

@keyframes overlaySweep3 {
  0%   { -webkit-mask-position: 0% 600%;    mask-position: 0% 600%; transform:translate(3%); }
  100%  { -webkit-mask-position: 100% -600%;  mask-position: 100% -600%; transform:translate(-3%); }
}

.sparkles-container {
  overflow: hidden;
}

.sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.8);
  left: var(--x);
  top: var(--y);
  opacity: 0;
  animation: sparkle var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.5);
  }
}

</style>
