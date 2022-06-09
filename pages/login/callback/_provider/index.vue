<template>
  <div class="container mx-auto text-center">
    <div class="blankslate mt-5 text-center">
      <NuxtImg
        width="100"
        height="100"
        class="block mx-auto"
        src="/images/logo.svg"
      />
      <h3 class="mb-1">
        Bạn đang được điều hướng tới trang web của chúng tôi!
      </h3>

      <p>
        Nếu trình duyệt không tự động được điều hưỡng, hãy
        <button class="text-blue-500 font-bold" @click="returnBack">
          nhấn vào đây
        </button>
        để tiếp tục.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  layout: "guest",
  mounted() {
    this.returnBack();
  },
  methods: {
    returnBack() {
      window.opener.location.href = `${process.env.appUrl}/login?token=${this.$route.query.token}`;
      window.close();
    },
  },
};
</script>
