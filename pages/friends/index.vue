<template>
  <div>
    <div class="flex items-center justify-center xl:py-10">
      <div
        class="bg-white flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl"
      >
        <!-- Content -->
        <div class="flex-1 px-2 py-10 sm:py-0 sm:px-0">
          <div class="md:flex md:justify-between items-center">
            <h3 class="text-3xl">Bạn bè</h3>
            <div class="search-box mt-5 md:mt-0 xl:inline-flex xl:items-center">
              <NuxtLink
                :to="localePath('/friends/invitations')"
                class="button-blue-small mr-5"
                >Lời mời kết bạn</NuxtLink
              >
              <NuxtLink
                :to="localePath('/friends/new')"
                class="button-blue-small mr-5"
                >Thêm bạn</NuxtLink
              >
              <div class="relative ml-5 mt-5 xl:mt-0">
                <label>
                  <input
                    class="rounded mb-5 xl:mb-0 py-2 pr-6 pl-10 w-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
                    type="text"
                    v-model="searchKeyword"
                    placeholder="Tìm kiếm"
                  />
                  <span class="absolute top-0 left-0 mt-2 ml-3 inline-block">
                    <svg viewBox="0 0 24 24" class="w-6 h-6">
                      <path
                        fill="#bbb"
                        d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                      />
                    </svg>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div
            class="mb-10 sm:mb-0 mt-10 md:px-10 grid gap-4 md:grid-cols-2 overflow-y-auto"
            style="max-height: 69vh"
          >
            <div
              class="col-span-1 md:col-span-2 lg:col-span-3"
              v-if="
                Object.keys(filteredFriends).length === 0 ||
                filteredFriends.length === 0
              "
            >
              <h1 class="text-center text-2xl font-extrabold mt-20">
                Bạn không có lời mời kết bạn nào!
              </h1>

              <NuxtImg
                class="block mx-auto mt-10"
                width="300"
                height="300"
                src="/images/empty-exercise.svg"
                alt="student"
              />
            </div>
            <div v-for="friend in filteredFriends" :key="friend.id">
              <div
                @click="$router.push(localePath(`/chat/${friend.id}`))"
                class="bg-gray-100 py-5 px-4 flex justify-between space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-200 hover:font-extrabold hover:smooth-hover"
              >
                <div class="flex items-center">
                  <NuxtImg
                    class="w-10 h-10 rounded-full my-auto object-cover object-center"
                    :src="friend.avatar"
                    :alt="friend.name"
                  />
                  <span class="my-auto ml-5"> {{ friend.name }} </span>
                </div>

                <div class="my-auto font-bold ml-5">
                  <span
                    @click.stop.prevent="toggleModal(friend.id)"
                    title="Xóa kết bạn"
                    class="block rounded-full text-sm ml-6 text-center cursor-pointer bg-red-500 hover:bg-red-700 text-white w-10 h-10 p-2"
                  >
                    <i class="fas fa-user-alt-slash"></i>
                  </span>
                </div>
              </div>
              <ConfirmModal
                class="hidden"
                title="Xóa bạn bè"
                :content="`Bạn có chắc muốn xóa kết bạn với ${friend.name}?`"
                :id="`modal-${friend.id}`"
                @toggle-modal="toggleModal(friend.id)"
                @submit="submit(friend.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  head() {
    return {
      title: this.$t("meta.friends.title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.friends.description"),
        },
      ],
    };
  },
  async asyncData({ $axios }) {
    const res = await $axios.$get(
      `/friends/all`
    );
    const friends = res.data;
    const filteredFriends = res.data;

    return { friends, filteredFriends };
  },
  computed: {
    user() {
  return this.$auth.user;
},
  },
  data() {
    return {
      searchKeyword: null,
    };
  },
  methods: {
    toggleModal(id) {
      document.querySelector(`#modal-${id}`).classList.toggle("hidden");
    },
    async submit(friendId) {
      try {
        await this.$axios.$get(`/friends/${friendId}/remove`);
        this.$toast.success("Xóa bạn bè thành công!");

        this.filteredFriends = this.filteredFriends.filter(
          (friend) => friend.id !== friendId
        );
      } catch (e) {
        this.$toast.error("Xóa bạn bè thất bại!");
      }
    },
    nonAccentVietnamese(str) {
      str = str.toLowerCase();
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
      str = str.replace(/\u02C6|\u0306|\u031B/g, "");

      return str;
    },
  },
  watch: {
    searchKeyword() {
      this.filteredFriends = this.friends.filter((x) =>
        this.nonAccentVietnamese(x.name).includes(this.searchKeyword)
      );
    },
  },
};
</script>
