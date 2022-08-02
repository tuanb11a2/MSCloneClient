<template>
  <div
    style="top: 56px"
    class="flex justify-between border-b px-4 md:px-20 sticky bg-white !h-14"
  >
    <ul class="flex items-center">
      <li class="mr-2">
        <a
          @click="$parent.type = 'all'"
          :class="{
            'text-blue-600 rounded-t-lg border-b-2 border-blue-600 active':
              $parent.type === 'all',
          }"
          class="inline-block cursor-pointer py-4 px-4 text-sm font-medium text-center hover:text-gray-600 hover:border-gray-300"
          >Tất cả</a
        >
      </li>
      <li class="mr-2">
        <a
          @click="$parent.type = 'not finished'"
          :class="{
            'text-blue-600 rounded-t-lg border-b-2 border-blue-600 active':
              $parent.type === 'not finished',
          }"
          class="inline-block cursor-pointer py-4 px-4 text-sm font-medium text-center rounded-t-lg hover:text-gray-600 hover:border-gray-300"
          >Đã giao</a
        >
      </li>
      <li class="mr-2">
        <a
          :class="{
            'text-blue-600 rounded-t-lg border-b-2 border-blue-600':
              $parent.type === 'finished',
          }"
          @click="$parent.type = 'finished'"
          class="inline-block cursor-pointer py-4 px-4 text-sm font-medium text-center rounded-t-lg hover:text-gray-600 hover:border-gray-300"
          >Đã hoàn thành</a
        >
      </li>
    </ul>
    <div class="flex items-center">
      <button
        v-if="$parent.group.creator_id === $auth.user.id"
        class="button-blue-small"
        @click="toggleCreateExercise"
      >
        Thêm bài tập mới
      </button>
      <CreateExerciseModal
        v-if="visibleCreateExercise"
        @toggle-modal="toggleCreateExercise"
        @submit="submitCreateExercise"
      />
    </div>
  </div>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      newExercise: {
        title: null,
        description: null,
        deadline: null,
        file: null,
      },
      visibleCreateExercise: false,
    };
  },
  validations: {
    newExercise: {
      title: {
        required,
        maxLength: maxLength(255),
      },
      description: {
        maxLength: maxLength(1000),
      },
      deadline: {
        required,
      },
    },
  },
  methods: {
    toggleCreateExercise() {
      this.visibleCreateExercise = !this.visibleCreateExercise;
    },
    async submitCreateExercise() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const formData = new FormData();
      formData.append("title", this.newExercise.title);
      formData.append("description", this.newExercise.description);
      formData.append("deadline", this.newExercise.deadline);
      formData.append("channel_id", this.$parent.channel.id);
      if (this.newExercise.file) {
        formData.append("file", this.newExercise.file);
      }
      try {
        const res = await this.$axios.post("/exercises", formData);
        this.$toast.show("Tạo bài tập thành công");
        this.$parent.channel.exercises.unshift(res.data.data);
        this.newExercise.file = null;
        this.newExercise.title = null;
        this.newExercise.description = null;
        this.newExercise.deadline = null;
        this.$v.$reset();
        this.toggleCreateExercise();
      } catch (e) {
        this.$toast.error("Tạo bài tập thất bại");
      }
    },
  },
};
</script>
