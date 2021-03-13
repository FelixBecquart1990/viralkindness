<template>
  <v-app>
    <v-main>
      <transition name="fade-page">
        <router-view></router-view>
      </transition>
    </v-main>
    <div
      style="position: fixed; top: 0; right: 5px; font-size: 10px; opacity: 0.1"
    >
      {{ $t("app.version", { version: version }) }}
    </div>
    <Snackbar />
    <Overlay />
  </v-app>
</template>

<script>
import Snackbar from "./components/Snackbar";
import Overlay from "./components/Overlay";

import { mapState } from "vuex";

export default {
  name: "App",

  components: {
    Snackbar,
    Overlay,
  },
  computed: {
    ...mapState(["version"]),
  },
  data: () => ({
    //
  }),
};
</script>

<style>
.v-application--wrap {
  min-height: 0 !important;
}
/* page transition */
.fade-page-enter-active {
  transition: all 0.5s;
}
.fade-page-enter /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
</style>