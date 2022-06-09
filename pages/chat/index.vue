<template>
  <div class="grid grid-cols-5">
    <ChatSideNav class="col-span-5 md:col-span-1" />

    <div class="col-span-4 hidden md:block">
      <h1 class="text-center text-2xl font-extrabold mt-20">
        Danh sách tin nhắn của bạn
      </h1>
      <h3 class="text-center text-xl mt-5">
        Hãy kiểm tra những tin đã nhắn hoặc soạn một tin nhắn mới cho bất cứ
        người bạn nào !
      </h3>
      <NuxtImg
        class="block mx-auto mt-10"
        width="300"
        height="300"
        src="/images/view-student-roster.svg"
        alt="student"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  head() {
    return {
      title: this.$t("meta.chat.title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.chat.description"),
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },

  async asyncData({ $axios }) {
    const res = await $axios.$get(`/friends/with-messages`);
    const friendsList = res.data;

    return { friendsList };
  },

  async mounted() {
    Echo.private("personal-chat").listen(".message.sent", (e) => {
      console.log(123123231);

      if (
        e.message.sender_id !== this.user.id &&
        e.message.receiver_id === this.user.id
      ) {
        e.message.new = true;
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
<style>
.group:hover .group-hover\:block {
  display: block;
}
.hover\:w-64:hover {
  width: 45%;
}
</style>
