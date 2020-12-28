<template>
  <div class="bg-black text-white px-4 md:px-0">
    <div class="container mx-auto">
      <div class="self-container overflow-hidden">
        <div class="flex justify-between items-center">
          <div class="h-16 flex space-x-4 items-center text-base">
            <AppLogo v-if="showLogo" class="mr-8 -mt-1" size="small" />
            <NuxtLink class="text-hover-transition hidden md:block" to="/"
              >Home</NuxtLink
            >
            <NuxtLink class="text-hover-transition hidden md:block" to="/about"
              >About</NuxtLink
            >
          </div>

          <div class="space-x-4 md:space-x-6 text-sm flex items-center">
            <div class="text-hover-transition hidden md:block text-base">
              QQ
            </div>
            <div class="text-hover-transition hidden md:block .text-base">
              Wechat
            </div>
            <div class="block md:hidden" @click="toggle">
              <IconCategory
                v-if="!isOpen"
                class="w-7 h-7 font-bold cursor-pointer"
              />
              <IconDelete v-else class="w-7 h-7 font-bold cursor-pointer" />
            </div>
            <AppColorSwitch />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapMutations, mapState } from 'vuex'
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    showLogo: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
  },
  computed: {
    ...mapState({
      isOpen: 'open',
    }),
  },
  methods: {
    ...mapMutations({
      toggle: 'toggle',
    }),
  },
})
</script>
