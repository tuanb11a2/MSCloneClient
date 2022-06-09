<template>
  <div
    class="px-3 h-6 rounded-full text-xs font-semibold flex items-center"
    :class="`bg-${color}-500 text-white`"
  >
    <span>
      <slot></slot>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: "teal"
    }
  }
};
</script>
