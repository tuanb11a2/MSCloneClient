<template>
  <div>
    <CreatorChannelExerciseSubNav />
    <div
      class="mt-20 px-4 md:px-20"
      v-if="Object.keys(channel.exercises).length === 0"
    >
      <h1 class="text-center text-2xl font-extrabold mt-20">
        Không có Bài tập nào ở đây.
      </h1>
      <h3 class="text-center text-xl mt-5">
        Hãy thử kiểm tra tab Đã hoàn thành hoặc điều hướng đến nhóm lớp cá nhân
        để kiểm tra thêm kết quả.
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
        <div v-for="exercise in channel.exercises" :key="exercise.id">
          <NuxtLink
            :to="
              localePath(
                `/groups/${group.slug}/channels/${channel.slug}/exercises/${exercise.id}`
              )
            "
          >
            <div class="rounded shadow-md p-5 my-3 border bg-white w-full">
              <div class="flex justify-between">
                <div class="flex">
                  <NuxtImg
                    :src="group.avatar"
                    class="w-8 h-8 sm:w-10 sm:h-10 mr-5 rounded"
                  ></NuxtImg>
                  <div>
                    <h1 class="font-medium truncate w-24 md:w-48 xl:w-96">
                      {{ exercise.title }}
                    </h1>
                    <p class="font-light text-sm truncate w-24 md:w-48 xl:w-96">
                      <NuxtLink
                        class="text-blue-500 hover:text-blue-600"
                        :to="localePath(`/groups/${group.slug}`)"
                        >{{ group.name }}
                      </NuxtLink>
                      - Đến hạn
                      {{ $moment(exercise.deadline).format("D MMMM, YYYY") }}
                    </p>
                  </div>
                </div>
                <div class="text-sm text-center md:text-right ml-5 w-56">
                  <span
                    class="inline-flex cursor-pointer items-center justify-center px-5 py-2 mr-2 text-xs font-bold leading-none text-red-100 bg-blue-500 rounded"
                    >Đã nộp:
                    {{
                      exercise.submissions ? exercise.submissions.length : 0
                    }}/{{ exercise.users.length }}
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
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
            <NuxtLink
              class="hover:underline"
              :to="
                localePath(
                  `/groups/${group.slug}/channels/${channel.slug}/exercises/${exercise.id}`
                )
              "
            >
              <div class="rounded shadow-md p-5 my-3 border bg-white w-full">
                <div class="flex justify-between">
                  <div class="flex">
                    <NuxtImg
                      class="w-8 h-8 sm:w-10 sm:h-10 mr-5 rounded"
                      :src="group.avatar"
                    ></NuxtImg>
                    <div>
                      <h1 class="font-medium truncate w-24 md:w-48 xl:w-96">
                        {{ exercise.title }}
                      </h1>
                      <p
                        class="font-light truncate w-24 md:w-48 xl:w-96 text-sm"
                      >
                        <NuxtLink
                          class="text-blue-500 hover:text-blue-600"
                          :to="
                            localePath(
                              `/groups/${group.slug}/channels/${exercise.channel_id}`
                            )
                          "
                          >{{ group.name }}
                        </NuxtLink>
                        - Đến hạn
                        {{ $moment(exercise.deadline).format("D MMMM, YYYY") }}
                      </p>
                    </div>
                  </div>
                  <div class="text-sm text-center md:text-right ml-5 w-56">
                    <span
                      class="inline-flex cursor-pointer items-center justify-center px-5 py-2 mr-2 text-xs font-bold leading-none text-red-100 bg-blue-500 rounded"
                      >Đã nộp:
                      {{
                        exercise.submissions ? exercise.submissions.length : 0
                      }}/{{ exercise.users.length }}
                    </span>
                  </div>
                </div>
              </div>
            </NuxtLink>
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
            <NuxtLink
              class="hover:underline"
              :to="
                localePath(
                  `/groups/${group.slug}/channels/${channel.slug}/exercises/${exercise.id}`
                )
              "
            >
              <div class="rounded shadow-md p-5 my-3 border bg-white w-full">
                <div class="flex justify-between">
                  <div class="flex">
                    <NuxtImg
                      class="w-8 h-8 sm:w-10 sm:h-10 mr-5 rounded"
                      :src="group.avatar"
                    ></NuxtImg>
                    <div>
                      <h1 class="font-medium truncate w-24 md:w-48 xl:w-96">
                        {{ exercise.title }}
                      </h1>
                      <p
                        class="font-light text-sm truncate w-24 md:w-48 xl:w-96"
                      >
                        <NuxtLink
                          class="text-blue-500 hover:text-blue-600"
                          :to="
                            localePath(
                              `/groups/${group.slug}/channels/${exercise.channel_id}`
                            )
                          "
                          >{{ group.name }}
                        </NuxtLink>
                        - Đến hạn
                        {{ $moment(exercise.deadline).format("D MMMM, YYYY") }}
                      </p>
                    </div>
                  </div>
                  <div class="text-sm text-center md:text-right ml-5 w-56">
                    <span
                      class="inline-flex cursor-pointer items-center justify-center px-5 py-2 mr-2 text-xs font-bold leading-none text-red-100 bg-blue-500 rounded"
                      >Đã nộp:
                      {{
                        exercise.submissions ? exercise.submissions.length : 0
                      }}/{{ exercise.users.length }}
                    </span>
                  </div>
                </div>
              </div>
            </NuxtLink>
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
      title: `Quản lí bài tập | ${this.group.name}`,
    };
  },
  data() {
    return {
      type: "all",
    };
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
    group: {
      type: Object,
      required: true,
    },
  },
  computed: {
    closedExercises() {
      if (this.channel.exercises.length > 0) {
        return this.channel.exercises.filter((x) =>
          this.$moment(x.deadline).isBefore()
        );
      }

      return [];
    },
    ongoingExercises() {
      if (this.channel.exercises.length > 0) {
        return this.channel.exercises.filter((x) =>
          this.$moment(x.deadline).isAfter()
        );
      }

      return [];
    },
  },

  methods: {},
};
</script>

<style scoped></style>
