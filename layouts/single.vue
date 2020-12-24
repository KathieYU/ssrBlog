<template>
  <div class="app-container dark:bg-bgdark">
    <AppNav :show-logo="true" class="fixed top-0 w-full z-10" />

    <div class="container mx-auto px-4 pt-16">
      <div class="self-container">
        <Nuxt />
      </div>
    </div>

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

        return 'my blog'
      },
      meta: [
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
