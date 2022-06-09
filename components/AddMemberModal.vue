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
                Thêm thành viên
              </h3>
              <div class="mt-5">
                <p class="text-sm text-gray-500">
                  <span
                    >Bạn có muốn thêm người bạn nào của mình vào nhóm này không?
                    Nếu có, hãy chọn trong danh sách dưới đây!</span
                  >
                </p>
                <div class="multiselect-container">

                <multiselect
                  v-if="$parent.friendsList.length > 0"
                  class="mt-5"
                  v-model="$parent.selectedFriends"
                  selectLabel="Click hoặc ấn enter để lựa chọn"
                  selectedLabel="Đã chọn"
                  deselectLabel="Click hoặc ấn enter để bỏ chọn"
                  :options="$parent.friendsList"
                  :multiple="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  :searchable="true"
                  placeholder="Hãy chọn những người bạn!"
                  label="name"
                  track-by="name"
                >
                  <template slot="noOptions">
                    Bạn chưa kết bạn với ai cả!
                  </template>
                  <template slot="noResult">
                    Không tìm thấy người bạn nào!
                  </template>
                </multiselect>
                </div>
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
            Bỏ qua
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  components: { Multiselect },
  methods: {
    toggleModal() {
      this.$emit("toggle-modal");
    },
    submit() {
      this.$emit("submit");
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
.multiselect-container {
  height: 325px !important;
  overflow-y: auto
}
</style>
