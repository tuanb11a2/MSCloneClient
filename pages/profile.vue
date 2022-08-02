<template>
  <div>
    <h3 class="text-3xl p-5 md:px-20">Thông tin cá nhân</h3>

    <div
      v-if="user"
      class="grid lg:grid-cols-2 lg:gap-10 p-5 md:px-20 md:py-10 rounded-3xl shadow-lg bg-white"
    >
      <div class="">
        <div class="mb-5">
          <label class="block font-bold mb-2">Địa chỉ email</label>
          <input
            v-model="user.email"
            disabled
            id="email"
            type="text"
            class="input w-full"
            placeholder="abc@example.com"
          />
        </div>
        <div class="mb-5">
          <label class="block font-bold mb-2">Tên người dùng</label>
          <input
            v-model="user.username"
            :class="{
              '!border-red-500': submitted && $v.user.username.$error,
            }"
            type="text"
            class="input w-full"
            placeholder="Tên người dùng của bạn"
          />
          <div
            v-if="submitted && !$v.user.username.required"
            class="text-red-500 mt-2"
          >
            Trường tên người dùng là bắt buộc
          </div>
          <div
            v-if="submitted && !$v.user.username.usernameRegex"
            class="text-red-500 mt-2"
          >
            Hãy nhập tên người dùng hợp lê
          </div>
        </div>
        <div class="mb-5">
          <label class="block font-bold mb-2">Họ tên</label>
          <input
            v-model="user.name"
            :class="{
              '!border-red-500': submitted && $v.user.name.$error,
            }"
            type="text"
            class="input w-full"
            placeholder="Tên người dùng"
          />
          <div
            v-if="submitted && !$v.user.name.required"
            class="text-red-500 mt-2"
          >
            Trường tên là bắt buộc!
          </div>
          <div
            v-if="submitted && !$v.user.name.nameRegex"
            class="text-red-500 mt-2"
          >
            Trường tên không hợp lệ
          </div>
        </div>
        <div class="mb-5">
          <label class="block font-bold mb-2">Số điện thoại</label>
          <input
            v-model="user.phone_number"
            type="text"
            :class="{
              '!border-red-500': submitted && $v.user.phone_number.$error,
            }"
            class="input w-full"
            placeholder="0932123312"
          />
          <div
            v-if="submitted && !$v.user.phone_number.required"
            class="text-red-500 mt-2"
          >
            Số điện thoại là trường bắt buộc
          </div>
          <div
            v-if="submitted && !$v.user.phone_number.phoneRegex"
            class="text-red-500 mt-2"
          >
            Hãy nhập một số điện thoại hợp lệ
          </div>
        </div>
      </div>
      <div class="">
        <div class="mb-5">
          <label class="block font-bold mb-2">Ảnh đại diện</label>
          <input
            @change="uploadFile"
            ref="file"
            type="file"
            accept="image/*"
            class="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="File phương tiện"
          />
        </div>
        <NuxtImg class="post-image" v-if="previewImg" :src="previewImg" />
        <div class="mt-8 flex gap-5">
          <NuxtLink :to="localePath('/')" class="button-black w-1/2">
            <span> Quay lại </span>
          </NuxtLink>
          <button
            :disabled="loading"
            @click="updateProfile"
            class="disabled:opacity-50 group relative w-1/2 flex justify-center py-2 px-4 border border-transparent font-medium rounded-md !text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <i v-if="loading" class="fas fa-spinner text-3xl animate-spin"></i>
            <span v-else> Xác nhận </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, helpers } from "vuelidate/lib/validators";

const nameRegex = helpers.regex(
  "nameRegex",
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/
);
const phoneRegex = helpers.regex(
  "phoneRegex",
  /(84|0[3|5|7|8|9])+([0-9]{8})\b/
);
const usernameRegex = helpers.regex(
  "usernameRegex",
  /^(?=.{3,100}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
);

export default {
  head() {
    return {
      title: "Thay đổi thông tin người dùng",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.profile.description"),
        },
      ],
    };
  },
  data() {
    return {
      user: null,
      previewImg: null,
      loading: false,
      submitted: false,
      error: "",
    };
  },
  async mounted() {
    this.user = { ...this.$auth.user };
    this.previewImg = this.user.avatar;
  },
  validations: {
    user: {
      name: { required, nameRegex },
      username: { required, usernameRegex },
      phone_number: { required, phoneRegex },
    },
  },
  methods: {
    async updateProfile() {
      this.loading = true;
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.loading = false;
        return;
      }
      try {
        let formData = new FormData();
        formData.append("username", this.user.username);
        formData.append("name", this.user.name);
        formData.append("phone_number", this.user.phone_number);
        formData.append("password", this.user.password);
        if (typeof this.user.avatar === "File") {
          formData.append("avatar", this.user.avatar);
        }
        const res = await this.$axios.post("/update-profile", formData);
        this.$toast.success("Cập nhật thành công");
      } catch (e) {
        this.error = e.response.data.meta.message;
      }
      this.loading = false;
    },
    uploadFile(e) {
      const file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        this.previewImg = e.target.result;
      };
      reader.readAsDataURL(file);
      this.user.avatar = file;
    },
  },
};
</script>
