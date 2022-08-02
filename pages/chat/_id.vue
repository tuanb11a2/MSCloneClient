<template>
  <div class="grid grid-cols-5">
    <ChatSideNav class="col-span-5 hidden xl:block xl:col-span-1" />

    <div class="col-span-5 xl:col-span-4">
      <ChatSubNav :receiver="receiver" />

      <div class="p-4 overflow-y-auto h-screen flex flex-col-reverse">
        <div
          class="col-span-1 xl:col-span-2 lg:col-span-3"
          v-if="
            Object.keys(messagesList).length === 0 || messagesList.length === 0
          "
        >
          <h1 class="text-center text-2xl font-extrabold mt-20">
            Hai bạn chưa có tin nhắn nào với nhau!
          </h1>

          <NuxtImg
            class="block mx-auto mt-10"
            width="300"
            height="300"
            src="/images/empty-exercise.svg"
            alt="student"
          />
        </div>
        <div v-else v-for="message in messagesList" :key="message.id">
          <Message :message="message"></Message>
        </div>
      </div>

      <!-- Chat Footer -->
      <div class="flex border-t-2 w-full items-center bg-white pt-3">
        <button
          class="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6"
        >
          <svg viewBox="0 0 20 20" class="w-full h-full fill-current">
            <path
              d="M10,1.6c-4.639,0-8.4,3.761-8.4,8.4s3.761,8.4,8.4,8.4s8.4-3.761,8.4-8.4S14.639,1.6,10,1.6z M15,11h-4v4H9  v-4H5V9h4V5h2v4h4V11z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6"
        >
          <svg viewBox="0 0 20 20" class="w-full h-full fill-current">
            <path
              d="M11,13 L8,10 L2,16 L11,16 L18,16 L13,11 L11,13 Z M0,3.99406028 C0,2.8927712 0.898212381,2 1.99079514,2 L18.0092049,2 C19.1086907,2 20,2.89451376 20,3.99406028 L20,16.0059397 C20,17.1072288 19.1017876,18 18.0092049,18 L1.99079514,18 C0.891309342,18 0,17.1054862 0,16.0059397 L0,3.99406028 Z M15,9 C16.1045695,9 17,8.1045695 17,7 C17,5.8954305 16.1045695,5 15,5 C13.8954305,5 13,5.8954305 13,7 C13,8.1045695 13.8954305,9 15,9 Z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6"
        >
          <svg viewBox="0 0 20 20" class="w-full h-full fill-current">
            <path
              d="M0,6.00585866 C0,4.89805351 0.893899798,4 2.0048815,4 L5,4 L7,2 L13,2 L15,4 L17.9951185,4 C19.102384,4 20,4.89706013 20,6.00585866 L20,15.9941413 C20,17.1019465 19.1017876,18 18.0092049,18 L1.99079514,18 C0.891309342,18 0,17.1029399 0,15.9941413 L0,6.00585866 Z M10,16 C12.7614237,16 15,13.7614237 15,11 C15,8.23857625 12.7614237,6 10,6 C7.23857625,6 5,8.23857625 5,11 C5,13.7614237 7.23857625,16 10,16 Z M10,14 C11.6568542,14 13,12.6568542 13,11 C13,9.34314575 11.6568542,8 10,8 C8.34314575,8 7,9.34314575 7,11 C7,12.6568542 8.34314575,14 10,14 Z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6"
        >
          <svg viewBox="0 0 20 20" class="w-full h-full fill-current">
            <path
              d="M9,18 L9,16.9379599 C5.05368842,16.4447356 2,13.0713165 2,9 L4,9 L4,9.00181488 C4,12.3172241 6.6862915,15 10,15 C13.3069658,15 16,12.314521 16,9.00181488 L16,9 L18,9 C18,13.0790094 14.9395595,16.4450043 11,16.9378859 L11,18 L14,18 L14,20 L6,20 L6,18 L9,18 L9,18 Z M6,4.00650452 C6,1.79377317 7.79535615,0 10,0 C12.209139,0 14,1.79394555 14,4.00650452 L14,8.99349548 C14,11.2062268 12.2046438,13 10,13 C7.790861,13 6,11.2060545 6,8.99349548 L6,4.00650452 L6,4.00650452 Z"
            />
          </svg>
        </button>
        <div class="relative flex-grow">
          <label>
            <input
              class="rounded-full py-2 pl-3 pr-10 w-full border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
              type="text"
              v-model="currentMessage.content"
              @keyup.enter="sendMessage"
              placeholder="Aa"
            />
            <button
              type="button"
              class="absolute top-0 right-0 mt-2 mr-3 flex flex-shrink-0 focus:outline-none text-blue-600 hover:text-blue-700 w-6 h-6"
            >
              <svg viewBox="0 0 20 20" class="w-full h-full fill-current">
                <path
                  d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM6.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.16 3a6 6 0 0 1-11.32 0h11.32z"
                />
              </svg>
            </button>
          </label>
        </div>
        <button
          type="button"
          @click="sendMessage"
          class="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6"
        >
          <svg class="w-full h-full fill-current" viewBox="0 0 20 20">
            <path
              d="M16.76,7.51l-5.199-5.196c-0.234-0.239-0.633-0.066-0.633,0.261v2.534c-0.267-0.035-0.575-0.063-0.881-0.063c-3.813,0-6.915,3.042-6.915,6.783c0,2.516,1.394,4.729,3.729,5.924c0.367,0.189,0.71-0.266,0.451-0.572c-0.678-0.793-1.008-1.645-1.008-2.602c0-2.348,1.93-4.258,4.303-4.258c0.108,0,0.215,0.003,0.321,0.011v2.634c0,0.326,0.398,0.5,0.633,0.262l5.199-5.193C16.906,7.891,16.906,7.652,16.76,7.51 M11.672,12.068V9.995c0-0.185-0.137-0.341-0.318-0.367c-0.219-0.032-0.49-0.05-0.747-0.05c-2.78,0-5.046,2.241-5.046,5c0,0.557,0.099,1.092,0.292,1.602c-1.261-1.111-1.979-2.656-1.979-4.352c0-3.331,2.77-6.041,6.172-6.041c0.438,0,0.886,0.067,1.184,0.123c0.231,0.043,0.441-0.134,0.441-0.366V3.472l4.301,4.3L11.672,12.068z"
            ></path>
          </svg>
        </button>
        <button
          type="button"
          class="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6"
        >
          <svg viewBox="0 0 20 20" class="w-full h-full fill-current">
            <path
              d="M11.0010436,0 C9.89589787,0 9.00000024,0.886706352 9.0000002,1.99810135 L9,8 L1.9973917,8 C0.894262725,8 0,8.88772964 0,10 L0,12 L2.29663334,18.1243554 C2.68509206,19.1602453 3.90195042,20 5.00853025,20 L12.9914698,20 C14.1007504,20 15,19.1125667 15,18.000385 L15,10 L12,3 L12,0 L11.0010436,0 L11.0010436,0 Z M17,10 L20,10 L20,20 L17,20 L17,10 L17,10 Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  head() {
    return {
      title: `${this.$t("meta.chat.title")} | ${this.receiver.name}`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.chat.description"),
        },
      ],
    };
  },

  data() {
    return {
      currentMessage: {
        receiverId: this.$route.params.id,
        content: null,
      },
      messagesList: [],
      receiver: null,
    };
  },
  computed: {
    user() {
  return this.$auth.user;
},
  },

  async asyncData({ $axios, route }) {
    const res = await $axios.$get(`/friends/with-messages`);
    const friendsList = res.data;
    const userRes = await $axios.$get(`/users/${route.params.id}`);
    const receiver = userRes.data;
    const messageRes = await $axios.$get(`/messages/${receiver.id}`);
    const messagesList = messageRes.data;

    return { friendsList, receiver, messagesList };
  },

  methods: {
    async sendMessage() {
      if (!this.currentMessage.content) {
        return false;
      }
      try {
        await this.$axios.post("/messages/send", this.currentMessage);
        const currentFriend = this.friendsList.find(
          (x) => x.id === this.receiver.id
        );
        currentFriend.messages.unshift({
          receiver_id: this.receiver.id,
          sender_id: this.user.id,
          content: this.currentMessage.content,
        });
        this.friendsList.splice(this.friendsList.indexOf(currentFriend), 1);
        this.friendsList.unshift(currentFriend);
        if (this.messagesList.length > 0) {
          this.messagesList.unshift({
            sender_id: this.user.id,
            content: this.currentMessage.content,
          });
        } else {
          this.messagesList = [
            {
              sender_id: this.user.id,
              content: this.currentMessage.content,
            },
          ];
        }

        this.currentMessage.content = "";
      } catch (e) {
        console.log(e);
      }
    },
  },
  async mounted() {
    Echo.channel("personal-chat").listen(".message.sent", (e) => {
      console.log(e);
      if (
        e.message.sender_id !== this.user.id &&
        e.message.receiver_id === this.user.id
      ) {
        e.message.new = true;
        this.messagesList.unshift(e.message);
        const currentFriend = this.friendsList.find(
          (x) => x.id === e.message.sender_id
        );
        currentFriend.messages.unshift(e.message);
        this.friendsList.splice(this.friendsList.indexOf(currentFriend), 1);
        this.friendsList.unshift(currentFriend);
      }
    });
  },
};
</script>
<style scoped>
.group:hover .group-hover\:block {
  display: block;
}
.hover\:w-64:hover {
  width: 45%;
}
.h-screen {
  height: 75vh;
  @media screen and (min-width: 1024px) {
    height: 77vh;
  }
}
</style>
