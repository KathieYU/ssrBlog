<template>
  <span class="inline-flex">
    <button
      class="rounded-md focus:outline-none text-hover-transition"
      aria-label="Color Mode"
      @click="
        $colorMode.value === 'dark'
          ? ($colorMode.preference = 'light')
          : ($colorMode.preference = 'dark')
      "
    >
      <client-only>
        <IconSun v-if="$colorMode.value === 'light'" class="w-7 h-7" />
        <IconMoon v-else class="w-7 h-7" />
      </client-only>
    </button>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppColorSwitch',
})
</script>
