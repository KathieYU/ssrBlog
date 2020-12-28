<template>
  <div class="app-container dark:bg-bgdark">
    <AppNav :show-logo="true" class="fixed top-0 w-full z-30" />

    <div class="container mx-auto px-4 pt-16">
      <div class="self-container">
        <Nuxt />
      </div>
    </div>

    <AppMobileNav />

    <AppFooter />
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

        return 'Journey’s Blog'
      },
      meta: [
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: 'Journey前端技术博客',
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            '全栈技术分享博客，Web前端技术 && Nodejs全栈，每周定时分享一些技术干货',
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `http://ssr-blog.journeynes.com`,
        },
        { hid: 'og:image', property: 'og:image', content: '/journey.png' },
      ],
    }
  },
})
</script>
