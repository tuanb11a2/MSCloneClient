<template>
  <div class="font-sans leading-normal tracking-normal">
    <div class="spinner" v-if="isLoading">
      <LoadingIcon />
    </div>
    <nav
      class="bg-cyan-900 px-4 md:px-20 h-12 pt-2 md:pt-1 pb-1 mt-0 flex justify-between items-center fixed w-full z-20 top-0"
    >
      <NuxtLink :to="localePath('/')" class="text-white text-xl"
        >LT Meet</NuxtLink
      >
      <div class="text-white md:inline-flex hidden">
        <NuxtLink
          v-for="locale in availableLocales"
          :key="locale.code"
          :to="switchLocalePath(locale.code)"
          >
            <country-flag v-if="locale.code == 'en'" country="us" size='big'/>
            <country-flag v-if="locale.code == 'vn'" country="vn" size='big'/>
          </NuxtLink
        >
        <NuxtLink :to="localePath('login')" class="ml-3">
          {{ $t("login.text") }}</NuxtLink
        >
        <NuxtLink :to="localePath('register')" class="ml-3">
          {{ $t("signUp.text") }}</NuxtLink
        >
      </div>
    </nav>
    <div class="pt-12 px-4 sm:px-6 lg:px-8 bg-gray-100 h-full min-h-screen">
      <NuxtImg
        class="mx-auto h-24 py-5 w-auto"
        src="/images/logo.svg"
        alt="LT Meet"
      />
      <h2
        class="text-center text-xl md:text-3xl font-extrabold mb-10 text-gray-900"
      >
        <PortalTarget name="pageTitle"></PortalTarget>
      </h2>
      <Nuxt />
    </div>
  </div>
</template>

<script>
import CountryFlag from 'vue-country-flag'

export default {
  head() {
    return {
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
    };
  },
  components: { CountryFlag },
  computed: {
    isLoading() {
      return this.$store.getters.loading;
    },
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale);
    },
  },
};
</script>
