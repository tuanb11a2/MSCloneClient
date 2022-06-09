<template>
    <div>
        <NuxtImg
            class="mx-auto h-24 w-auto"
            src="/images/logo.svg"
            alt="LT Meet"
        />
        <h2 class="mb-20 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
        </h2>
    </div>
</template>

<script>
export default {
    head() {
        return {
            title: this.$t("meta.password.reset.title"),
            meta: [
                {
                    hid: "description",
                    name: "description",
                    content: this.$t("meta.password.reset.description"),
                },
            ],
        };
    },
    layout: "guest",
};
</script>
