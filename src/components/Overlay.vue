<template>
  <div
    v-if="overlay"
    class="smooth-overlay"
    @click="$store.commit('setOverlay', false)"
    style="
      position: fixed;
      top: 0px;
      left: 0px;
      bottom: 0px;
      right: 0px;
      background-color: #00000000;
      z-index: 3;
    "
  ></div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["overlay"]),
  },
};
</script>
<style scoped>
.smooth-overlay {
  animation: 0.5s smooth-overlay;
  /* color: #03afb842 */
}
@keyframes smooth-overlay {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
