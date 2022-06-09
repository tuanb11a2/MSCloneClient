<template>
  <div class="border-b px-4 md:px-20 sticky top-0 bg-white !h-32 xl:!h-14">
    <div
      class="flex justify-between "
    >
      <ul class="flex items-center">
        <li class="mr-2">
          <a
            @click="$parent.type = 'all'"
            :class="{
              'text-blue-600 rounded-t-lg border-b-2 border-blue-600 active':
                $parent.type === 'all',
            }"
            class="inline-block cursor-pointer py-4 px-4 text-xs xl:text-sm font-medium text-center hover:text-gray-600 hover:border-gray-300"
            >Tất cả</a
          >
        </li>
        <li class="mr-2">
          <a
            @click="$parent.type = 'ongoing'"
            :class="{
              'text-blue-600 rounded-t-lg border-b-2 border-blue-600 active':
                $parent.type === 'ongoing',
            }"
            class="inline-block cursor-pointer py-4 px-4 text-xs xl:text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300"
            >Đang diễn ra</a
          >
        </li>
        <li class="mr-2">
          <a
            :class="{
              'text-blue-600 rounded-t-lg border-b-2 border-blue-600 active':
                $parent.type === 'closed',
            }"
            @click="$parent.type = 'closed'"
            class="inline-block cursor-pointer py-4 px-4 text-xs xl:text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300"
            >Đã đóng</a
          >
        </li>
        <li class="mr-2">
          <a
            :class="{
              'text-blue-600 rounded-t-lg border-b-2 border-blue-600 active':
                $parent.type === 'submitted',
            }"
            @click="$parent.type = 'submitted'"
            class="inline-block cursor-pointer py-4 px-4 text-xs xl:text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300"
            >Đã nộp</a
          >
        </li>
        <div class="xl:flex flex-col items-center hidden">
          <div class="w-64 flex flex-col items-center">
            <div class="w-full px-4">
              <div class="flex flex-col items-center relative">
                <div class="w-full" v-click-outside="closeSearchDropdown">
                  <div class="my-2 p-1 bg-gray-100 flex">
                    <input
                      v-model="$parent.selectedGroup"
                      @focus="showSearchDropdown = true"
                      class="p-1 px-2 bg-gray-100 appearance-none outline-none w-full text-gray-800"
                    />
                    <input type="hidden" v-model="$parent.selectedGroupId" />
                    <button
                      v-if="$parent.selectedGroup"
                      class="fas fa-times mr-3"
                      @click="$parent.selectedGroup = ''"
                    ></button>
                    <div class="text-gray-300 w-8 flex items-center">
                      <button
                        @click="toggleSearchDropdown"
                        class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                      >
                        <i v-if="!showSearchDropdown" class="fas fa-eye"></i>
                        <i
                          class="fas fa-eye-slash"
                          v-if="showSearchDropdown"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  v-if="showSearchDropdown"
                  class="absolute shadow bg-white top-14 z-40 w-full h-40 overflow-y-auto"
                >
                  <div class="flex flex-col w-full">
                    <div>
                      <div
                        @click="
                          changeGroup({
                            id: null,
                            name: 'Tất cả lớp học',
                          })
                        "
                        class="flex w-full items-center p-2 pl-2 cursor-pointer hover:bg-gray-100 relative"
                      >
                        <div class="w-6 flex flex-col items-center">
                          <div
                            class="flex relative w-5 h-5 bg-orange-500 justify-center items-center m-1 mr-2 mt-1 rounded-full"
                          ></div>
                        </div>
                        <div class="w-full items-center flex">
                          <div class="mx-2 -mt-1">
                            <div
                              class="text-xs truncate hover:font-bold w-full normal-case font-normal -mt-1 text-gray-500"
                            >
                              Tất cả lớp học
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-for="group in $parent.groups" :key="group.id">
                      <div v-if="filterGroup(group)">
                        <div
                          @click="changeGroup(group)"
                          class="flex w-full items-center p-2 pl-2 cursor-pointer hover:bg-gray-100 relative"
                        >
                          <div class="w-6 flex flex-col items-center">
                            <div
                              class="flex relative w-5 h-5 bg-orange-500 justify-center items-center m-1 mr-2 mt-1 rounded-full"
                            >
                              <NuxtImg
                                :src="group.avatar"
                                :alt="group.name"
                                class="rounded-full"
                              />
                            </div>
                          </div>
                          <div class="w-full items-center flex">
                            <div class="mx-2 -mt-1">
                              <div
                                class="text-xs truncate hover:font-bold w-full normal-case font-normal -mt-1 text-gray-500"
                              >
                                {{ group.name }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ul>
    </div>
    <div class="flex flex-col items-center mt-2 xl:hidden">
          <div class="w-64 flex flex-col items-center">
            <div class="w-full px-4">
              <div class="flex flex-col items-center relative">
                <div class="w-full" v-click-outside="closeSearchDropdown">
                  <div class="my-2 p-1 bg-gray-100 flex">
                    <input
                      v-model="$parent.selectedGroup"
                      @focus="showSearchDropdown = true"
                      class="p-1 px-2 bg-gray-100 appearance-none outline-none w-full text-gray-800"
                    />
                    <input type="hidden" v-model="$parent.selectedGroupId" />
                    <button
                      v-if="$parent.selectedGroup"
                      class="fas fa-times mr-3"
                      @click="$parent.selectedGroup = ''"
                    ></button>
                    <div class="text-gray-300 w-8 flex items-center">
                      <button
                        @click="toggleSearchDropdown"
                        class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                      >
                        <i v-if="!showSearchDropdown" class="fas fa-eye"></i>
                        <i
                          class="fas fa-eye-slash"
                          v-if="showSearchDropdown"
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  v-if="showSearchDropdown"
                  class="absolute shadow bg-white top-14 z-40 w-full h-40 overflow-y-auto"
                >
                  <div class="flex flex-col w-full">
                    <div>
                      <div
                        @click="
                          changeGroup({
                            id: null,
                            name: 'Tất cả lớp học',
                          })
                        "
                        class="flex w-full items-center p-2 pl-2 cursor-pointer hover:bg-gray-100 relative"
                      >
                        <div class="w-6 flex flex-col items-center">
                          <div
                            class="flex relative w-5 h-5 bg-orange-500 justify-center items-center m-1 mr-2 mt-1 rounded-full"
                          ></div>
                        </div>
                        <div class="w-full items-center flex">
                          <div class="mx-2 -mt-1">
                            <div
                              class="text-xs truncate hover:font-bold w-full normal-case font-normal -mt-1 text-gray-500"
                            >
                              Tất cả lớp học
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-for="group in $parent.groups" :key="group.id">
                      <div v-if="filterGroup(group)">
                        <div
                          @click="changeGroup(group)"
                          class="flex w-full items-center p-2 pl-2 cursor-pointer hover:bg-gray-100 relative"
                        >
                          <div class="w-6 flex flex-col items-center">
                            <div
                              class="flex relative w-5 h-5 bg-orange-500 justify-center items-center m-1 mr-2 mt-1 rounded-full"
                            >
                              <NuxtImg
                                :src="group.avatar"
                                :alt="group.name"
                                class="rounded-full"
                              />
                            </div>
                          </div>
                          <div class="w-full items-center flex">
                            <div class="mx-2 -mt-1">
                              <div
                                class="text-xs truncate hover:font-bold w-full normal-case font-normal -mt-1 text-gray-500"
                              >
                                {{ group.name }}
                              </div>
                            </div>
                          </div>
                        </div>
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
  data() {
    return {
      showSearchDropdown: false,
    };
  },
  methods: {
    toggleSearchDropdown() {
      this.showSearchDropdown = !this.showSearchDropdown;
    },
    async changeGroup(group) {
      this.$parent.selectedGroup = group.name;
      this.$parent.selectedGroupId = group.id;
      this.closeSearchDropdown();

      if (this.$parent.selectedGroup === "Tất cả lớp học") {
        this.$parent.exercises = this.$parent.allExercises;

        return;
      }
      const exerciseRes = await this.$axios.get(
        `/exercises/groups/${this.$parent.selectedGroupId}`
      );
      this.$parent.exercises = exerciseRes.data.data;
    },
    closeSearchDropdown() {
      this.showSearchDropdown = false;
    },
    filterGroup(group) {
      if (this.$parent.selectedGroup === "Tất cả lớp học") {
        return true;
      }
      return this.nonAccentVietnamese(group.name).includes(
        this.$parent.selectedGroup
      );
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
};
</script>
