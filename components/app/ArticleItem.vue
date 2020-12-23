<template>
  <NuxtLink
    :to="article.path"
    class="top-article grid gap-4 cursor-pointer"
    :class="gridCols"
  >
    <div
      class="overflow-hidden rounded"
      :class="{ 'col-span-2': mode === 'horizen' }"
    >
      <img
        v-if="mode === 'horizen'"
        class="h-72 lg:h-96 w-full object-cover"
        :src="article.image"
        alt=""
      />
      <img
        v-else
        class="h-60 md:h-52 lg:h-38 w-full object-cover"
        :src="article.image"
        alt=""
      />
    </div>
    <ArticleItemInfo :article="article" />
  </NuxtLink>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { IContentDocument } from '@nuxt/content/types/content'

type AritcleExtraField = {
  image: string
  tag: string
  title: string
  description: string
  authorImage: string
  author: string
}

export default Vue.extend({
  name: 'ArticleItem',
  props: {
    mode: {
      type: String,
      default: 'horizen',
    } as PropOptions<String>,
    article: {
      type: Object,
      required: true,
    } as PropOptions<IContentDocument & AritcleExtraField>,
  },
  computed: {
    gridCols() {
      return this.mode === 'horizen' ? 'grid-cols-3' : 'grid-cols-1'
    },
  },
})
</script>
