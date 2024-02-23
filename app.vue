<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk?: string) => {
    return titleChunk ? `${titleChunk} - REPORT` : 'REPORT';
  },
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&family=Protest+Riot&family=Sarabun:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
    }
  ],
});

const isMobile = ref(false)

onMounted(() => {
  window.addEventListener('resize', () => checkWindowSize());
})

function checkWindowSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width <= 768 && height <= 1024) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
}

provide('isMobile', isMobile);
</script>
<template>
  <ClientOnly>
    <Toaster richColors position="top-right" />
  </ClientOnly>
  <NuxtLayout :onload="checkWindowSize()">
    <NuxtPage class="w-full" />
  </NuxtLayout>
</template>
<style>
* {
  font-family: "IBM Plex Sans Thai", sans-serif;
}
</style>
