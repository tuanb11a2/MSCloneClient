<template>
    
</template>

<script>
export default {
    head() {
        return {
            title: this.$t("meta.help.title"),
            meta: [
                {
                    hid: "description",
                    name: "description",
                    content: this.$t("meta.help.description"),
                },
            ],
        };
    },
}
</script