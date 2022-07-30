<template>
  <div class="px-4 md:px-20" style="height: 90vh">
    <div class="mt-10">
      <div class="text-blue-500 hover:text-blue-700">
        <a @click="$router.go(-1)" class="cursor-pointer">
          <i class="fas fa-arrow-left mr-2"></i> Quay lại
        </a>
      </div>

      <div class="mt-5">
        <div v-if="$moment(exercise.deadline).isAfter()">
          <button class="button-blue">Đang diễn ra</button>
        </div>
        <div v-else>
          <button class="button-blue">Đã đóng</button>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div class="">
          <h1 class="text-xl font-bold">{{ exercise.title }}</h1>
          <p class="text-sm font-semibold text-gray-500">
            Đến hạn vào:
            {{ $moment(exercise.deadline).format("hh:mm A, D MMMM, YYYY") }}
          </p>
        </div>
        <div
          class="text-sm font-semibold text-gray-500"
          v-if="group.creator_id === user.id"
        >
          <span
            class="inline-flex cursor-pointer items-center justify-center px-5 py-2 mr-2 text-xs font-bold leading-none text-red-100 bg-blue-500 rounded"
            >Đã nộp:
            {{ exercise.submissions ? exercise.submissions.length : 0 }}/{{
              exercise.users_count
            }}
          </span>
        </div>
        <div v-else class="text-sm font-semibold text-gray-500">
          <p class="">Điểm</p>
          <p v-if="userSubmission.grade">{{ userSubmission.grade }}/100</p>
          <p v-else>Không có điểm</p>
        </div>
      </div>
    </div>
    <div class="mt-10" v-if="group.creator_id === user.id">
      <table class="w-full whitespace-no-wrap">
        <thead>
          <tr
            class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
          >
            <th class="px-4 py-3">Tên người nộp</th>
            <th class="px-4 py-3">Nội dung</th>
            <th class="px-4 py-3">File đính kém</th>
            <th class="px-4 py-3">Thời gian nộp</th>
            <th class="px-4 py-3">Điểm</th>
          </tr>
        </thead>
        <div
          class="px-4 md:px-20"
          v-if="
            !exercise.submissions ||
            Object.keys(exercise.submissions).length === 0
          "
        >
          <h1 class="text-center text-2xl font-extrabold mt-20">
            Chưa có ai nộp bài!
          </h1>

          <NuxtImg
            class="block mx-auto mt-10"
            width="300"
            height="300"
            src="/images/empty-exercise.svg"
            alt="student"
          />
        </div>
        <tbody
          v-else
          class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800"
        >
          <tr
            v-for="submission in exercise.submissions"
            :key="`submission-${submission.id}`"
            class="text-gray-700 dark:text-gray-400"
          >
            <td class="px-4 py-3">
              <div class="flex items-center text-sm">
                <p class="font-semibold">{{ submission.user.name }}</p>
              </div>
            </td>
            <td class="px-4 py-3">
              {{ submission.content }}
            </td>

            <td
              class="px-4 py-3 text-blue-500 hover:underline"
              v-if="submission.file_path"
            >
              <a target="_blank" :href="submission.file_path">File đính kèm</a>
            </td>

            <td class="px-4 py-3 text-sm">
              {{ $moment(submission.created_at).format("hh:mm A, DD/MM/YYYY") }}
            </td>
            <td
              @click="toggleGradeModal(submission.id)"
              class="cursor-pointer text-blue-500 hover:underline px-4 py-3 text-sm"
            >
              <a v-if="submission.grade">{{ submission.grade }}/100</a>
              <a v-else>Chưa có điểm</a>
            </td>

            <ClientOnly>
              <div
                :id="`grade-modal-${submission.id}`"
                class="fixed hidden z-50 inset-0 overflow-y-auto"
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
                          <h3
                            class="text-lg leading-6 font-medium text-gray-900"
                          >
                            Chấm điểm cho bài tập
                          </h3>
                          <div class="mt-5">
                            <label
                              class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >Điểm số</label
                            >
                            <input
                              v-model="submission.grade"
                              @change="error = null"
                              @keyup.enter="submit(submission)"
                              type="number"
                              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                              placeholder="Điểm số cho bài tập của bạn"
                            />

                            <div
                              v-if="error"
                              class="text-red-500 text-sm font-bold mt-2"
                            >
                              {{ error }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
                    >
                      <button
                        type="button"
                        @click="submit(submission)"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Xác nhận
                      </button>
                      <button
                        type="button"
                        @click="toggleGradeModal(submission.id)"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Hủy bỏ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ClientOnly>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-10" v-else>
      <p class="text-sm font-semibold text-gray-500 mt-5">Công việc của tôi</p>
      <input @change="uploadFile" class="text-sm mt-3 mb-10" type="file" />
      <NuxtImg
        :src="previewFile"
        v-if="previewFile"
        class="mb-10 h-32 block mx-auto"
      />
      <client-only style="max-width: 100% !important">
        <ckeditor-nuxt v-model="newExercise.content" :config="editorConfig" />
      </client-only>

      <div
        v-if="$v.newExercise.content.$error"
        class="text-red-500 text-sm font-bold mt-2"
      >
        Nội dung là trường bắt buộc và không quá 5000 kí tự
      </div>
      <div class="flex flex-row-reverse">
        <button class="button-blue mt-5" :disabled="$moment(exercise.deadline).isBefore()" @click="submitExercise">
          Nộp bài
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  components: {
    "ckeditor-nuxt": () => {
      if (process.client) {
        return import("@blowstack/ckeditor-nuxt");
      }
    },
  },
  async asyncData({ $axios, route, store }) {
    const res = await $axios.$get(`/exercises/${route.params.exerciseId}`);
    const exercise = res.data;

    const res2 = await $axios.$get(`/groups/${route.params.id}`);
    const group = res2.data;

    const userSubmission = exercise.submissions.find(
      (submission) => submission.user_id === store.getters["auth/user"].id
    );

    return { exercise, group, userSubmission };
  },
  data() {
    return {
      error: null,
      newExercise: {
        content: "",
        file: null,
      },
      previewFile: null,
      editorConfig: {
        removePlugins: ["Title"],
      },
    };
  },
  computed: {
    user() {
  return this.$auth.user;
},
  },
  validations: {
    newExercise: {
      content: {
        required,
        maxLength: maxLength(5000),
      },
    },
  },
  mounted() {
    if (this.userSubmission) {
      this.newExercise.content = this.userSubmission.content;
      if (this.userSubmission.file) {
        this.newExercise.file = userSubmission.file;
      }
    }
  },
  methods: {
    toggleGradeModal(id) {
      document.querySelector(`#grade-modal-${id}`).classList.toggle("hidden");
    },
    async submit(submission) {
      if (!submission.grade || submission.grade > 100) {
        this.error = "Hãy chọn điểm số nhỏ hơn 100";
        return;
      }
      try {
        await this.$axios.post(
          `/exercises/${this.exercise.id}/submissions/${submission.id}/mark`,
          {
            grade: submission.grade,
          }
        );
        this.$toast.success("Đã chấm điểm thành công");
        this.toggleGradeModal(submission.id);
      } catch (e) {
        this.$toast.error(e.response.data.meta.message);
      }
    },
    uploadFile(e) {
      const file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        this.previewFile = e.target.result;
      };
      reader.readAsDataURL(file);
      this.newExercise.file = file;
    },
    async submitExercise() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let formData = new FormData();
      formData.append("content", this.newExercise.content);
      if (this.newExercise.file) {
        formData.append("file", this.newExercise.file);
      }
      try {
        const res = await this.$axios.post(
          `/exercises/${this.exercise.id}/submit`,
          formData
        );
        this.$toast.success("Đã nộp bài thành công");
        this.$router.go(-1);
      } catch (e) {
        this.$toast.error(e.response.data.meta.message);
      }
    },
  },
};
</script>
