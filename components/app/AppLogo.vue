<template>
  <div class="flex items-center">
    <img class="w-11 h-11" src="/logo.png" alt="Journey" />
    <p class="ml-4 text-white text-4xl tracking-widest">journey</p>
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
})
</script>
