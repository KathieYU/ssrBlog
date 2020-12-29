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
import AppCopyButton from '@/components/app/AppCopyButton.vue'
import { IContentDocument } from '@nuxt/content/types/content'

export default Vue.extend({
  layout: 'single',
  name: 'PostDetail',
  async asyncData({ $content, params }) {
    const { category, slug } = params
    const document = await $content(category, slug).fetch()

    return {
      document,
    }
  },
  data() {
    return {
      document: {} as IContentDocument,
    }
  },
  mounted() {
    setTimeout(() => {
      const blocks = document.getElementsByClassName('nuxt-content-highlight')

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        const CopyButton = Vue.extend(AppCopyButton)
        const component = new CopyButton().$mount()
        block.appendChild(component.$el)
      }
    }, 100)
  },
  head() {
    const { title, description } = this.document as any
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        // Open Graph
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
      ],
    }
  },
})
</script>
