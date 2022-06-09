<template>
    
</template>

<script>
export default {
    head() {
        return {
            title: this.$t("meta.profile.title"),
            meta: [
                {
                    hid: "description",
                    name: "description",
                    content: this.$t("meta.profile.description"),
                },
            ],
        };
    },
}
</script>