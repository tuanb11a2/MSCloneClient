<template>
  <ul class="mt-6">
    <li
      class="relative px-6 py-3 hover:bg-gray-50"
      @click="$parent.toggleMobileSideMenu"
      :class="{ 'bg-gray-100': $route.fullPath === '/' }"
    >
      <span
        class="nav-item"
        aria-hidden="true"
        v-if="$route.fullPath === '/'"
      ></span>
      <NuxtLink class="nav-link" :to="localePath('/')">
        <i class="fas text-xl fa-home"></i>
        <span class="ml-4">Trang cá nhân</span>
      </NuxtLink>
    </li>
    <li
      class="relative px-6 py-3 hover:bg-gray-50"
      @click="$parent.toggleMobileSideMenu"
      :class="{ 'bg-gray-100': $route.fullPath.includes('/groups') }"
    >
      <span
        v-if="$route.fullPath.includes('/groups')"
        class="nav-item"
        aria-hidden="true"
      ></span>
      <NuxtLink class="nav-link" :to="localePath('/groups')">
        <i class="fas text-xl fa-users"></i>
        <span class="ml-4">Nhóm</span>
      </NuxtLink>
    </li>
    <li
      class="relative px-6 py-3 hover:bg-gray-50"
      @click="$parent.toggleMobileSideMenu"
      :class="{ 'bg-gray-100': $route.fullPath.includes('/friends') }"
    >
      <span
        v-if="$route.fullPath.includes('/friends')"
        class="nav-item"
        aria-hidden="true"
      ></span>
      <NuxtLink class="nav-link" :to="localePath('/friends')">
        <i class="fas text-xl fa-user-friends"></i>
        <span class="ml-4">Bạn bè</span>
      </NuxtLink>
    </li>

    <li
      class="relative px-6 py-3 hover:bg-gray-50"
      @click="$parent.toggleMobileSideMenu"
      :class="{ 'bg-gray-100': $route.fullPath.includes('/chat') }"
    >
      <span
        v-if="$route.fullPath.includes('/chat')"
        class="nav-item"
        aria-hidden="true"
      ></span>
      <NuxtLink class="nav-link" :to="localePath('/chat')">
        <i class="fas text-xl fa-comments"></i>
        <span class="ml-4">Trò chuyện</span>
      </NuxtLink>
    </li>
    <li
      class="relative px-6 py-3 hover:bg-gray-50"
      @click="$parent.toggleMobileSideMenu"
      :class="{ 'bg-gray-100': $route.fullPath.includes('/exercises') }"
    >
      <span
        v-if="$route.fullPath.includes('/exercises')"
        class="nav-item"
        aria-hidden="true"
      ></span>
      <NuxtLink class="nav-link" :to="localePath('/exercises')">
        <i class="fas text-xl fa-book-open"></i>
        <span class="ml-4">Bài tập</span>
      </NuxtLink>
    </li>
    <li
      class="relative px-6 py-3 hover:bg-gray-50"
      @click="$parent.toggleMobileSideMenu"
      :class="{ 'bg-gray-100': $route.fullPath.includes('/todo') }"
    >
      <span
        class="nav-item"
        aria-hidden="true"
        v-if="$route.fullPath.includes('/todo')"
      ></span>
      <NuxtLink class="nav-link" :to="localePath('/todo')">
        <i class="fas text-xl fa-list"></i>
        <span class="ml-4">Danh sách công việc</span>
      </NuxtLink>
    </li>
    <li
      class="relative px-6 py-3 hover:bg-gray-50"
      @click="$parent.toggleMobileSideMenu"
      :class="{ 'bg-gray-100': $route.fullPath.includes('/schedule') }"
    >
      <span
        v-if="$route.fullPath.includes('/schedule')"
        class="nav-item"
        aria-hidden="true"
      ></span>
      <NuxtLink class="nav-link" :to="localePath('/schedule')">
        <i class="fas fa-calendar text-xl"></i>
        <span class="ml-5"> Lịch </span>
      </NuxtLink>
    </li>
  </ul>
</template>
