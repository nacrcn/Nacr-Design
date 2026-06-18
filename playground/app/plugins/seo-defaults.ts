import { defineNuxtPlugin, useHead } from '#app'

export default defineNuxtPlugin(() => {
  useHead({
    meta: [
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
  })
})
