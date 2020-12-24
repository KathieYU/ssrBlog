<template>
  <div class="app-container dark:bg-bgdark">
    <AppNav />

    <AppNav
      :show-logo="true"
      class="fixed top-0 w-full transition-all opacity-0 transform duration-100"
      :class="{
        'opacity-100': showNav,
        'translate-y-0': showNav,
        '-translate-y-full': !showNav,
      }"
    />

    <div class="py-28 flex flex-col items-center font-light bg-black">
      <AppLogo />

      <p class="text-2xl mt-4 text-gray-400 tracking-widest">
        一个会修电器的IT程序员
      </p>
    </div>

    <div class="container mx-auto px-4">
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
  data() {
    return {
      showNav: false,
    }
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      if (window.scrollY >= 380) {
        this.showNav = true
      } else {
        this.showNav = false
      }
    },
  },
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
