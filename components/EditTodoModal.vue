<template>
  <div
    v-if="task"
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
          <div class="">
            <div class="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
              <div class="flex justify-between">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Chỉnh sửa công việc
                </h3>
                <i class="fas cursor-pointer fa-times" @click="toggleModal"></i>
              </div>

              <div class="mt-5">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Tên công việc</label
                >
                <input
                  v-model="task.name"
                  type="text"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Tên công việc của bạn"
                />
                <div
                  v-if="$v.task.name.$error"
                  class="text-red-500 text-sm font-bold mt-2"
                >
                  Tên công việc là trường bắt buộc và không quá 255 kí tự
                </div>
              </div>
              <div class="mt-5">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Nhóm</label
                >
                <select
                  v-model="task.group_id"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <option selected disabled>
                    Chọn 1 trong những nhóm của bạn!
                  </option>
                  <option
                    v-for="group in groups"
                    :key="group.id"
                    :value="group.id"
                  >
                    {{ group.name }}
                  </option>
                </select>
              </div>

              <div class="mt-5">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Phân loại</label
                >

                <select
                  v-model="task.type"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="backlog">Cần làm</option>
                  <option value="progress">Đang làm</option>
                  <option value="finished">Đã hoàn thành</option>
                  <option value="review">Đợi đánh giá</option>
                </select>
                <div class="mt-5">
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >Mức độ ưu tiên</label
                  >
                  <select
                    v-model="task.priority"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                  </select>
                </div>
              </div>

              <div class="mt-5">
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Ngày hết hạn</label
                >
                <input
                  type="datetime-local"
                  class="input"
                  :min="today"
                  v-model="task.deadline"
                />
                <div
                  v-if="$v.task.deadline.$error"
                  class="text-red-500 text-sm font-bold mt-2"
                >
                  Hãy chọn deadline của công việc!
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
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      today: new Date().toISOString().split(".")[0],
    };
  },
  props: {
    task: {
      type: Object,
      required: true,
    },
    groups: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  validations: {
    task: {
      name: { required, maxLength: maxLength(255) },
      deadline: { required },
    },
  },
  methods: {
    toggleModal() {
      this.$emit("toggle-modal");
    },
    submit() {
      this.$emit("submit");
    },
  },

  mounted() {
    this.task.deadline = this.$moment(this.task.deadline).format(
      "YYYY-MM-DDTHH:mm"
    );
  },
};
</script>
