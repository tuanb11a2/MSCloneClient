<template>
  <ul
    class="absolute right-0 top-28 xl:top-10 w-56 z-50 m-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700"
    aria-label="submenu"
  >
    <li v-for="item in items" :key="item.name" class="flex">
      <a
        class="inline-flex cursor-pointer p-2 items-center w-full text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        @click="handleClick(item.action)"
      >
        <i v-if="item.icon" :class="item.icon"></i>
        <span class="ml-4"> {{ item.text }} </span>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleClick(action) {
     this.$emit(action);
    },
  },
};
</script>
