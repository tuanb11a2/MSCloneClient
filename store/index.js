export const state = () => ({
  loading: false
})

export const getters = {
  loading: (state) => state.loading
}

export const mutations = {
  SET_LOADING_STATUS(state, payload) {
    state.loading = payload
  }
}

export const actions = {
  async nuxtServerInit({ commit }) {
    const token = this.$cookiz.get("authToken");
    const lang = this.$cookiz.get("lang");

    if (lang) {
      this.$axios.setHeader("Accept-Language", lang);
    }

    if (token) {
      commit("auth/SET_AUTH_TOKEN", token);
      this.$axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        const userRes = await this.$axios.get("/auth/user");
        commit("auth/FETCH_USER_SUCCESS", userRes.data);
      } catch (e) {
        if (e.response.data.tokenStatus === "expired") {
          const res = await this.$axios.post('/auth/refresh');
          let token = res.data.access_token;
          this.$axios.defaults.headers.common.Authorization = `Bearer ${token}`;
          this.$cookiz.set("authToken", token);
          commit("auth/SET_AUTH_TOKEN", token);
        } else {
          this.$cookiz.remove("authToken");
          this.$router.push(this.localePath("/login"));
        }
      }
    } else {
      this.$cookiz.remove("authToken");
      this.$router.push(this.localePath("/login"));
    }
  },

  setLoadingStatus({ commit }, status) {
    commit('SET_LOADING_STATUS', status)
  }
};
