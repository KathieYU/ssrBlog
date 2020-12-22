<template>
  <div class="aritlce-list pt-6 divide-y pb-20 px-4 lg:px-0">
    <div class="pb-8">
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
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IContentDocument } from '@nuxt/content/types/content'

// type NuxtContentFetchType = Promise<IContentDocument | Array<IContentDocument>>
const articleDirs = ['top', 'node']

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
