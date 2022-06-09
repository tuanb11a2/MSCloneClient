<template>
  <div class="mb-20 grid grid-cols-5">
    <GroupSideNav
      v-if="visibleSideNav"
      @create-channel="createChannel"
      :group="group"
      class="col-span-4 hidden xl:block xl:col-span-1"
    />
    <div class="col-span-5" :class="{ 'xl:col-span-4': visibleSideNav }">
      <div
        class="flex justify-between border-b px-4 md:px-20 sticky top-0 bg-white !h-14"
      ></div>
      <div class="p-5">
        <div class="flex justify-between my-5">
          <h1 class="font-bold text-xl">Danh sách thành viên</h1>
          <button class="button-blue-small" @click="toggleAddMembersModal">
            Thêm thành viên
          </button>
          <AddMemberModal
            v-if="visibleAddMembers"
            @toggle-modal="toggleAddMembersModal"
            @submit="submitAddMembers"
          />
        </div>
        <div class="w-full overflow-hidden rounded-lg shadow-xs">
          <div class="w-full overflow-x-auto">
            <table class="w-full whitespace-no-wrap">
              <thead>
                <tr
                  class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                >
                  <th class="px-4 py-3">Tên</th>
                  <th class="px-4 py-3">Tên người dùng</th>
                  <th class="px-4 py-3">Số bài viết</th>
                  <th class="px-4 py-3">Ngày gia nhập</th>
                  <th class="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <div
                class="px-4 md:px-20"
                v-if="Object.keys(users).length === 0"
              >
                <h1 class="text-center text-2xl font-extrabold mt-20">
                  Không có người dùng nào ở đây.
                </h1>

                <NuxtImg
                  class="block mx-auto mt-10"
                  width="300"
                  height="300"
                  src="/images/empty-exercise.svg"
                  alt="student"
                />
              </div>
              <tbody
                v-else
                class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800"
              >
                <tr
                  v-for="user in users"
                  :key="`user-${user.id}`"
                  class="text-gray-700 dark:text-gray-400"
                >
                  <td class="px-4 py-3">
                    <div class="flex items-center text-sm">
                      <!-- Avatar with inset shadow -->
                      <div
                        class="relative hidden w-8 h-8 mr-3 rounded-full md:block"
                      >
                        <NuxtImg
                          class="object-cover w-full h-full rounded-full"
                          :src="user.avatar"
                          :alt="user.name"
                          loading="lazy"
                        />
                        <div
                          class="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p class="font-semibold">{{ user.name }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">
                          {{ user.email }}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm">{{ user.username }}</td>
                  <td class="px-4 py-3 text-xs">
                    <span
                      class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100"
                    >
                      {{ user.posts.length }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm">
                    {{ $moment(user.pivot.created_at).format("DD/MM/YYYY") }}
                  </td>
                  <td class="text-center">
                    <i
                      title="Xóa thành viên khỏi nhóm"
                      @click="toggleRemoveModal(user.id)"
                      class="fas fa-user-times cursor-pointer hover:bg-gray-100 text-red-500"
                    ></i>
                  </td>
                  <ClientOnly>
                    <ConfirmModal
                      class="hidden"
                      title="Xóa thành viên"
                      :content="`Bạn có chắc muốn xóa ${user.name} khỏi nhóm không?`"
                      :id="`delete-modal-${user.id}`"
                      @toggle-modal="toggleRemoveModal(user.id)"
                      @submit="removeUser(user.id)"
                    >
                    </ConfirmModal>
                  </ClientOnly>
                </tr>
              </tbody>
            </table>
            <div class="mt-5">
              <t-pagination
                :total-items="pagination.total"
                :per-page="pagination.per_page"
                :limit="5"
                @change="changePage"
                v-model="currentPage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  async asyncData({ $axios, route, store }) {
    const pluck = (array, key) => {
      return array.map((o) => o[key]);
    };1
    const res = await $axios.$get(`/groups/${route.params.id}`);
    const group = res.data;
    const userRes = await $axios.$get(`/groups/${route.params.id}/users`);
    const users = userRes.data;
    const pagination = userRes.meta.pagination;

    const friendRes = await $axios.$get(
      `/friends/all`
    );

    let friendsList = friendRes.data;
    if (friendsList.length > 0 && group.users) {
      friendsList = friendsList.filter(
        (x) => !pluck(group.users, "id").includes(x.id)
      );
    }
    return { group, users, friendsList, pagination };
  },

  data() {
    return {
      channel: {
        name: null,
      },
      currentPage: 1,
      visibleSideNav: true,
      visibleAddMembers: false,
      selectedFriends: [],
    };
  },
  mounted() {
    if (
      !this.pluck(this.users, "id").includes(
        this.$store.getters["auth/user"].id
      )
    ) {
      this.$router.push("/groups");
      this.$toast.error("Bạn không có quyền truy cập vào nhóm này");
    }
  },
  methods: {
    toggleRemoveModal(id) {
      document.querySelector(`#delete-modal-${id}`).classList.toggle("hidden");
    },
    async removeUser(id) {
      try {
        await this.$axios.$delete(
          `/groups/${this.group.id}/remove-member/${id}`
        );
        this.$toast.success("Xóa thành công");
        this.toggleRemoveModal(id);

        this.users = this.users.filter((x) => x.id !== id);
      } catch (e) {
        this.$toast.error(e.response.data.message);
      }
    },
    pluck(array, key) {
      return array.map((o) => o[key]);
    },

    toggleAddMembersModal() {
      this.visibleAddMembers = !this.visibleAddMembers;
    },
    async submitAddMembers() {
      try {
        await this.$axios.$post(`/groups/${this.group.id}/add-members`, {
          users: this.selectedFriends,
        });
        this.friendsList = this.friendsList.filter(
          (x) => !this.pluck(this.selectedFriends, "id").includes(x.id)
        );
        this.selectedFriends.forEach((x) => {
          this.users.push({
            id: x.id,
            email: x.email,
            username: x.username,
            name: x.name,
            avatar: x.avatar,
            posts: [],
            pivot: {
              created_at: new Date(),
            },
          });
        });
        this.selectedFriends = [];
        this.$toast.success("Thêm thành viên thành công!");
      } catch (e) {
        this.$toast.error(e.response.data.meta.message);
      } finally {
        this.visibleAddMembers = false;
      }
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

    async changePage() {
      const res = await this.$axios.$get(
        `/groups/${this.group.slug}/users?page=${this.currentPage}`
      );
      this.users = res.data;
      this.pagination = res.meta.pagination;
    },
  },
};
</script>
