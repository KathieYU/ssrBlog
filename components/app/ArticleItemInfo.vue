<template>
  <div class="pt-2">
    <div class="text-sm text-primary-400 dark:text-primary-300">
      {{ article.tag }}
    </div>
    <div class="text-black text-2xl font-bold mt-2 mb-4 dark:text-white">
      {{ article.title }}
    </div>
    <div class="text-sm mb-7 text-desgray-600 dark:text-desgray-500">
      {{ article.description }}
    </div>
    <div class="flex items-center space-x-2">
      <div class="rounded-full overflow-hidden w-8 h-8">
        <img
          class="w-full h-full"
          :src="article.authorImage || `/author.jpg`"
          alt="author"
        />
      </div>
      <div class="flex flex-col">
        <p class="font-bold text-black text-sm dark:text-white">
          {{ article.author || 'Journey' }}
        </p>
        <p class="text-xs text-gray-400 dark:text-gray-300">
          {{ new Date(article.time).toLocaleDateString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ArticleItemInfo',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
})
</script>
