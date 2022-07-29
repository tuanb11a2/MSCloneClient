<template>
  <aside class="border-r-2">
    <div
      class="flex top-0 justify-between items-center border-b sticky bg-white px-4 !h-14"
    >
      <p class="font-extrabold py-4 w-3/4">Danh sách kênh của nhóm</p>
      <span
        title="Thêm kênh mới"
        @click="toggleCreateModal"
        class="block rounded-full text-center cursor-pointer bg-blue-500 hover:bg-blue-700 w-10 h-10 p-2"
      >
        <i class="fas fa-plus text-white"></i>
      </span>
    </div>

    <div class="sticky top-14 flex flex-col p-2 overflow-y-auto">
      <div
        :class="{
          'text-white bg-cyan-700 font-bold hover:bg-cyan-500':
            currentChannel && channel.id === currentChannel.id,
        }"
        class="flex justify-between bg-gray-100 my-2 items-center p-3 hover:bg-gray-200 cursor-pointer relative"
        @click="
          $router.push(
            localePath(`/groups/${group.slug}/channels/${channel.slug}`)
          )
        "
        v-for="channel in group.channels"
        :key="channel.id"
      >
        <p class="w-3/4">{{ channel.name }}</p>
        <span
          v-if="
            channel.slug !== 'general' &&
            $store.getters['auth/user'].id === group.creator_id
          "
          title="Xóa kênh"
          @click.stop.prevent="toggleDeleteModal(channel.id)"
          class="block rounded-full text-sm ml-6 text-center cursor-pointer bg-red-500 hover:bg-red-700 w-10 h-10 p-2"
        >
          <i
            title="Xóa kênh"
            class="fas fa-trash-alt text-white"
          ></i>
        </span>

        <ConfirmModal
          class="hidden"
          title="Xóa kênh"
          :id="`delete-modal-${channel.id}`"
          :content="`Bạn có chắc muốn xóa kênh ${channel.name}?`"
          @submit="deleteChannel(channel.id)"
          @toggle-modal="toggleDeleteModal(channel.id)"
        />
      </div>
    </div>
    <CreateChannelModal
      v-if="visible"
      @submit="createChannel"
      @toggle-modal="toggleCreateModal"
    />
  </aside>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  props: {
    group: {
      required: true,
      type: Object,
    },
    currentChannel: {
      required: false,
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      channel: {
        name: null,
      },
      visible: false,
      visibleDelete: false,
    };
  },
  validations: {
    channel: {
      name: { required, maxLength: maxLength(255) },
    },
  },
  methods: {
    toggleCreateModal() {
      this.visible = !this.visible;
    },
    toggleDeleteModal(id) {
      document.querySelector(`#delete-modal-${id}`).classList.toggle("hidden");
    },
    createChannel() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$emit("create-channel", this.channel);
    },
    async deleteChannel(id) {
      try {
        await this.$axios.delete(`/groups/${this.group.id}/channels/${id}`);
        this.$toast.success("Xóa kênh thành công");
        this.$router.push(
          this.localePath(`/groups/${this.group.slug}/channels/general`)
        );
      } catch (e) {
        this.$toast.error(e.response.data.meta.message);
      }
    },
  },
};
</script>
