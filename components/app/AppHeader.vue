<template>
  <div class="bg-black text-gray-300 px-4 md:px-0">
    <div class="container mx-auto">
      <div class="self-container overflow-hidden">
        <div class="flex justify-between items-center">
          <div class="h-16 flex space-x-4 items-center text-base">
            <div>Home</div>
            <div>Posts</div>
          </div>

          <div class="flex space-x-6 text-sm">
            <div>QQ</div>
            <div>Wechat</div>
            <AppColorSwitch />
          </div>
        </div>

        <div class="my-28 flex flex-col items-center font-light">
          <AppLogo />

          <p class="text-2xl mt-4 text-gray-400 tracking-widest">
            一个会修电器的IT程序员
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppHeader',
})
</script>
