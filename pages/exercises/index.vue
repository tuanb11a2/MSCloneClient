<template>
  <div>
    <ExerciseSubNav />

    <div class="px-4 md:px-20">
      <div v-if="Object.keys(exercises).length === 0">
        <h1 class="text-center text-2xl font-extrabold mt-20">
          Không có Bài tập nào ở đây.
        </h1>
        <h3 class="text-center text-xl mt-5">
          Hãy thử kiểm tra tab Đã hoàn thành hoặc điều hướng đến nhóm lớp cá
          nhân để kiểm tra thêm kết quả.
        </h3>
        <NuxtImg
          class="block mx-auto mt-10"
          width="300"
          height="300"
          src="/images/empty-exercise.svg"
          alt="student"
        />
      </div>

      <div v-else>
        <div v-if="type === 'all'">
          <div v-for="exercise in exercises" :key="exercise.id">
            <div class="rounded shadow-md p-5 my-3 border bg-white w-full">
              <div class="flex justify-between">
                <div class="flex">
                  <NuxtImg
                    :src="exercise.channel.group.avatar"
                    class="w-8 h-8 sm:w-10 sm:h-10 mr-5 rounded"
                  ></NuxtImg>
                  <div>
                    <h1 class="font-medium truncate w-24 md:w-48 xl:w-96">
                      <NuxtLink
                        class="hover:underline"
                        :to="
                          localePath(
                            `/groups/${exercise.channel.group.slug}/channels/${exercise.channel.slug}/exercises/${exercise.id}`
                          )
                        "
                      >
                        {{ exercise.title }}</NuxtLink
                      >
                    </h1>
                    <p class="font-light text-sm truncate w-24 md:w-48 xl:w-96">
                      <NuxtLink
                        class="text-blue-500 hover:text-blue-600"
                        :to="
                          localePath(
                            `/groups/${exercise.channel.group.slug}/channels/${exercise.channel.slug}`
                          )
                        "
                        >{{ exercise.channel.group.name }}
                      </NuxtLink>
                      - Đến hạn
                      {{ $moment(exercise.deadline).format("D MMMM, YYYY") }}
                    </p>
                  </div>
                </div>
                <div class="text-sm text-center md:text-right ml-5 w-56">
                  <span
                    class="inline-flex cursor-pointer items-center justify-center px-5 py-2 mr-2 text-xs font-bold leading-none text-red-100 bg-blue-500 rounded"
                  >
                    {{
                      $moment(exercise.deadline).isAfter()
                        ? "Đã được giao"
                        : "Đã đóng"
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="type === 'ongoing'">
          <div v-if="ongoingExercises.length === 0">
            <h1 class="text-center text-2xl font-extrabold mt-20">
              Không có Bài tập nào ở đây.
            </h1>
            <h3 class="text-center text-xl mt-5">
              Hãy thử kiểm tra tab Đã hoàn thành hoặc điều hướng đến nhóm lớp cá
              nhân để kiểm tra thêm kết quả.
            </h3>
            <NuxtImg
              class="block mx-auto mt-10"
              width="300"
              height="300"
              src="/images/empty-exercise.svg"
              alt="student"
            />
          </div>
          <div v-else>
            <div v-for="exercise in ongoingExercises" :key="exercise.id">
              <div class="rounded shadow-md p-5 my-3 border bg-white w-full">
                <div class="flex justify-between">
                  <div class="flex">
                    <NuxtImg
                      class="w-8 h-8 sm:w-10 sm:h-10 mr-5 rounded"
                      :src="exercise.channel.group.avatar"
                    ></NuxtImg>
                    <div>
                      <h1 class="font-medium truncate w-24 md:w-48 xl:w-96">
                        <NuxtLink
                          class="hover:underline"
                          :to="localePath(`/groups/{exercises/${exercise.id}`)"
                        >
                          {{ exercise.title }}</NuxtLink
                        >
                      </h1>
                      <p
                        class="font-light truncate w-24 md:w-48 xl:w-96 text-sm"
                      >
                        <NuxtLink
                          class="text-blue-500 hover:text-blue-600"
                          :to="
                            localePath(
                              `/groups/${exercise.channel.group.slug}/channels/${exercise.channel.slug}`
                            )
                          "
                          >{{ exercise.channel.group.name }}
                        </NuxtLink>
                        - Đến hạn
                        {{ $moment(exercise.deadline).format("D MMMM, YYYY") }}
                      </p>
                    </div>
                  </div>
                  <div class="text-sm text-center md:text-right ml-5 w-56">
                    <span
                      class="inline-flex cursor-pointer items-center justify-center px-5 py-2 mr-2 text-xs font-bold leading-none text-red-100 bg-blue-500 rounded"
                      >Đã được giao
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="type === 'submitted'">
          <div v-if="ongoingExercises.length === 0">
            <h1 class="text-center text-2xl font-extrabold mt-20">
              Không có Bài tập nào ở đây.
            </h1>
            <h3 class="text-center text-xl mt-5">
              Hãy thử kiểm tra tab Đã hoàn thành hoặc điều hướng đến nhóm lớp cá
              nhân để kiểm tra thêm kết quả.
            </h3>
            <NuxtImg
              class="block mx-auto mt-10"
              width="300"
              height="300"
              src="/images/empty-exercise.svg"
              alt="student"
            />
          </div>
          <div v-else>
            <div v-for="exercise in submittedExercises" :key="exercise.id">
              <div class="rounded shadow-md p-5 my-3 border bg-white w-full">
                <div class="flex justify-between">
                  <div class="flex">
                    <NuxtImg
                      class="w-8 h-8 sm:w-10 sm:h-10 mr-5 rounded"
                      :src="exercise.channel.group.avatar"
                    ></NuxtImg>
                    <div>
                      <h1 class="font-medium truncate w-24 md:w-48 xl:w-96">
                        <NuxtLink
                          class="hover:underline"
                          :to="
                            localePath(
                              `/groups/${exercise.channel.group.slug}/channels/${exercise.channel.slug}/exercises/${exercise.id}`
                            )
                          "
                        >
                          {{ exercise.title }}</NuxtLink
                        >
                      </h1>
                      <p
                        class="font-light truncate w-24 md:w-48 xl:w-96 text-sm"
                      >
                        <NuxtLink
                          class="text-blue-500 hover:text-blue-600"
                          :to="
                            localePath(
                              `/groups/${exercise.channel.group.slug}/channels/${exercise.channel.slug}`
                            )
                          "
                          >{{ exercise.channel.group.name }}
                        </NuxtLink>
                        - Đến hạn
                        {{ $moment(exercise.deadline).format("D MMMM, YYYY") }}
                      </p>
                    </div>
                  </div>
                  <div class="text-sm text-center md:text-right ml-5 w-56">
                    <span
                      class="inline-flex cursor-pointer items-center justify-center px-5 py-2 mr-2 text-xs font-bold leading-none text-red-100 bg-blue-500 rounded"
                      >Đã nộp
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="closedExercises.length === 0">
            <h1 class="text-center text-2xl font-extrabold mt-20">
              Không có Bài tập nào ở đây.
            </h1>

            <NuxtImg
              class="block mx-auto mt-10"
              width="300"
              height="300"
              src="/images/empty-exercise.svg"
              alt="student"
            />
          </div>
          <div v-else>
            <div v-for="exercise in closedExercises" :key="exercise.id">
              <div class="rounded shadow-md p-5 my-3 border bg-white w-full">
                <div class="flex justify-between">
                  <div class="flex">
                    <NuxtImg
                      class="w-8 h-8 sm:w-10 sm:h-10 mr-5 rounded"
                      :src="exercise.channel.group.avatar"
                    ></NuxtImg>
                    <div>
                      <h1 class="font-medium truncate w-24 md:w-48 xl:w-96">
                        <NuxtLink
                          class="hover:underline"
                          :to="
                            localePath(
                              `/groups/${exercise.channel.group.slug}/channels/${exercise.channel.slug}/exercises/${exercise.id}`
                            )
                          "
                        >
                          {{ exercise.title }}</NuxtLink
                        >
                      </h1>
                      <p
                        class="font-light text-sm truncate w-24 md:w-48 xl:w-96"
                      >
                        <NuxtLink
                          class="text-blue-500 hover:text-blue-600"
                          :to="
                            localePath(
                              `/groups/${exercise.channel.group.slug}/channels/${exercise.channel.slug}`
                            )
                          "
                          >{{ exercise.channel.group.name }}
                        </NuxtLink>
                        - Đến hạn
                        {{ $moment(exercise.deadline).format("D MMMM, YYYY") }}
                      </p>
                    </div>
                  </div>
                  <div class="text-sm text-center md:text-right ml-5 w-56">
                    <span
                      class="inline-flex cursor-pointer items-center justify-center px-5 py-2 mr-2 text-xs font-bold leading-none text-red-100 bg-red-500 rounded"
                      >Đã đóng
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: this.$t("meta.exercises.title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.exercises.description"),
        },
      ],
    };
  },
  data() {
    return {
      selectedGroup: "Tất cả lớp học",
      selectedGroupId: null,
      exercises: null,
      type: "all",
    };
  },
  computed: {
    closedExercises() {
      if (this.exercises.length > 0) {
        return this.exercises.filter((x) =>
          this.$moment(x.deadline).isBefore()
        );
      }

      return [];
    },
    ongoingExercises() {
      if (this.exercises.length > 0) {
        return this.exercises.filter((x) => this.$moment(x.deadline).isAfter());
      }

      return [];
    },
    submittedExercises() {
      if (this.exercises.length > 0) {
        return this.exercises.filter((x) =>
          this.pluck(x.submissions, "user_id").includes(
            this.$auth.user.id
          )
        );
      }

      return [];
    },
  },
  async asyncData({ $axios }) {
    const groupsRes = await $axios.$get("/groups");
    const groups = groupsRes.data;
    const exercisesRes = await $axios.$get("/exercises");
    const exercises = exercisesRes.data;
    const allExercises = exercisesRes.data;

    return { groups, exercises, allExercises };
  },

  methods: {
    pluck(array, key) {
      return array.map((o) => o[key]);
    },
  },
};
</script>

<style scoped></style>
