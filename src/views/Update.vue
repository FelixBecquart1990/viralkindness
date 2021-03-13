<template>
  <div style="height: 100vh" class="d-flex align-center justify-center">
    <v-img
      alt="logo"
      class="shrink"
      contain
      src="/img/illustrations/updated.svg"
      transition="scale-transition"
      width="200"
    />
  </div>
</template>
 
<script>
export default {
  name: "Update",
  mounted() {
    let self = this;
    setTimeout(function () {
      self.$router.push("/");
    }, 3000);
    this.$store.commit("setSnackbar", {
      color: "success",
      timeout: 3000,
      text: this.$i18n.t("update.applicationUpdated"),
    });
  },
};
</script>
