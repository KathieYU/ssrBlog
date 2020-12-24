<template>
  <div class="bg-black text-gray-300 px-4 md:px-0">
    <div class="container mx-auto">
      <div class="self-container overflow-hidden">
        <div class="flex justify-between items-center">
          <div class="h-16 flex space-x-4 items-center text-base">
            <AppLogo v-if="showLogo" class="mr-8 -mt-1" size="small" />
            <NuxtLink class="text-hover-transition" to="/">Home</NuxtLink>
            <NuxtLink class="text-hover-transition" to="/about">About</NuxtLink>
          </div>

          <div class="flex space-x-6 text-sm">
            <div class="text-hover-transition">QQ</div>
            <div class="text-hover-transition">Wechat</div>
            <AppColorSwitch />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    showLogo: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
  },
})
</script>
