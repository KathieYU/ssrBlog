<template>
  <div class="pt-16">
    <AppHeader />

    <main>
      <nuxt-content></nuxt-content>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Layout',
  head() {
    return {
      titleTemplate: (chunk) => {
        if (chunk) {
          return `${chunk}`
        }

        return 'my blog'
      },
      bodyAttrs: {
        class: ['text-gray-700 leading-normal bg-white'],
      },
      meta: [
        // 微信分享的显示
        { hid: 'og:site_name', property: 'og:site_name', content: 'my blog' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'this is description',
        },
        { hid: 'og:url', property: 'og:url', content: '' },
        { hid: 'og:image', property: 'og:image', content: '/favicon.ico' },
      ],
    }
  },
})
</script>
