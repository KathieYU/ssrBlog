<template>
  <div class="fixed inset-0 z-20 top-16 md:hidden">
    <div v-if="isOpen" class="absolute inset-0 z-10 bg-transparent"></div>
    <div
      v-if="isOpen"
      ref="mobileNav"
      class="absolute inset-x-0 top-0 bg-black z-20 py-4 md:hidden"
    >
      <div class="container mx-auto text-white text-center leading-10 text-lg">
        <NuxtLink class="text-hover-transition block cursor-pointer" to="/"
          >Home</NuxtLink
        >
        <NuxtLink class="text-hover-transition block cursor-pointer" to="/about"
          >About</NuxtLink
        >
        <div class="text-hover-transition">QQ</div>
        <div class="text-hover-transition">Wechat</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import Vue from 'vue'

export default Vue.extend({
  computed: {
    ...mapState({
      isOpen: 'open',
    }),
  },
})
</script>
