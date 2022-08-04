<template>
  <div>
    <Portal to="pageTitle"> Tạo tài khoản LT Meet </Portal>
    <div
      class="grid lg:grid-cols-2 lg:gap-10 p-5 md:px-20 md:py-10 rounded-3xl shadow-lg bg-white"
    >
      <div class="">
        <div class="mb-5">
          <label class="block font-bold mb-2">Địa chỉ email</label>
          <input
            v-model="auth.email"
            id="email"
            type="text"
            :class="{
              '!border-red-500': submitted && $v.auth.email.$error,
            }"
            class="input w-full"
            placeholder="abc@example.com"
          />
          <div
            v-if="submitted && !$v.auth.email.required"
            class="text-red-500 mt-2"
          >
            Địa chỉ email là trường bắt buộc
          </div>
          <div
            v-if="submitted && !$v.auth.email.email"
            class="text-red-500 mt-2"
          >
            Địa chỉ email không hợp lệ!
          </div>
        </div>
        <div class="mb-5">
          <label class="block font-bold mb-2">Tên của bạn</label>
          <input
            v-model="auth.name"
            :class="{
              '!border-red-500': submitted && $v.auth.name.$error,
            }"
            type="text"
            class="input w-full"
            placeholder="Tên của bạn"
          />
          <div
            v-if="submitted && !$v.auth.name.required"
            class="text-red-500 mt-2"
          >
            Trường tên là bắt buộc!
          </div>
          <div
            v-if="submitted && !$v.auth.name.nameRegex"
            class="text-red-500 mt-2"
          >
            Trường tên không hợp lệ
          </div>
        </div>
        <div class="mb-5">
          <label class="block font-bold mb-2">Tên người dùng</label>
          <input
            v-model="auth.username"
            :class="{
              '!border-red-500': submitted && $v.auth.username.$error,
            }"
            type="text"
            class="input w-full"
            placeholder="Tên người dùng của bạn"
          />
          <div
            v-if="submitted && !$v.auth.username.required"
            class="text-red-500 mt-2"
          >
            Trường tên người dùng là bắt buộc
          </div>
          <div
            v-if="submitted && !$v.auth.username.usernameRegex"
            class="text-red-500 mt-2"
          >
            Hãy nhập tên người dùng hợp lê
          </div>
        </div>
        <div class="mb-5">
          <label class="block font-bold mb-2">Ảnh đại diện</label>
          <input
            @change="uploadFile"
            ref="file"
            type="file"
            accept="image/*, video/*,png,jpg,jpeg,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar"
            class="bg-gray-50 mb-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="File phương tiện"
          />
        </div>
        <NuxtImg class="post-image" v-if="previewImg" :src="previewImg" />
      </div>
      <div class="">
        <div class="mb-5">
          <label class="block font-bold mb-2">Số điện thoại</label>
          <input
            v-model="auth.phone_number"
            v-mask="'###########'"
            type="text"
            :class="{
              '!border-red-500': submitted && $v.auth.phone_number.$error,
            }"
            class="input w-full"
            placeholder="0932123312"
          />
          <div
            v-if="submitted && !$v.auth.phone_number.required"
            class="text-red-500 mt-2"
          >
            Số điện thoại là trường bắt buộc
          </div>
          <div
            v-if="submitted && !$v.auth.phone_number.phoneRegex"
            class="text-red-500 mt-2"
          >
            Hãy nhập một số điện thoại hợp lệ
          </div>
        </div>
        <div class="mb-5">
          <label class="block font-bold mb-2">Mật khẩu</label>
          <input
            type="password"
            autocomplete="on"
            v-model="auth.password"
            :class="{
              '!border-red-500': submitted && $v.auth.password.$error,
            }"
            class="input w-full"
            placeholder="Mật khẩu"
          />
          <div
            v-if="submitted && !$v.auth.password.required"
            class="text-red-500 mt-2"
          >
            Mật khẩu là trường bắt buộc
          </div>
          <div
            v-if="submitted && !$v.auth.password.minLength"
            class="text-red-500 mt-2"
          >
            Hãy nhập mật khẩu hợp lệ, gồm ít nhất 8 kí tự!
          </div>
        </div>
        <div class="mb-5">
          <label class="block font-bold mb-2">Xác nhận mật khẩu</label>
          <input
            type="password"
            autocomplete="on"
            v-model="auth.password_confirmation"
            :class="{
              '!border-red-500':
                submitted && $v.auth.password_confirmation.$error,
            }"
            class="input w-full"
            placeholder="Xác nhận mật khẩu"
          />
          <div
            v-if="submitted && !$v.auth.password_confirmation.sameAsPassword"
            class="text-red-500 mt-2"
          >
            Mật khẩu không đúng với mật khẩu đã nhập
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <label class="block text-gray-900">
              <input
                type="checkbox"
                v-model="auth.agree"
                :class="{
                  '!border-red-500': submitted && $v.auth.agree.$error,
                }"
                class="h-4 w-4 focus:ring-0 border-gray-300 rounded"
              />
              <span class="ml-2">Tôi đã đọc và đồng ý với</span>
              <a class="text-blue-500 font-bold hover:underline" href="#">
                Điềù khoản sử dụng và chính sách bảo mật của LT Meet</a
              >
            </label>
          </div>
        </div>
        <span v-if="submitted && !$v.auth.agree.sameAs" class="text-red-500"
          >Bạn phải đồng ý với Điềù khoản sử dụng và chính sách bảo mật của NP
          Meet
        </span>

        <div class="mt-5">
          <button
            :disabled="loading"
            @click="register"
            class="disabled:opacity-50 group relative w-full flex justify-center py-2 px-4 border border-transparent font-medium rounded-md !text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <i v-if="loading" class="fas fa-spinner text-3xl animate-spin"></i>
            <span v-else> Đăng kí </span>
          </button>
        </div>
        <div class="mt-10">
          <div class="text-center mb-3">
            <div class="flex-auto">
              <h6 class="font-bold">Hoặc đăng nhập với</h6>
            </div>
          </div>
          <div class="text-center grid lg:grid-cols-3 xl:gap-10 gap-5 pt-3">
            <button
              @click="socialLogin('google')"
              class="bg-white px-5 py-3 rounded border-gray-200 border shadow hover:shadow-md inline-flex items-center justify-center font-bold ease-linear transition-all duration-150"
              type="button"
            >
              <img
                alt="..."
                class="w-5 h-5 mr-4"
                src="/images/google.png"
              />Google
            </button>
            <button
              @click="socialLogin('github')"
              class="bg-black !text-white px-5 py-3 rounded shadow inline-flex hover:shadow-md justify-center items-center font-bold ease-linear transition-all duration-150"
              type="button"
            >
              <img
                alt="..."
                class="w-5 h-5 mr-4"
                src="/images/github.png"
              />Github
            </button>
            <button
              @click="socialLogin('facebook')"
              class="bg-white px-5 py-3 border-gray-200 border rounded shadow hover:shadow-md inline-flex justify-center items-center font-bold ease-linear transition-all duration-150"
              type="button"
            >
              <img
                alt="..."
                class="w-5 h-5 mr-4"
                src="/images/facebook.png"
              />Facebook
            </button>
          </div>
        </div>

        <div class="mt-10">
          <div class="flex-auto text-center">
            <h6 class="font-bold">
              Đã có tài khoản?
              <NuxtLink
                class="text-blue-500 hover:underline"
                :to="localePath('login')"
                >Đăng nhập ngay!</NuxtLink
              >
            </h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  required,
  minLength,
  email,
  between,
  sameAs,
  helpers,
} from "vuelidate/lib/validators";

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
  middleware: "auth",
  auth: "guest",
  head() {
    return {
      title: this.$t("meta.signUp.title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("meta.signUp.description"),
        },
      ],
    };
  },
  layout: "guest",
  data() {
    return {
      auth: {
        email: "",
        username: "",
        name: "",
        phone_number: "",
        password: "",
        password_confirmation: "",
        agree: false,
        provider: "",
        social_id: "",
        avatar: null,
      },
      previewImg: null,
      loading: false,
      submitted: false,
      error: "",
    };
  },
  validations: {
    auth: {
      agree: { sameAs: sameAs(() => true) },
      name: { required, nameRegex },
      username: { required, usernameRegex },
      email: { required, email },
      phone_number: { required, phoneRegex },
      password: { required, minLength: minLength(6) },
      password_confirmation: {
        sameAsPassword: sameAs("password"),
      },
    },
  },
  mounted() {
    if (this.$route.query.user) {
      this.auth = JSON.parse(this.$route.query.user);
      this.auth.social_id = this.auth.id;
    }
  },
  methods: {
    async register() {
      this.loading = true;
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.loading = false;
        return;
      }
      try {
        let formData = new FormData();
        formData.append("email", this.auth.email);
        formData.append("username", this.auth.username);
        formData.append("name", this.auth.name);
        formData.append("phone_number", this.auth.phone_number);
        formData.append("password", this.auth.password);
        formData.append(
          "password_confirmation",
          this.auth.password_confirmation
        );
        formData.append("agree", this.auth.agree);
        formData.append("provider", this.auth.provider);
        formData.append("social_id", this.auth.social_id);
        if (this.auth.avatar) {
          formData.append("avatar", this.auth.avatar);
        }
        const res = await this.$axios.post("/auth/register", formData);
        this.$toast.show("Chào mừng bạn đến với LT Meet!");
        this.$router.push(this.localePath("/login"));
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
      this.auth.avatar = file;
    },

    async socialLogin(provider) {
      try {
        const res = await this.$axios.post("/auth/social/login/" + provider);
        this.popupwindow(res.data, "Social Login", 800, 800);
      } catch (e) {}
    },
    popupwindow(url, title, w, h) {
      var left = screen.width / 2 - w / 2;
      var top = screen.height / 2 - h / 2;
      return window.open(
        url,
        title,
        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
          w +
          ", height=" +
          h +
          ", top=" +
          top +
          ", left=" +
          left
      );
    },
  },
};
</script>
