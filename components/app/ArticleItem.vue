<template>
  <div class="top-article grid gap-4" :class="gridCols">
    <div
      class="overflow-hidden rounded border"
      :class="{ 'col-span-2': mode === 'horizen' }"
    >
      <img
        v-if="mode === 'horizen'"
        class="w-full h-auto"
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
    <div class="pt-2">
      <div class="text-sm tag-color">{{ article.tag }}</div>
      <div class="text-black text-2xl font-bold mt-2 mb-4">
        {{ article.title }}
      </div>
      <div class="text-sm description-color mb-7">
        {{ article.description }}
      </div>
      <div class="flex items-center space-x-1">
        <div class="rounded-full overflow-hidden w-8 h-8">
          <img
            class="w-full h-full"
            :src="article.authorImage || `/author.jpg`"
            alt="author"
          />
        </div>
        <div class="flex flex-col">
          <p class="font-bold text-black text-sm">
            {{ article.author || 'Journey' }}
          </p>
          <p class="text-xs text-gray-400">
            {{ new Date(article.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
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
