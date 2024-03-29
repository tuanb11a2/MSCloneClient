<template>
  <div>
    <div v-if="groups" class="flex items-center justify-center xl:py-10">
      <div
        class="bg-white flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl"
      >
        <!-- Content -->
        <div class="flex-1 px-2 py-10 sm:py-0 sm:px-0">
          <div class="md:flex md:justify-between items-center">
            <h3 class="text-3xl">Nhóm của bạn</h3>
            <div class="search-box mt-5 md:mt-0 xl:inline-flex xl:items-center">
              <span @click="toggleModal" class="mr-5 button-blue-small"
                >Tạo nhóm mới <i class="fas fa-plus ml-2"></i
              ></span>
              <NuxtLink
                :to="localePath('/groups/others')"
                class="mr-5 button-blue-small"
                >Gia nhập nhóm <i class="fas fa-user-plus ml-2"></i
              ></NuxtLink>
              <div class="relative my-5 xl:my-0">
                <label>
                  <input
                    class="rounded py-2 pr-6 pl-10 w-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
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
            class="mb-10 sm:mb-0 mt-10 md:px-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto"
            style="max-height: 69vh"
          >
            <div
              class="col-span-full"
              v-if="
                Object.keys(filteredGroups).length === 0 ||
                filteredGroups.length === 0
              "
            >
              <h1 class="text-center text-2xl font-extrabold mt-20">
                Bạn chưa tham gia vào nhóm nào!
              </h1>

              <NuxtImg
                class="block mx-auto mt-10"
                width="300"
                height="300"
                src="/images/empty-exercise.svg"
                alt="student"
              />
            </div>
            <div
              class="col-span-1"
              v-for="group in filteredGroups"
              :key="group.id"
            >
              <div
                @click="
                  $router.push(
                    localePath(`/groups/${group.slug}/channels/general`)
                  )
                "
                class="relative group bg-gray-100 py-10 sm:py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-200 hover:smooth-hover"
              >
                <NuxtImg
                  v-if="group.avatar"
                  class="w-20 h-20 mb-3 object-cover object-center rounded-full"
                  :src="group.avatar"
                  alt="cuisine"
                />
                <h4 class="w-40 truncate font-bold capitalize text-center">
                  {{ group.name }}
                </h4>
                <p class="">{{ group.users_count }} thành viên</p>
                <p class="absolute top-2 inline-flex items-center text-xs">
                  {{ group.users_count }} trực tuyến
                  <span
                    class="ml-2 w-2 h-2 block bg-green-500 rounded-full group-hover:animate-pulse"
                  ></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateGroupModal
      v-if="visible"
      @toggle-modal="toggleModal"
      @submit="submit"
    />
    <AddMemberModal
      v-if="visibleAddMember"
      @toggle-modal="toggleAddMemberModal"
      @submit="submitAddMember"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  head() {
    return {
      title: this.$t("meta.groups.title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.groups.description"),
        },
      ],
    };
  },
  async fetch() {
    this.$loadingPage.open();
    try {
      const res = await this.$axios.$get("/groups");
      const friendRes = await this.$axios.$get(`/friends/all`);
      this.groups = res.data;
      this.filteredGroups = res.data;
      this.friendsList = friendRes.data;
    } catch (e) {
      this.$router.push("/server-error");
    } finally {
      this.$loadingPage.close();
    }
  },
  computed: {
    user() {
  return this.$auth.user;
},
  },
  data() {
    return {
      newGroup: {
        name: null,
        description: null,
        privacy: "private",
        user_id: null,
        avatar: null,
      },
      groups: null,
      filteredGroups: null,
      friendsList: null,
      selectedFriends: [],
      visible: false,
      visibleAddMember: false,
      searchKeyword: null,
    };
  },
  validations: {
    newGroup: {
      name: { required, maxLength: maxLength(255) },
      description: { maxLength: maxLength(255) },
    },
  },
  methods: {
    toggleModal() {
      this.visible = !this.visible;
    },
    toggleAddMemberModal() {
      this.visibleAddMember = !this.visibleAddMember;
      this.$router.push(
        this.localePath(`/groups/${this.newGroup.slug}/channels/general`)
      );
    },
    async submit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      const formData = new FormData();
      formData.append("name", this.newGroup.name);
      formData.append("description", this.newGroup.description);
      formData.append("privacy", this.newGroup.privacy);
      formData.append("user_id", this.newGroup.user_id);
      formData.append("avatar", this.newGroup.avatar);

      try {
        const res = await this.$axios.post("/groups", formData);
        this.toggleModal();
        this.visibleAddMember = !this.visibleAddMember;
        this.newGroup = res.data.data;
      } catch (e) {}
    },
    async submitAddMember() {
      try {
        await this.$axios.$post(`/groups/${this.newGroup.id}/add-members`, {
          users: this.selectedFriends,
        });
        this.$router.push(
          this.localePath(`/groups/${this.newGroup.slug}/channels/general`)
        );
      } catch (e) {}
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
      this.filteredGroups = this.groups.filter((x) =>
        this.nonAccentVietnamese(x.name).includes(this.searchKeyword)
      );
    },
  },
  mounted() {
    this.newGroup.user_id = this.user.id;
  },
};
</script>
