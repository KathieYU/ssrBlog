<template>
  <div class="flex items-center">
    <img :class="imageSizeClass" src="/logo.png" alt="Journey" />
    <p :class="pSizeClass">journey</p>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  name: 'AppLogo',
  props: {
    size: {
      type: String,
      default: 'default',
    } as PropOptions<String>,
  },
  computed: {
    imageSizeClass() {
      const size = this.size === 'small' ? 7 : 11

      return {
        [`w-${size}`]: true,
        [`h-${size}`]: true,
      }
    },
    pSizeClass() {
      const ml = this.size === 'small' ? 'ml-1' : 'ml-4'
      const fontSize = this.size === 'small' ? 'text-2xl' : 'text-4xl'
      const tracking =
        this.size === 'small' ? 'tracking-normal' : 'tracking-widest'

      return {
        [ml]: true,
        [fontSize]: true,
        [tracking]: true,
        'text-white': true,
      }
    },
  },
})
</script>
