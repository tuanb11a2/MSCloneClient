import webpack from "webpack";

export default {
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true });
  },
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "LT Meet",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
      },
    ],
  },
  server: {
    port: process.env.PORT || 3000
  },
  env: {
    echoHost: process.env.ECHO_URL || "https://teams-api-vn.herokuapp.com/socket.io/",
    appUrl: process.env.APP_URL
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/css/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/axios",
    { src: "@/plugins/echo", mode: "client" },
    "@/plugins/mask",
    "@/plugins/loading",
    "@/plugins/vuelidate",
    "@/plugins/portal-vue",
    "@/plugins/click-outside",
    "@/plugins/draggable",
    "@/plugins/vue-tailwind",
    { src: "@/plugins/calendar", mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    "@nuxtjs/moment",
    "@nuxt/postcss8",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ["cookie-universal-nuxt", { alias: "cookiz" }],
    "@nuxtjs/auth-next",
    "@nuxtjs/axios",
    "@nuxtjs/toast",
    "@nuxtjs/i18n",
    "@nuxt/image",
  ],

  moment: {
    locales: ["vi"],
  },
  auth: {
    strategies: {
      laravelJWT: {
        provider: 'laravel/jwt',
        url: process.env.API_URL,
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          register: { url: '/auth/register', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/user', method: 'get' }
        },
        token: {
          property: 'access_token',
          maxAge: 60 * 60
        },
        refreshToken: {
          maxAge: 60 * 60,
          property: 'access_token',
          data: 'access_token',
        },
      },
    }
  },

  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "lang",
      alwaysRedirect: true,
      redirectOn: "root", // recommended
    },
    locales: [
      { code: "en", name: "English", iso: "en-US", file: "en.json" },
      { code: "vi", name: "Tiếng Việt", iso: "vi-VN", file: "vi.json" },
    ],
    defaultLocale: "vi",
    vueI18n: {
      fallbackLocale: "vi",
    },
    langDir: "~/lang/",
  },
  toast: {
    position: "top-right",
    duration: 3000,
  },
  axios: {
    proxy: true,
    baseURL: process.env.API_URL,
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.API_URL,
    },
  },

  build: {
    postcss: {
      plugins: {
        "postcss-import": true,
        "tailwindcss/nesting": {},
        "postcss-nested": {},
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        _: "lodash",
      }),
    ],
  },
};
