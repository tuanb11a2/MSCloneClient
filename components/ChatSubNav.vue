<template>
  <div
    class="flex top-0 justify-between items-center border-b sticky bg-white px-4 !h-14"
  >
    <div class="flex items-center">
      <NuxtLink :to="localePath('/chat')" class="xl:hidden">
        <i class="fas fa-arrow-left text-blue-500 mr-5"></i>
      </NuxtLink>
      <div class="w-12 h-12 mr-4 relative flex flex-shrink-0">
        <NuxtImg
          class="shadow-md rounded-full w-full h-full z-0 object-cover"
          :src="$parent.receiver.avatar"
          alt=""
        />
      </div>
      <div class="text-sm">
        <p class="font-bold">{{ receiver.name }}</p>
        <p>Active now</p>
      </div>
    </div>

    <div class="flex">
      <NuxtLink :to="localePath(`/calls/friends?callerId=${$auth.user.id}&&receiverId=${receiver.id}`)" class="xl:block rounded-full w-10 h-10 p-2 ml-4">
        <svg
          viewBox="0 0 20 20"
          class="w-full h-full fill-current text-blue-600"
        >
          <path
            d="M0,3.99406028 C0,2.8927712 0.894513756,2 1.99406028,2 L14.0059397,2 C15.1072288,2 16,2.89451376 16,3.99406028 L16,16.0059397 C16,17.1072288 15.1054862,18 14.0059397,18 L1.99406028,18 C0.892771196,18 0,17.1054862 0,16.0059397 L0,3.99406028 Z M8,14 C10.209139,14 12,12.209139 12,10 C12,7.790861 10.209139,6 8,6 C5.790861,6 4,7.790861 4,10 C4,12.209139 5.790861,14 8,14 Z M8,12 C9.1045695,12 10,11.1045695 10,10 C10,8.8954305 9.1045695,8 8,8 C6.8954305,8 6,8.8954305 6,10 C6,11.1045695 6.8954305,12 8,12 Z M16,7 L20,3 L20,17 L16,13 L16,7 Z"
          />
        </svg>
      </NuxtLink>
      
    </div>
  </div>
</template>

<script>
export default {
  props: {
    receiver: {
      required: true,
      type: Object,
    },
  },
};
</script>
