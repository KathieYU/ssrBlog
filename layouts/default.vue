<template>
  <div class="app-container dark:bg-bgdark">
    <AppNav class="fixed md:static top-0 w-full z-30" />

    <AppNav
      :show-logo="true"
      class="hidden md:fixed top-0 w-full transition-all opacity-0 transform duration-100"
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

    <AppMobileNav />

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
