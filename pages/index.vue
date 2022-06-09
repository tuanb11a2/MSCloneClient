<template>
  <div>
    <div class="spinner" v-if="$fetchState.pending">
      <LoadingIcon />
    </div>
    <div
      v-else
      class="flex border justify-center h-screen transition ease-in-out delay-150 duration-300"
    >
      <div
        :class="$parent.$parent.isSideMenuOpen ? 'left-64' : 'left-0'"
        class="w-1/5 h-full hidden fixed bg-white border top-18 xl:flex flex-col"
      >
        <span class="font-bold pt-4 pb-2 text-gray-500 px-4 text-lg"
          >Chào mừng tới LT Meet!</span
        >
        <ul class="pt-0 p-4">
          <li class="">
            <NuxtLink
              :to="localePath('/')"
              class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-all dark:text-dark-txt"
            >
              <NuxtImg :src="user.avatar" class="w-10 mr-2 h-10 rounded-full" />
              <span class="font-semibold">{{ user.name }}</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="localePath('/friends')"
              class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-all dark:text-dark-txt"
            >
              <i class="fas fa-user-friends text-3xl mr-2"></i>
              <span class="font-semibold">Bạn bè</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              :to="localePath('/groups')"
              class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-all dark:text-dark-txt"
            >
              <i class="text-3xl rounded-full mr-2 fas fa-users"></i>
              <span class="font-semibold">Nhóm của bạn</span>
            </NuxtLink>
          </li>

          <li class="border-b border-gray-200 dark:border-dark-third mt-6"></li>
        </ul>

        <ul class="">
          <li class="font-bold text-gray-500 px-4 text-lg">Lối tắt của bạn</li>
          <div v-if="groups && Object.keys(groups).length > 0">
            <li
              class="px-4 py-2"
              v-for="group in groups.slice(0, 8)"
              :key="`group-${group.id}`"
            >
              <NuxtLink
                :to="localePath(`/groups/${group.slug}/channels/general`)"
                class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-all dark:text-dark-txt"
              >
                <NuxtImg :src="group.avatar" class="w-10 h-10 rounded-lg" />
                <span class="font-semibold">{{ group.name }}</span>
              </NuxtLink>
            </li>
          </div>
        </ul>
      </div>
      <!-- END LEFT MENU -->

      <!-- MAIN CONTENT -->
      <div class="w-full lg:w-2/3 xl:w-2/5 px-2 overflow-y-auto">
        <div v-if="posts && Object.keys(posts).length === 0">
          <h1 class="text-center px-5 text-2xl font-extrabold mt-20">
            Chào mừng bạn đến với LT Meet
          </h1>
          <h3 class="text-center px-5 text-xl mt-5">
            Hãy gia nhập 1 nhóm để trải nghiệm những tính năng của chúng tôi!
          </h3>
          <NuxtImg
            class="block mx-auto mt-10"
            width="300"
            height="300"
            src="/images/view-student-roster.svg"
            alt="student"
          />
        </div>
        <div v-else v-for="post in posts" :key="post.id" class="my-5">
          <div class="flex mt-3 w-full">
            <div class="flex-shrink-0 mr-3">
              <NuxtImg
                class="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
                :src="post.user.avatar"
                :alt="post.user.name"
              />
            </div>
            <div
              class="bg-white border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed"
            >
              <div class="flex justify-between">
                <div>
                  <strong>{{ post.user.name }}</strong>
                  <span class="text-xs text-gray-400 ml-2">{{
                    $moment(post.updated_at).fromNow()
                  }}</span>
                </div>
                <NuxtLink
                  class="text-blue-500 hover:underline"
                  :to="
                    localePath(
                      `/groups/${post.channel.group.slug}/channels/${post.channel.slug}`
                    )
                  "
                  >{{ post.channel.group.name }}</NuxtLink
                >
              </div>

              <p class="text-sm">
                {{ post.content }}
              </p>
              <div
                class="mt-4 border-t flex items-center"
                v-if="post.comments.length > 0"
              >
                <div class="text-sm text-gray-500 mt-4 font-semibold">
                  <div class="text-blue-500 cursor-pointer">
                    {{ post.comments.length }} trả lời từ
                    <span
                      v-for="(name, index) in pluck(
                        pluck(post.comments, 'user'),
                        'name'
                      ).filter((v, i, a) => a.indexOf(v) === i)"
                      :key="name"
                    >
                      <span v-if="index > 0"> và </span>{{ name }}</span
                    >
                  </div>
                  <div
                    v-for="comment in post.comments"
                    :key="comment.id"
                    class="space-y-4 mt-5"
                  >
                    <div class="flex">
                      <div class="flex-shrink-0 mr-3">
                        <NuxtImg
                          class="mt-3 rounded-full w-6 h-6 sm:w-8 sm:h-8"
                          :src="comment.user.avatar"
                          :alt="comment.user.name"
                        />
                      </div>
                      <div
                        :class="{
                          '!bg-blue-500 !text-white':
                            comment.user_id === $store.getters['auth/user'].id,
                        }"
                        class="flex-1 text-black bg-gray-100 rounded-lg px-4 py-2 sm:px-6 sm:py-4"
                      >
                        <strong>{{ comment.user.name }}</strong>
                        <span
                          class="text-xs ml-3"
                          :class="{
                            'text-white':
                              comment.user_id ===
                              $store.getters['auth/user'].id,
                          }"
                          >{{ $moment(comment.updated_at).fromNow() }}</span
                        >

                        <div class="font-normal text-xs sm:text-sm">
                          {{ comment.content }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="cursor-pointer text-sm mt-3"
                @click="showReplyInput(post.id)"
              >
                <i class="fas fa-reply mr-2"></i>Trả lời
                <br />
                <input
                  placeholder="Nhập bình luận của bạn"
                  :id="`post${post.id}`"
                  class="w-full !rounded-none border-0 border-b !border-blue-500 hidden text-sm mt-3"
                  type="text"
                  v-model="comment"
                  @keyup.enter="postComment(post)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-1/5 h-full bg-white fixed right-0 top-18 border hidden xl:block px-4"
      >
        <div class="h-full">
          <div class="flex justify-between items-center px-4 pt-4">
            <span class="font-semibold w-1/2 text-gray-500 text-lg"
              >Lời mời kết bạn mới</span
            >
            <NuxtLink
              :to="localePath('/friends/invitations')"
              class="text-blue-500 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              >Xem tất cả</NuxtLink
            >
          </div>
          <div
            class="p-2"
            v-if="pendingFriends && Object.keys(pendingFriends).length > 0"
          >
            <div
              v-for="friend in pendingFriends.slice(0, 3)"
              :key="friend.id"
              class="flex items-center space-x-4 p-2 rounded-lg transition-all"
            >
              <!-- <NuxtImg :src="friend.avatar" class="w-16 h-16 rounded-full" /> -->
              <div class="flex-1 h-full">
                <div class="dark:text-dark-txt">
                  <span class="font-semibold">{{ friend.name }}</span>
                </div>
                <div class="flex space-x-2 mt-2">
                  <div
                    @click="acceptFriend(friend.id)"
                    class="w-1/2 bg-blue-500 hover:bg-blue-700 cursor-pointer py-2 text-sm text-center text-white rounded-lg"
                  >
                    Đồng ý
                  </div>
                  <div
                    @click="declineFriend(friend.id)"
                    class="w-1/2 bg-black text-white cursor-pointer py-2 text-center text-sm hover:bg-gray-700 rounded-lg"
                  >
                    Từ chối
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="border-b border-gray-200 dark:border-dark-third mt-6"
          ></div>
          <!-- CONTACTS -->
          <div
            class="flex justify-between items-center px-4 pt-4 text-gray-500 dark:text-dark-txt"
          >
            <span class="font-semibold text-lg">Danh sách bạn bè</span>
          </div>
          <ul class="p-2 h-1/2 overflow-y-auto">
            <li v-for="friend in allFriends" :key="`all-friend-${friend.id}`">
              <NuxtLink
                :to="localePath(`/chat/${friend.id}`)"
                class="flex items-center space-x-4 p-2 hover:bg-gray-100 dark:text-dark-txt rounded-lg cursor-pointer"
              >
                <div class="relative">
                  <NuxtImg
                    :src="friend.avatar"
                    :alt="friend.name"
                    class="rounded-full w-8 h-8"
                  />
                  <span
                    class="bg-green-500 w-3 h-3 rounded-full absolute right-0 top-3/4 border-white border-2"
                  ></span>
                </div>
                <div>
                  <span class="font-semibold">{{ friend.name }}</span>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import VirtualList from "vue-virtual-scroll-list";

export default {
  head() {
    return {
      title: this.$t("meta.index.title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.index.description"),
        },
      ],
    };
  },
  components: { "virtual-list": VirtualList },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  async fetch() {
    try {
      const res = await this.$axios.get("/feed");
      const pendingFriendsRes = await this.$axios.$get(`/friends/pending`);
      const allFriendsRes = await this.$axios.$get(`/friends/all`);
      const groupRes = await this.$axios.$get("/groups");
      this.posts = res.data.data;
      this.allFriends = allFriendsRes.data;
      this.pendingFriends = pendingFriendsRes.data;
      this.groups = groupRes.data;
    } catch (err) {
    } finally {
    }
  },
  data() {
    return {
      comment: "",
      posts: null,
      allFriends: null,
      pendingFriends: null,
      groups: null,
    };
  },
  methods: {
    pluck(array, key) {
      return array.map((o) => o[key]);
    },
    showReplyInput(id) {
      document.getElementById(`post${id}`).classList.remove("hidden");
    },
    async postComment(post) {
      if (!this.comment) {
        return;
      }
      let currentPost = this.posts.find((x) => x.id === post.id);
      try {
        const res = await this.$axios.$post(
          `/channels/${post.channel_id}/posts/${post.id}/comments`,
          {
            content: this.comment,
          }
        );
        currentPost.comments.push(res.data);
        this.$toast.success("Bình luận của bạn đã được gửi");
        this.comment = "";
      } catch (e) {
        this.$toast.error(e.response.data.message);
      }
    },
    async acceptFriend(id) {
      try {
        await this.$axios.$get(`/friends/${id}/accept`);
        this.$toast.success("Bạn đã chấp nhận lời mời kết bạn!");
        this.pendingFriends = this.pendingFriends.filter((x) => x.id !== id);
      } catch (e) {
        this.$toast.error(e.response.data.message);
      }
    },

    async declineFriend(id) {
      try {
        await this.$axios.$get(`/friends/${id}/decline`);
        this.$toast.success("Bạn đã từ chối lời mời kết bạn");
        this.pendingFriends = this.pendingFriends.filter((x) => x.id !== id);
      } catch (e) {
        this.$toast.error(e.response.data.message);
      }
    },
  },
};
</script>
