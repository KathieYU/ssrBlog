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
      const w = this.size === 'small' ? 'w-8' : 'w-11'
      const h = this.size === 'small' ? 'w-8' : 'w-11'

      return {
        [w]: true,
        [h]: true,
      }
    },
    pSizeClass() {
      const fontSize = this.size === 'small' ? 'text-3xl' : 'text-4xl'
      const tracking =
        this.size === 'small' ? 'tracking-normal' : 'tracking-widest'

      return {
        'ml-4': true,
        [fontSize]: true,
        [tracking]: true,
        'text-white': true,
      }
    },
  },
})
</script>
