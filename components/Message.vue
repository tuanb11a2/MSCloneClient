<template>
  <div
    class="flex flex-row py-1"
    :class="user.id === message.sender_id ? 'justify-end' : 'justify-start'"
  >
    <div
      v-if="user.id !== message.sender_id"
      class="w-8 h-8 relative flex flex-shrink-0 mr-4"
    >
      <NuxtImg
        class="shadow-md rounded-full w-full h-full object-cover"
        :src="$parent.receiver.avatar"
        alt=""
      />
    </div>
    <div class="messages text-sm text-gray-700 grid grid-flow-row gap-2">
      <div class="flex items-center">
        <span v-if="user.id === message.sender_id" class="mr-5">
          {{ $moment(message.created_at).fromNow() }}</span
        >

        <p
          class="px-6 py-3 rounded-2xl max-w-xs lg:max-w-md"
          :class="
            user.id === message.sender_id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100'
          "
        >
          {{ message.content }}
        </p>

        <span v-if="user.id !== message.sender_id" class="ml-5">
          {{ $moment(message.created_at).fromNow() }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    message: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
};
</script>
