<template>
  <div
    class="fixed z-50 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen text-center pt-4 px-4 pb-20 sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >

      <div
        class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div>
            <div class="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Tạo nhóm mới
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  <span
                    >Cộng tác chặt chẽ với một nhóm người trong tổ chức của bạn
                    theo dự án, sáng kiến hoặc mối quan tâm chung. Tìm hiểu thêm
                    về LT Meet và kênh</span
                  >
                </p>
              </div>

              <div class="mt-5">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Tên nhóm</label
                >
                <input
                  v-model="$parent.newGroup.name"
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Tên nhóm của bạn"
                />
                <div
                  v-if="$parent.$v.newGroup.name.$error"
                  class="text-red-500 text-sm font-bold mt-2"
                >
                  Tên nhóm là trường bắt buộc và không quá 255 kí tự
                </div>
              </div>
              <div class="mt-5">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >File phương tiện</label
                >
                <input
                  @change="uploadFile"
                  ref="file"
                  type="file"
                  accept="image/*"
                  class="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="File phương tiện"
                />
              </div>
              <NuxtImg class="post-image" v-if="previewImg" :src="previewImg" />
              <div class="mt-5">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Mô tả</label
                >
                <textarea
                  type="text"
                  v-model="$parent.newGroup.description"
                  placeholder="Giới thiệu tất cả thông tin về nhóm này"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                />
                <div
                  v-if="$parent.$v.newGroup.description.$error"
                  class="text-red-500 text-sm font-bold mt-2"
                >
                  Mô tả nhóm không quá 255 kí tự
                </div>
              </div>
              <div class="mt-5">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Quyển riêng tư</label
                >
                <select
                  v-model="$parent.newGroup.privacy"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="private">
                    Riêng tư - Chỉ chủ sở hữu nhóm mới có thể thêm thành viên
                  </option>
                  <option
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    value="public"
                  >
                    Công khai - Mọi người trong tổ chức của bạn đều có thể tham
                    gia
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Xác nhận
          </button>
          <button
            type="button"
            @click="toggleModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      previewImg: null,
    };
  },
  methods: {
    toggleModal() {
      this.$emit("toggle-modal");
    },
    uploadFile(e) {
      const file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        this.previewImg= e.target.result;
      };
      reader.readAsDataURL(file)
      this.$parent.newGroup.avatar = file;
    },
    submit() {
      this.$emit("submit");
    },
  },
};
</script>
