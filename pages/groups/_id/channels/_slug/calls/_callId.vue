<template>
  <div class="h-screen w-screen flex items-center">
    <div
      v-if="visiblePreview"
      class="w-full grid xl:grid-cols-5 grid-cols-1 xl:px-64 py-5 bg-gray-100"
    >
      <div class="flex justify-center rounded-md xl:col-span-3">
        <div id="preview"></div>
      </div>
      <div class="text-center mt-5 flex flex-col justify-center xl:col-span-2">
        <h1 class="font-bold text-xl">
          Tham gia cuộc họp của nhóm {{ group.name }}
        </h1>

        <div class="inline-flex mt-5 justify-center">
          <span class="button-blue mr-5" @click="connect">Kết nối</span>
          <span
            @click="$router.push(`/groups/${group.slug}/channels/general`)"
            class="button-black"
          >
            Trở lại</span
          >
        </div>
      </div>
    </div>

    <div v-if="!visiblePreview" class="w-full flex h-full xl:p-10 bg-black">
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <div
          id="remote-media-div"
          class="xl:col-span-3 flex justify-center gap-5"
        ></div>
      </div>

      <div
        id="video-chat-window"
        style="width: 200px; height: 200px"
        class="fixed bottom-0 right-24"
      ></div>

      <section class="block fixed inset-x-0 bottom-3 px-10 z-10">
        <div id="tabs" class="flex justify-between">
          <div class="text-white font-bold text-xl">{{ time }}</div>
          <div class="flex justify-center">
            <span
              @click="toggleMic"
              :class="micOn ? 'bg-gray-700' : 'bg-red-500'"
              class="rounded-full p-3 cursor-pointer text-white"
            >
              <i class="fas text-xl px-2 fa-microphone"></i>
            </span>
            <span
              @click="toggleVideo"
              :class="videoOn ? 'bg-gray-700' : 'bg-red-500'"
              class="ml-4 rounded-full p-3 cursor-pointer text-white"
            >
              <i class="fas text-xl px-1 fa-video"></i>
            </span>
            <span
              @click="leaveRoom"
              class="ml-4 bg-red-500 rounded-full p-3 cursor-pointer text-white"
            >
              <i class="fas text-xl px-1 fa-phone"></i>
            </span>
          </div>

          <span
            class="bg-gray-700 ml-4 rounded-full p-3 cursor-pointer text-white"
          >
            <i class="fas fa-comment-alt text-xl px-1"></i>
          </span>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  layout: "call",
  middleware: "auth",
  head() {
    return {
      title: "Trò chuyện video",
    };
  },
  computed: {
    user() {
  return this.$auth.user;
},
    time() {
      let date = new Date();
      return this.$moment(date).format("hh:mm A");
    },
  },
  async asyncData({ $axios, route, store, redirect, app }) {
    const pluck = (array, key) => {
      return array.map((o) => o[key]);
    };
    const res = await $axios.$get(
      `/groups/${route.params.id}/channels/${route.params.slug}`
    );
    const group = res.data.group;
    const channel = res.data.channel;
    if (!pluck(group.users, "id").includes(store.getters["auth/user"].id)) {
      app.$toast.error("Bạn không phải thành viên của nhóm này");
      redirect(`groups/${group.slug}/join`);
    }

    return { group, channel };
  },
  data() {
    return {
      visiblePreview: false,
      participants: null,
      room: null,
      micOn: true,
      videoOn: true,
      roomName: null,
      roomExists: false,
    };
  },
  async mounted() {
    this.visiblePreview = true;
    const { createLocalVideoTrack } = require("twilio-video");
    createLocalVideoTrack().then((track) => {
      const localMediaContainer = document.getElementById("preview");
      localMediaContainer.appendChild(track.attach());
    });

    this.roomName = `Room-Groups-${this.group.slug}-${this.$route.params.callId}`;
    const res = await this.$axios.post(`/twilio/check-exists`, {
      roomName: this.roomName,
    });
    this.roomExists = res.data.roomExists;
  },
  methods: {
    async connect() {
      this.visiblePreview = false;
      const res = await this.$axios.post("/twilio/access_token", {
        roomName: this.roomName,
      });
      const accessToken = res.data;
      const { connect, createLocalVideoTrack } = require("twilio-video");
      connect(accessToken, {
        name: this.roomName,
      }).then(
        (room) => {
          this.room = room;
          this.participants = room.participants;
          console.log(`Successfully joined a Room: ${room}`);
          const videoChatWindow = document.getElementById("video-chat-window");

          createLocalVideoTrack().then((track) => {
            videoChatWindow.appendChild(track.attach());
          });

          room.participants.forEach((participant) => {
            participant.tracks.forEach((publication) => {
              if (publication.track) {
                document
                  .getElementById("remote-media-div")
                  .appendChild(publication.track.attach());
              }
            });

            participant.on("trackSubscribed", (track) => {
              document
                .getElementById("remote-media-div")
                .appendChild(track.attach());
            });
          });

          room.on("participantConnected", (participant) => {
            console.log(`Participant "${participant.identity}" connected`);
            participant.tracks.forEach((publication) => {
              if (publication.isSubscribed) {
                const track = publication.track;
                document
                  .getElementById("remote-media-div")
                  .appendChild(track.attach());
              }
            });

            participant.on("trackSubscribed", (track) => {
              document
                .getElementById("remote-media-div")
                .appendChild(track.attach());
            });
          });
        },
        (error) => {
          console.error(`Unable to connect to Room: ${error.message}`);
        }
      );
    },
    toggleMic() {
      if (this.micOn) this.muteMic();
      else this.enableMic();
    },
    toggleVideo() {
      if (this.videoOn) this.disableVideo();
      else this.enableVideo();
    },
    muteMic() {
      this.micOn = false;
      this.room.localParticipant.audioTracks.forEach((publication) => {
        publication.track.disable();
      });
    },
    enableMic() {
      this.micOn = true;
      this.room.localParticipant.audioTracks.forEach((publication) => {
        publication.track.enable();
      });
    },
    disableVideo() {
      this.videoOn = false;
      this.room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.disable();
      });
    },
    enableVideo() {
      this.videoOn = true;
      this.room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.enable();
      });
    },
    leaveRoom() {
      this.room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.stop();
        publication.unpublish();
      });
      this.room.disconnect();
      this.$router.push(
        this.localePath(
          `/groups/${this.group.slug}/channels/${this.channel.slug}`
        )
      );
    },
  },
};
</script>

<style scoped>
video {
  border-radius: 10px !important;
  border: 1px solid white;
}
</style>
