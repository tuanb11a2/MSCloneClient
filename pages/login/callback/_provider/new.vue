<template>
    
</template>

<script>
export default {
    layout: "guest",
    mounted() {
        window.close();
        window.opener.location.href = "/register?user=" + this.$route.query.user;
    }
}
</script>