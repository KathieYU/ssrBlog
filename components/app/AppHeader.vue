<template>
  <div class="fixed w-full top-0 z-40 border-b bg-white">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="lg:w-1/5 flex items-center pr-4">
          <NuxtLink to="/" class="flex-shrink-0">
            <!-- <img src="/logo.png" alt="logo" /> -->
            <span class="tracking-widest text-3xl italic">Journey</span>
          </NuxtLink>
        </div>
        <div class="flex-grow"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppHeader',
  data() {
    return {
      scrolled: false,
    }
  },
})
</script>
