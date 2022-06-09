<template>
  <div class="grid grid-cols-4">
    <ChatSideNav class="col-span-4 md:col-span-1 hidden md:block" />

    <div class="col-span-4 md:col-span-3 px-10">
      <h1 class="text-center text-2xl font-extrabold mt-20">
        Tìm một người bạn và nhắn tin với họ!
      </h1>
      <!-- component -->
      <div class="flex justify-center mt-10">
        <div
          class="inline-flex flex-col justify-center relative w-full text-gray-500"
        >
          <div class="relative">
            <input
              type="text"
              class="p-2 pl-8 w-full rounded border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent"
              placeholder="Người ấy là ai :D"
              v-model="searchKeyword"
              @input="search"
            />
            <svg
              class="w-4 h-4 absolute left-2.5 top-3.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <ul
            v-if="suggestList && Object.keys(suggestList).length > 0"
            class="bg-white border border-gray-100 w-full mt-2 overflow-y-auto"
            style="max-height: 50vh"
          >
            <NuxtLink
              :to="localePath(`/chat/${friend.id}`)"
              v-for="friend in suggestList"
              :key="friend.id"
            >
              <li
                class="pl-8 pr-2 py-2 border-gray-100 relative cursor-pointer hover:bg-gray-50 hover:text-gray-900"
              >
                <div class="inline-flex items-center">
                  <NuxtImg
                    class="w-8 h-8 relative rounded-full flex flex-shrink-0"
                    :src="friend.avatar"
                  />
                  <p class="ml-5">
                    {{ friend.name }} <br />
                    {{ friend.username }}
                  </p>
                </div>
              </li>
            </NuxtLink>
          </ul>
          <div v-if="!suggestList || Object.keys(suggestList).length === 0">
            <NuxtImg
              class="block mx-auto mt-10"
              width="300"
              height="300"
              src="/images/view-student-roster.svg"
              alt="student"
            />
          </div>
          <h3
            v-if="suggestList && Object.keys(suggestList).length === 0"
            class="text-center text-xl mt-5"
          >
            Chúng tôi không tìm thấy người bạn nào của bạn!
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: this.$t("meta.chat.title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.chat.description"),
        },
      ],
    };
  },
  async asyncData({ $axios }) {
    const res = await $axios.$get(`/friends/with-messages`);
    const friendsList = res.data;

    return { friendsList };
  },
  data() {
    return {
      searchKeyword: null,
      suggestList: null,
    };
  },
  methods: {
    search:  _.debounce(async function () {
      const res = await this.$axios.post("/friends/search", {
        keyword: this.searchKeyword,
      });
      this.suggestList = res.data.data;
    }, 500)
  },
};
</script>
<style>
.group:hover .group-hover\:block {
  display: block;
}
.hover\:w-64:hover {
  width: 45%;
}
</style>
