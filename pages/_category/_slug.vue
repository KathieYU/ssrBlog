<template>
  <div class="flex flex-wrap-reverse">
    <div class="w-full py-4 lg:pt-8 lg:pb-4 lg:w-3/4 dark:border-gray-800">
      <article class="prose dark:prose-dark max-w-none lg:px-8">
        <h1 class="flex items-center justify-between">
          {{ document.title }}
          <Badge v-if="document.badge">{{ document.badge }}</Badge>
        </h1>
        <div class="mt-4">
          <NuxtContent :document="document" />
        </div>
      </article>
    </div>

    <AppToc :toc="document.toc" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PostDetail',
  async asyncData({ $content, params }) {
    const { category, slug } = params
    const document = await $content(category, slug).fetch()

    return {
      document,
    }
  },
})
</script>
