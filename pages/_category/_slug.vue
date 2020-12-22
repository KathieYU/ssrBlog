<template>
  <div class="px-4 lg:px-0 mt-4 article-detial-info">
    <ArticleItemInfo :article="detail" />

    <div class="mt-16 mb-32 prose">
      <nuxt-content :document="detail"></nuxt-content>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PostDetail',
  async asyncData({ $content, params }) {
    const { category, slug } = params
    const detailContent = await $content(category, slug).fetch()

    console.log(detailContent)

    return {
      detail: detailContent,
    }
  },
})
</script>
