<template>
  <div
    class="aritlce-list pt-6 pb-20 lg:px-0 divide-gray-200 dark:divide-gray-700 md:divide-y"
  >
    <div class="pb-8 hidden md:block">
      <ArticleItem :article="top" />
    </div>
    <div
      class="pt-6 grid grid-cols-1 gap-x-4 md:grid-cols-2 lg:grid-cols-3 gap-y-16 md:gap-y-8 lg:gap-y-4"
    >
      <ArticleItem
        v-for="(art, index) in list"
        :key="index"
        :article="art"
        mode="vertical"
        class="block"
        :class="{ 'md:hidden': index === 0 }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IContentDocument } from '@nuxt/content/types/content'

const articleDirs = ['top', 'vue', 'typescript']

export default Vue.extend({
  async asyncData({ $content }) {
    const articleList = await Promise.all(
      articleDirs.map((dir) => $content(dir).fetch())
    )

    return {
      top: (articleList[0] as Array<IContentDocument>)[0],
      list: articleList.flat(),
    }
  },
})
</script>

<style></style>
