<template>
  <div class="container mx-auto text-purple-500">hello world</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async asyncData({ $content }) {
    const data = await $content('hello').fetch()

    console.log(data)

    return {
      data,
    }
  },
})
</script>

<style></style>
