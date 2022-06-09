<template>
  <div>
    <div
      class="flex top-0 justify-between items-center z-10 px-4 border-b md:px-20 sticky bg-white !h-14"
    >
      <div class="text-blue-500 hover:text-blue-700">
        <a @click="$router.go(-1)" class="cursor-pointer">
          <i class="fas fa-arrow-left mr-2"></i> Quay lại
        </a>
      </div>
    </div>
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div>
        <div class="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Tham gia vào nhóm {{ group.name }}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              <span
                >Bằng cách nhấn vào nút xác nhận, bạn sẽ đồng ý với
                <span class="text-blue-500 cursor-pointer hover:underline"
                  >Điều khoản sử dụng và Chính sách bảo mật của chúng tôi
                </span>
              </span>
            </p>
          </div>
          <div class="mt-5" v-if="group.privacy === 'private'">
            <label
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Nhập mã gia nhập của nhóm</label
            >
            <input
              v-model="joinCode"
              @change="error = null"
              @keyup.enter="submit"
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Mã gia nhập nhóm"
            />
            <div v-if="error" class="text-red-500 text-sm font-bold mt-2">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      <button
        type="button"
        @click="submit"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Xác nhận
      </button>
      <button
        type="button"
        @click="$router.go(-1)"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      >
        Hủy bỏ
      </button>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `Tham gia nhóm ${this.group.name}`,
    };
  },
  async asyncData({ $axios, route }) {
    const res = await $axios.$get(`/groups/${route.params.id}`);
    const group = res.data;

    return { group };
  },

  data() {
    return {
      error: null,
      joinCode: null,
    };
  },
  methods: {
    async submit() {
      if (this.group.privacy === 'private' && !this.joinCode) {
        this.error = "Bạn chưa nhập mã gia nhập";
        return;
      }
      try {
        await this.$axios.get(`/groups/${this.group.id}/join/${this.joinCode}`);
        this.$router.push(`/groups/${this.group.slug}/channels/general`);
      } catch (e) {
        this.error = e.response.data.meta.message;
      }
    },
  },
};
</script>
