<template>
  <div class="sticky border-b px-4 md:px-20 top-0 bg-white !h-32 xl:!h-14">
    <div
      class="flex justify-between "
    >
      <ul class="flex items-center">
        <li class="mr-10 hidden xl:block">
          <i
            class="fas fa-hamburger text-3xl text-cyan-700 cursor-pointer"
            title="Ẩn/hiện danh sách kênh"
            @click="$parent.toggleVisibleSideNav"
          ></i>
        </li>
        <li class="mr-5">
          <NuxtLink
            :to="localePath(`/groups/${$parent.group.slug}/channels/general`)"
          >
            <NuxtImg
              v-if="$parent.group.avatar"
              class="mt-2 rounded-full w-10 h-10"
              :src="$parent.group.avatar"
              :alt="$parent.group.name"
            />
          </NuxtLink>
        </li>
        <li class="flex items-center mr-3">
          <h1 class="font-bold w-20 truncate">{{ $parent.channel.name }}</h1>
        </li>
        <li
          class="mr-2 inline-block py-4 px-4 text-gray-500 text-sm font-medium text-center cursor-pointer"
          :class="{
            ' text-blue-600 rounded-t-lg border-b-2 border-blue-600 active':
              $parent.tab === 'posts',
          }"
          @click="$parent.tab = 'posts'"
        >
          <span class="font-extrabold py-4">Bài đăng</span>
        </li>
        <li
          class="mr-2 inline-block py-4 px-4 text-gray-500 text-sm font-medium text-center cursor-pointer"
          :class="{
            ' text-blue-600 rounded-t-lg border-b-2 border-blue-600 active':
              $parent.tab === 'exercises',
          }"
          @click="$parent.tab = 'exercises'"
        >
          <span class="font-extrabold py-4">Bài tập</span>
        </li>
      </ul>
      <div class="xl:flex items-center hidden">
        <button class="button-blue-small !mr-5" @click="toggleCallModal">
          Cuộc họp mới
        </button>
        <button class="button-blue-small" @click="toggleCreatePostModal">
          Bài đăng mới
        </button>
        <i
          @click="toggleSettingsVisibility"
          class="fas fa-ellipsis-h cursor-pointer text-gray-500 ml-3"
          title="Cài đặt"
        >
        </i>
        <Dropdown
          @toggle-leave-group="toggleLeaveGroupModal"
          @toggle-add-members-modal="toggleAddMembersModal"
          @toggle-delete-group-modal="toggleDeleteGroupModal"
          @to-group-settings="
            $router.push(localePath(`/groups/${group.slug}/settings`))
          "
          @to-channel-settings="
            $router.push(
              localePath(
                `/groups/${group.slug}/channels/${channel.slug}/settings`
              )
            )
          "
          v-if="visibleSettings"
          :items="dropDownItems"
        />
      </div>
      <ConfirmModal
        v-if="visibleLeaveGroup"
        title="Xác nhận rời khỏi nhóm"
        content="Bạn có chắc muốn rời khỏi nhóm này không?"
        @toggle-modal="toggleLeaveGroupModal"
        @submit="leaveGroup"
      />
      <ConfirmModal
        v-if="visibleDeleteGroup"
        title="Xác nhận xóa nhóm"
        :content="`Bạn có chắc muốn xóa nhóm ${group.name} gồm ${group.users.length} thành viên không ?`"
        @toggle-modal="toggleDeleteGroupModal"
        @submit="deleteGroup"
      />
      <AddMemberModal
        v-if="visibleAddMembers"
        @toggle-modal="toggleAddMembersModal"
        @submit="submitAddMembers"
      />
      <CreatePostModal
        v-if="visibleCreatePost"
        @toggle-modal="toggleCreatePostModal"
        @submit="submitCreatePost"
        :post="newPost"
      />
      <CallModal
        v-if="visibleCallModal"
        @toggle-modal="toggleCallModal"
        @submit="submitCallModal"
      />
    </div>
    <div class="flex items-center xl:hidden py-5">
      <button class="button-blue-small !mr-5" @click="toggleCallModal">
        Cuộc họp mới
      </button>
      <button class="button-blue-small" @click="toggleCreatePostModal">
        Bài đăng mới
      </button>
      <i
        @click="toggleSettingsVisibility"
        class="fas fa-ellipsis-h cursor-pointer text-gray-500 ml-3"
        title="Cài đặt"
      >
      </i>
      <Dropdown
        @toggle-leave-group="toggleLeaveGroupModal"
        @toggle-add-members-modal="toggleAddMembersModal"
        @toggle-delete-group-modal="toggleDeleteGroupModal"
        @to-group-settings="
          $router.push(localePath(`/groups/${group.slug}/settings`))
        "
        @to-channel-settings="
          $router.push(
            localePath(
              `/groups/${group.slug}/channels/${channel.slug}/settings`
            )
          )
        "
        v-if="visibleSettings"
        :items="dropDownItems"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  props: {
    group: {
      required: true,
      type: Object,
    },
    friendsList: {
      required: true,
      type: Array | Object,
    },
    channel: {
      required: true,
      type: Object,
    },
  },
  computed: {
    user() {
  return this.$auth.user;
},
  },
  data() {
    return {
      showMoreMenu: false,
      visibleCallModal: false,
      dropDownItems: [
        {
          text: "Thêm thành viên",
          icon: "fas fa-user-plus",
          action: "toggle-add-members-modal",
        },
        {
          text: "Rời khỏi nhóm",
          icon: "fas fa-user-alt-slash",
          action: "toggle-leave-group",
        },
        {
          text: "Cài đặt kênh",
          icon: "fas fa-cog",
          action: "to-channel-settings",
        },
        {
          text: "Cài đặt nhóm",
          icon: "fas fa-cog",
          action: "to-group-settings",
        },
        {
          text: "Xóa nhóm",
          icon: "fas fa-trash-alt",
          action: "toggle-delete-group-modal",
        },
      ],
      selectedFriends: [],
      visibleSettings: false,
      visibleLeaveGroup: false,
      visibleAddMembers: false,
      visibleDeleteGroup: false,
      visibleCreatePost: false,
      serverError: null,
      newPost: {
        content: "",
        file: "",
      },
      newCall: {
        content: "",
      },
    };
  },
  validations: {
    newCall: {
      content: { required, maxLength: maxLength(255) },
    },
  },
  methods: {
    toggleMoreMenu() {
      this.showMoreMenu = !this.showMoreMenu;
    },
    toggleSettingsVisibility() {
      this.visibleSettings = !this.visibleSettings;
    },
    toggleLeaveGroupModal() {
      this.toggleSettingsVisibility();
      this.visibleLeaveGroup = !this.visibleLeaveGroup;
    },
    toggleAddMembersModal() {
      this.toggleSettingsVisibility();
      this.visibleAddMembers = !this.visibleAddMembers;
    },
    toggleDeleteGroupModal() {
      this.toggleSettingsVisibility();
      this.visibleDeleteGroup = !this.visibleDeleteGroup;
    },
    toggleCreatePostModal() {
      this.visibleCreatePost = !this.visibleCreatePost;
    },
    toggleCallModal() {
      this.visibleCallModal = !this.visibleCallModal;
    },

    pluck(array, key) {
      return array.map((o) => o[key]);
    },
    async submitAddMembers() {
      try {
        await this.$axios.$post(`/groups/${this.group.id}/add-members`, {
          users: this.selectedFriends,
        });
        this.$emit("add-members-success", this.selectedFriends);
        this.selectedFriends = [];
        this.$toast.success("Thêm thành viên thành công!");
      } catch (e) {
        this.$toast.error(e.response.data.meta.message);
      } finally {
        this.visibleAddMembers = false;
      }
    },
    async leaveGroup() {
      try {
        await this.$axios.get(`/groups/${this.group.id}/leave`);
        this.$toast.success("Bạn đã rời khỏi nhóm!");
        this.$router.push(this.localePath("/groups"));
      } catch (e) {
        this.$toast.error(e.response.data.meta.message);
      } finally {
        this.visibleLeaveGroup = false;
      }
    },
    async deleteGroup() {
      try {
        await this.$axios.delete(`/groups/${this.group.id}`);
        this.$toast.success("Bạn đã xóa nhóm thành công!");
        this.$router.push(this.localePath("/groups"));
      } catch (e) {
        this.$toast.error(e.response.data.meta.message);
      } finally {
        this.visibleDeleteGroup = false;
      }
    },
    async submitCreatePost() {
      try {
        const formData = new FormData();
        if (this.newPost.file) {
          formData.append("file", this.newPost.file);
        }
        formData.append("content", this.newPost.content);

        const res = await this.$axios.$post(
          `/groups/${this.group.id}/channels/${this.channel.id}/posts`,
          formData
        );
        this.$toast.success("Đăng bài thành công!");
        this.$emit("add-post-success", res.data);
        this.newPost.content = "";
        this.newPost.file = null;
      } catch (e) {
        this.$toast.error(e.response.data.meta.message);
      } finally {
        this.visibleCreatePost = false;
      }
    },
    async submitCallModal() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      try {
        const res = await this.$axios.post(
          `/groups/${this.group.id}/channels/${this.channel.id}/calls`,
          this.newCall
        );
        this.$router.push(
          this.localePath(
            `/groups/${this.group.slug}/channels/${this.channel.slug}/calls/${res.data.data.id}`
          )
        );
      } catch (e) {
        this.$toast.error(e.response.data.meta.message);
      }
    },
  },
};
</script>
