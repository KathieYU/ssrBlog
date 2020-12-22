<template>
  <div class="bg-black text-gray-300 pb-12 px-8 md:px-4 lg:px-0">
    <div class="container self-container pt-4">
      <div class="flex justify-between text-sm">
        <div>Journey © {{ new Date().getFullYear() }}</div>
        <div class="divide-x flex space-x-2 leading-none items-center">
          <span>journey</span>
          <span class="pl-3">node</span>
          <span class="pl-3">webapck</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppFooter',
})
</script>
