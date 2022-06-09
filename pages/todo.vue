<template>
  <div>
    <div
      class="flex top-0 justify-between items-center border-b px-4 md:px-20 sticky bg-white !h-14"
    >
      <div class="text-blue-500 hover:text-blue-700">
        <a @click="$router.go(-1)" class="cursor-pointer">
          <i class="fas fa-arrow-left mr-2"></i> Quay lại
        </a>
      </div>
    </div>
    <div
      class="w-full px-4 md:px-20 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 py-12"
    >
      <div
        v-for="column in columns"
        :key="column.title"
        class="px-3 py-3 rounded mr-4"
      >
        <div class="flex items-center justify-between mb-5">
          <p class="text-gray-700 font-semibold font-sans tracking-wide">
            {{ column.title }}
          </p>
          <button
            class="text-xs p-2 text-white font-bold rounded"
            :class="column.color"
            @click="toggleCreateModal(column.type, column.title)"
          >
            Thêm công việc mới
          </button>
        </div>

        <div
          class="overflow-y-auto border rounded p-5"
          :class="column.color"
          style="height: 65vh"
        >
          <div
            v-if="column.tasks.length === 0"
            class="font-bold text-xl text-cyan-700"
          >
            Bạn không còn công việc nào 🥳
          </div>
          <draggable
            :list="column.tasks"
            :animation="200"
            @change="changeTask(column.title, $event)"
            ghost-class="ghost-card"
            group="tasks"
          >
            <task-card
              v-for="task in column.tasks"
              :key="task.id"
              :groups="groups"
              :type="column.type"
              @edit-task="editTask"
              :task="task"
              class="mt-3 cursor-move"
            ></task-card>
          </draggable>
        </div>
      </div>
    </div>
    <CreateTodoModal
      v-if="createVisible"
      @toggle-modal="toggleCreateModal"
      @submit="createTodo"
    />
  </div>
</template>
<script>
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      newTodo: {
        name: "",
        deadline: "",
        priority: "low",
        type: "",
        groupId: "",
        typeTitle: "",
      },
      createVisible: false,
    };
  },
  validations: {
    newTodo: {
      name: { required, maxLength: maxLength(255) },
      deadline: { required },
    },
  },
  async asyncData({ $axios }) {
    const res = await $axios.$get("/todo");
    const tasks = res.data;
    if (Object.keys(tasks).length > 0) {
    }
    const backlog = {
      title: "Cần làm",
      tasks:
        Object.keys(tasks).length > 0
          ? tasks.filter((task) => task.type === "backlog")
          : [],
      type: "backlog",
      color: "bg-yellow-300 !text-black",
    };
    const progress = {
      title: "Đang làm",
      tasks:
        Object.keys(tasks).length > 0
          ? tasks.filter((task) => task.type === "progress")
          : [],
      type: "progress",
      color: "bg-green-300",
    };
    const review = {
      title: "Đợi đánh giá",
      tasks:
        Object.keys(tasks).length > 0
          ? tasks.filter((task) => task.type === "review")
          : [],
      type: "review",
      color: "bg-blue-300",
    };
    const finished = {
      title: "Đã hoàn thành",
      tasks:
        Object.keys(tasks).length > 0
          ? tasks.filter((task) => task.type === "finished")
          : [],
      type: "finished",
      color: "bg-red-300",
    };
    const groupRes = await $axios.$get("/groups");
    const groups = groupRes.data;

    const columns = { backlog, progress, review, finished };

    return { columns, groups, tasks };
  },
  mounted() {
    if (this.groups.length > 0) {
      this.newTodo.groupId = this.groups[0].id;
    }
  },
  methods: {
    changeTask(title, event) {
      console.log(event);
      // console.log(event.relatedContext.list[0].type)
      // console.log(event.draggedContext.element.id);
    },

    toggleCreateModal(type, title) {
      this.createVisible = !this.createVisible;
      this.newTodo.type = type;
      this.newTodo.typeTitle = title;
    },
    editTask(task) {
      // this.columns[task.oldType].tasks.filter(v => !bar.includes(v));
      // console.log(task.id, this.columns[task.oldType].tasks)
      // // console.log(this.columns[task.oldType].tasks);
      // // // this.columns[task.type].tasks.push(task);
      // // console.log(this.columns[task.type].tasks);
      // // this.columns[task.type].tasks = this.columns[task.type].tasks.sort(
      // //   function (a, b) {
      // //     return new Date(a.deadline) - new Date(b.deadline);
      // //   }
      // // );
    },
    async createTodo() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      try {
        const res = await this.$axios.post("/todo", this.newTodo);
        this.toggleCreateModal();
        let task = res.data.data;
        this.tasks.push(task);
        this.columns[task.type].tasks.push(task);
        this.columns[task.type].tasks = this.columns[task.type].tasks.sort(
          function (a, b) {
            return new Date(a.deadline) - new Date(b.deadline);
          }
        );
        this.newTodo.name = "";
        this.newTodo.deadline = "";
        this.$v.$reset();
        this.$toastr.s(
          "This Message From Toastr Plugin\n You can access this plugin : <font color='yellow'>this.$toastr</font>"
        );
        this.$toastr.s("Thêm công việc mới thành công!");
      } catch (e) {}
    },
  },
};
</script>
<style scoped>
.column-width {
  min-width: 320px;
  width: 320px;
}

.ghost-card {
  opacity: 0.5;
  background: #f7fafc;
  border: 1px solid #4299e1;
}
</style>
