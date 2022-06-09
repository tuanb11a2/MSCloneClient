<template>
  <div class="bg-white shadow rounded px-3 pt-3 pb-5 border border-white">
    <div class="flex justify-between">
      <p
        class="text-gray-700 w-60 font-semibold font-sans tracking-wide text-sm"
      >
        {{ task.name }}
      </p>
      <div class="inline-flex justify-end">
        <i
          class="fas fa-pencil-alt text-blue-500 mx-3 cursor-pointer"
          @click="toggleEditModal"
          title="Chỉnh sửa công việc"
        ></i>
        <i
          @click="toggleDeleteModal"
          title="Xóa công việc"
          class="text-right text-red-500 fas fa-times cursor-pointer"
        ></i>
      </div>
    </div>
    <div class="mt-4">
      <NuxtLink
        class="text-blue-500 text-sm hover:text-blue-600"
        :to="localePath(`/groups/${task.group.slug}/channels/general`)"
        >Lớp học: {{ task.group.name }}
      </NuxtLink>
    </div>

    <div class="md:flex mt-4 md:justify-between md:items-center">
      <span class="text-sm text-gray-600">{{
        $moment(task.deadline).format("hh:mm A, D MMMM, YYYY")
      }}</span>
      <badge
        class="mt-5 flex justify-center w-24 md:mt-0"
        v-if="task.priority"
        :color="badgeColor"
      >
        <span v-if="task.priority === 'low'">Thấp</span>
        <span v-else-if="task.priority === 'medium'">Trung bình</span>
        <span v-else>Cao</span>
      </badge>
    </div>
    <ConfirmModal
      v-if="deleteVisible"
      title="Xóa bỏ công việc"
      content="Bạn có chắc muốn xóa bỏ công việc này không?"
      @toggle-modal="toggleDeleteModal()"
      @submit="deleteTask(task.id)"
    />

    <EditTodoModal
      :task="editTodo"
      :groups="groups"
      v-if="editVisible"
      @toggle-modal="toggleEditModal"
      @submit="editTask"
    />
  </div>
</template>
<script>
export default {
  props: {
    task: {
      type: Object | Array,
      default: () => ({}),
    },
    type: {
      required: true,
      type: String,
    },
    groups: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      deleteVisible: false,
      editVisible: false,
      editTodo: null,
    };
  },

  computed: {
    badgeColor() {
      const mappings = {
        high: "red",
        medium: "gray",
        low: "blue",
      };
      return mappings[this.task.priority] || mappings.default;
    },
  },
  mounted() {
    this.editTodo = { ...this.task };
    this.editTodo.oldType = this.editTodo.type;
  },
  methods: {
    toggleDeleteModal() {
      this.deleteVisible = !this.deleteVisible;
    },
    toggleEditModal(typeTitle) {
      this.task.typeTitle = typeTitle;
      this.editVisible = !this.editVisible;
    },
    async deleteTask(id) {
      await this.$axios.delete(`/todo/${id}`);
      let parentColumns = this.$parent.$parent.columns[this.type];
      parentColumns.tasks = parentColumns.tasks.filter(
        (task) => task.id !== id
      );
    },
    async editTask(event) {
      this.editTodo.groupId = this.editTodo.group_id;
      try {
        await this.$axios.put(`/todo/${this.editTodo.id}`, this.editTodo);
        this.toggleEditModal();
        this.$emit("edit-task", this.editTodo);
      } catch (e) {}
    },
  },
};
</script>
