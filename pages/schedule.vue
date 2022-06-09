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
    <client-only>
      <v-calendar
        class="custom-calendar max-w-full"
        :masks="masks"
        :attributes="attributes"
        locale="vi"
      >
        <template #day-content="{ day, attributes }">
          <div class="flex flex-col h-full overflow-hidden py-1">
            <span class="day-label text-sm text-center font-bold mb-2">{{
              day.day
            }}</span>
            <div class="flex-grow overflow-y-auto text-center overflow-x-auto">
              <button
                :title="`${task.customData.name} Đến hạn: ${task.customData.deadline}`"
                v-for="(task, index) in attributes"
                :key="index"
                class="button-blue-small w-3/4 truncate mb-2"
              >
                {{ task.customData.name }}
              </button>
            </div>
          </div>
        </template>
      </v-calendar>
    </client-only>
  </div>
</template>

<script>
export default {
  data() {
    return {
      masks: {
        weekdays: "WWWW",
      },
    };
  },
  async asyncData({ $axios }) {
    const res = await $axios.$get("/todo");
    const exercisesRes = await $axios.$get("/exercises");
    return {
      todos: res.data,
      exercises: exercisesRes.data,
    };
  },

  computed: {
    attributes() {
      let attributes = [];
      if (this.todos.length > 0) {
        this.todos.forEach((todo) => {
          attributes.push({
            customData: {
              name: todo.name,
              type: "todo",
              deadline: this.$moment(todo.deadline).format("hh:mm A"),
            },
            dates: this.$moment(todo.deadline).toDate(),
          });
        });
      }
      if (this.exercises.length > 0) {
        this.exercises.forEach((exercise) => {
          attributes.push({
            customData: {
              name: exercise.title,
              type: "exercise",
              deadline: this.$moment(exercise.deadline).format("hh:mm A"),
            },
            dates: this.$moment(exercise.deadline).toDate(),
          });
        });
      }

      return attributes;
    },
  },
  methods: {
    pluck(array, key) {
      return array.map((o) => o[key]);
    },
  },
};
</script>

<style lang="postcss" scoped>
::-webkit-scrollbar {
  width: 0px;
}
::-webkit-scrollbar-track {
  display: none;
}
/deep/ .custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 150px;
  --day-height: 150px;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;
  border-radius: 0;
  width: 100%;
  & .vc-title {
    color: white !important;
  }
  & .vc-svg-icon {
    color: white !important
  }
  & .vc-header {
    background-color: #0E7490;
    color: #fff!important;
    padding: 10px 0;
  }
  & .vc-weeks {
    padding: 0;
  }
  & .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 15px;
    color: black!important;
  }
  & .vc-day {
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;
    
    &:not(.on-bottom) {
      border-bottom: var(--day-border);
      &.weekday-1 {
        border-bottom: var(--day-border-highlight);
      }
    }
    &:not(.on-right) {
      border-right: var(--day-border);
    }
  }
  & .vc-day-dots {
    margin-bottom: 5px;
  }
}
</style>
