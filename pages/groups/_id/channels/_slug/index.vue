<template>
  <div class="mb-20 grid grid-cols-5">
    <GroupSideNav
      v-if="visibleSideNav"
      @create-channel="createChannel"
      :current-channel="channel"
      :group="group"
      class="col-span-4 hidden xl:block xl:col-span-1"
    />
    <div class="col-span-5" :class="{ 'xl:col-span-4': visibleSideNav }">
      <GroupSubNav
        class="z-0"
        :group="group"
        :channel="channel"
        :friends-list="friendsList"
        @add-members-success="addMembersSuccess"
        @add-post-success="addPostSuccess"
      />
      <div v-if="tab === 'posts'">
        <div v-if="Object.keys(channel.posts).length === 0">
          <h1 class="text-center px-5 text-2xl font-extrabold mt-20">
            Chào mừng bạn đến với {{ group.name }}
          </h1>
          <h3 class="text-center px-5 text-xl mt-5">
            Hãy thử @đề cập đến tên lớp hoặc tên học viên để bắt đầu một cuộc
            hội thoại.
          </h3>
          <NuxtImg
            class="block mx-auto mt-10"
            width="300"
            height="300"
            src="/images/view-student-roster.svg"
            alt="student"
          />
        </div>
        <div class="px-4 md:px-20 2xl:px-64 overscroll-y-scroll" v-else>
          <div v-for="post in channel.posts" :key="post.id" class="my-5">
            <div class="divider text-sm font-light">
              {{ $moment(post.updated_at).format("D MMMM, YYYY") }}
            </div>
            <div class="flex mt-3">
              <div class="flex-shrink-0 mr-3">
                <NuxtImg
                  class="mt-2 rounded-full w-8 h-8 sm:w-10 sm:h-10"
                  :src="post.user.avatar"
                  alt=""
                />
              </div>
              <div
                class="flex-1 bg-white border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed"
              >
                <strong>{{ post.user.name }}</strong>
                <span class="text-xs text-gray-400 ml-2">{{
                  $moment(post.updated_at).format("hh:mm A")
                }}</span>
                <p class="text-sm">
                  {{ post.content }}
                </p>
                <NuxtImg
                  v-if="post.file_path"
                  class="post-image"
                  :src="post.file_path"
                />
                <div
                  class="mt-4 border-t flex items-center"
                  v-if="post.comments && post.comments.length > 0"
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
                            alt=""
                          />
                        </div>
                        <div
                          :class="{
                            '!bg-blue-500 !text-white':
                              comment.user_id ===
                              $auth.user.id,
                          }"
                          class="flex-1 text-black bg-gray-100 rounded-lg px-4 py-2 sm:px-6 sm:py-4"
                        >
                          <strong>{{ comment.user.name }}</strong>
                          <span
                            class="text-xs ml-3"
                            :class="{
                              'text-white':
                                comment.user_id ===
                                $auth.user.id,
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
                    @keyup.enter="newComment(post)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <CreatorChannelExercise
          :group="group"
          v-if="user.id === group.creator_id"
          :channel="channel"
        />

        <ChannelExercise v-else :group="group" :channel="channel" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  head() {
    return {
      title: `${this.$t("meta.groups.title")} | ${this.group.name} | ${
        this.channel.name
      } `,
    };
  },
  async asyncData({ $axios, route, store, redirect, app }) {
    const pluck = (array, key) => {
      return array.map((o) => o[key]);
    };
    const res = await $axios.$get(
      `/groups/${route.params.id}/channels/${route.params.slug}`
    );
    const group = res.data.group;
    const channel = res.data.channel;
    if (!pluck(group.users, "id").includes(store.getters["auth/user"].id)) {
      app.$toast.error("Bạn không phải thành viên của nhóm này");
      redirect(`groups/${group.slug}/join`);
    }
    const friendRes = await $axios.$get(`/friends/all`);
    let friendsList = friendRes.data;
    if (friendsList.length > 0) {
      friendsList = friendsList.filter(
        (x) => !pluck(group.users, "id").includes(x.id)
      );
    }

    return { group, channel, friendsList };
  },
  computed: {
    user() {
  return this.$auth.user;
},
  },
  data() {
    return {
      tab: "posts",
      comment: "",
      visibleSideNav: true,
    };
  },
  mounted() {
    if (
      !this.pluck(this.group.users, "id").includes(
        this.$store.getters["auth/user"].id
      )
    ) {
      this.$router.push("/groups");
      this.$toast.error("Bạn không có quyền truy cập vào nhóm này");
    }
    Echo.private(`group-${this.group.id}-channel-${this.channel.id}`).listen(
      ".post.comment",
      (e) => {
        console.log(213);
        let post = this.channel.posts.find((post) => post.id === e.post_id);
        if (e.comment.user_id !== this.$store.getters["auth/user"].id) {
          post.comments.push(e.content);
        }
      }
    );
  },
  methods: {
    toggleVisibleSideNav() {
      this.visibleSideNav = !this.visibleSideNav;
    },
    pluck(array, key) {
      return array.map((o) => o[key]);
    },
    showReplyInput(id) {
      document.getElementById(`post${id}`).classList.remove("hidden");
    },
    async newComment(post) {
      if (!this.comment) {
        return;
      }
      try {
        const res = await this.$axios.$post(
          `/channels/${this.channel.id}/posts/${post.id}/comments`,
          {
            content: this.comment,
          }
        );
        let currentPost = this.channel.posts.find((x) => x.id === post.id);
        currentPost.comments.push(res.data);
        this.$toast.success("Bình luận của bạn đã được gửi");
        this.comment = "";
      } catch (e) {
        this.$toast.error(e.response.data.message);
      }
    },

    addMembersSuccess(selectedFriends) {
      this.friendsList = this.friendsList.filter(
        (x) => !this.pluck(selectedFriends, "id").includes(x.id)
      );
    },

    addPostSuccess(post) {
      this.channel.posts.unshift(post);
    },

    async createChannel(channel) {
      try {
        const res = await this.$axios.post(
          `/groups/${this.group.id}/channels`,
          {
            name: channel.name,
          }
        );
        this.group.channels.push(res.data.data);
        this.$toast.success("Tạo kênh mới thành công");
        this.$router.push(
          this.localePath(
            `/groups/${this.group.slug}/channels/${res.data.data.slug}`
          )
        );
      } catch (e) {
        this.$toast.error(e.response.data.meta.message);
      }
    },
  },
};
</script>
