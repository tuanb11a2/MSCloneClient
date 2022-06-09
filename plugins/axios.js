export default function ({ $axios, app, store, redirect }) {
    const token = app.$cookiz.get("authToken");
    const lang = app.$cookiz.get("lang");

    if (token) {
        $axios.setHeader("Authorization", `Bearer ${token}`);
    }

    if (lang) {
        $axios.setHeader("Accept-Language", lang);
    }
}
