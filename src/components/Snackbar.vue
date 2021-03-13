<template>
  <v-snackbar
    v-model="snackbar.active"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    :bottom="!$vuetify.breakpoint.mobile"
    :right="!$vuetify.breakpoint.mobile"
    :top="$vuetify.breakpoint.mobile"
    ><v-row no-gutters>
      {{ snackbar.text }}<v-spacer></v-spacer>
      <v-btn v-if="snackbar.update" @click="update()" outlined>{{
        $t("update.update")
      }}</v-btn>
    </v-row>
  </v-snackbar>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["snackbar"]),
  },
  methods: {
    update() {
      this.$router.push("/update");
      setTimeout(function () {
        location.reload();
      }, 40);
    },
  },
};
</script>
