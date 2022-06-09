<template>
  <aside class="border-r-2">
    <div
      class="flex top-0 justify-between items-center border-b sticky bg-white px-4 !h-14"
    >
      <p class="font-extrabold py-4">Trò chuyện</p>
      <NuxtLink
        :to="localePath('/chat/new')"
        class="block rounded-full hover:bg-gray-200 bg-gray-100 w-10 h-10 p-2"
      >
        <svg viewBox="0 0 24 24" class="w-full h-full">
          <path
            d="M6.3 12.3l10-10a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-.7.3H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 .3-.7zM8 16h2.59l9-9L17 4.41l-9 9V16zm10-2a1 1 0 0 1 2 0v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h6a1 1 0 0 1 0 2H4v14h14v-6z"
          />
        </svg>
      </NuxtLink>
    </div>

    <div class="p-2 overflow-y-auto" style="max-height: 86vh">
      <div class="search-box p-4 flex-none">
        <form onsubmit="">
          <div class="relative">
            <label>
              <input
                class="rounded-full py-2 pr-6 pl-10 w-full border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
                type="text"
                value=""
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
        </form>
      </div>
      <div
        class="flex justify-between items-center my-2 p-3 hover:bg-gray-100 rounded-lg cursor-pointer relative"
        @click="$router.push(localePath('/chat/' + friend.id)); if (friend.messages[0] && friend.messages[0].new) friend.messages[0].new = false"
        v-for="friend in $parent.friendsList"
        :key="friend.id"
        :class="{
          'font-bold bg-blue-500 text-white hover:bg-blue-400':
            friend.messages[0] && friend.messages[0].new,
        }"
      >
        <NuxtImg
          class="w-10 h-10 relative rounded-full flex flex-shrink-0"
          :src="friend.avatar"
        />
        <div class="flex-auto min-w-0 ml-4 mr-6">
          <p>{{ friend.name }}</p>
          <div
            :class="friend.messages[0].new ? 'text-white' : 'text-gray-600'"
            class="flex items-center text-sm"
            v-if="friend.messages.length > 0"
          >
            <p
              class="truncate w-1/2 overflow-x-hidden"
              style="max-width: 230px"
            >
              {{ friend.messages[0].content }}
            </p>
            <span class="ml-5">{{
              $moment(friend.messages[0].created_at).fromNow()
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {};
</script>
