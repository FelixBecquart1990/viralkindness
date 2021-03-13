<template>
  <div class="home">
    <div class="blur-button-language"></div>
    <v-btn
      icon
      style="position: fixed; z-index: 2; right: 31px; top: 31px"
      @click="switchLanguage()"
    >
      <v-img
        :src="`/img/illustrations/${$i18n.locale}.svg`"
        width="30"
        height="30"
        contain
        aspect-ratio="1"
      ></v-img>
    </v-btn>

    <div class="blur-buttons">
      <div style="position: relative">
        <v-btn
          icon
          color="white"
          style="position: absolute; z-index: 2; right: 6px; top: 8px"
          @click="$store.commit('setDialogProfile', true)"
        >
          <v-icon color="primary" size="32">mdi-account-circle</v-icon>
        </v-btn>
        <v-btn
          icon
          color="white"
          style="position: absolute; z-index: 2; right: 6px; top: 51px"
          @click="$store.commit('setDialogInformation', true)"
        >
          <v-icon color="primary" size="32">mdi-information</v-icon>
        </v-btn>
        <v-btn
          icon
          color="white"
          style="position: absolute; z-index: 2; right: 6px; top: 94px"
          @click="$store.commit('setDialogCharities', true)"
        >
          <v-icon color="primary" size="32">mdi-charity</v-icon>
        </v-btn>
      </div>
    </div>

    <DialogInformation />
    <DialogProfile />
    <DialogCharities />
    <GoogleMapLoader :location="location" />
  </div>
</template>

<script>
import GoogleMapLoader from "@/components/GoogleMapLoader";
import DialogInformation from "@/components/DialogInformation.vue";
import DialogProfile from "@/components/DialogProfile.vue";
import DialogCharities from "@/components/DialogCharities.vue";
import dayjs from "dayjs";

export default {
  components: {
    GoogleMapLoader,
    DialogProfile,
    DialogInformation,
    DialogCharities,
  },
  data() {
    return {
      location: {},
    };
  },
  mounted() {
    // if (this.$route.params.location) {
    //   let location = this.$route.params.location.split("&");
    //   this.location.lat = location[0];
    //   this.location.lng = location[1];
    // }
    if (localStorage.locale) {
      if (JSON.parse(localStorage.locale) === "vn") {
        this.$i18n.locale = "vn";
        dayjs.locale("vi");
      } else {
        this.$i18n.locale = "en";
        dayjs.locale("en");
      }
    } else if (
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language === "vn"
    ) {
      this.$i18n.locale = "vn";
      dayjs.locale("vi");
    }
  },
  methods: {
    switchLanguage() {
      if (this.$i18n.locale === "vn") {
        localStorage.setItem("locale", JSON.stringify("en"));
        this.$i18n.locale = "en";
        dayjs.locale("en");
      } else {
        localStorage.setItem("locale", JSON.stringify("vn"));
        this.$i18n.locale = "vn";
        dayjs.locale("vi");
      }
    },
  },
};
</script>

<style >
.blur-buttons {
  background-color: rgba(89, 89, 89, 0.05);
  backdrop-filter: blur(9.5px);
  -webkit-backdrop-filter: blur(9.5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(14, 14, 14, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(14, 14, 14, 0.19) 0px 6px 15px 0px;
  border-radius: 28px;
  -webkit-border-radius: 28px;
  color: rgba(128, 128, 128, 0.2);
  position: fixed;
  z-index: 2;
  right: 24px;
  top: 100px;
  height: 138px;
  width: 50px;
}

.blur-button-language {
  background-color: rgba(89, 89, 89, 0.05);
  backdrop-filter: blur(9.5px);
  -webkit-backdrop-filter: blur(9.5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: rgba(14, 14, 14, 0.19) 0px 6px 15px 0px;
  -webkit-box-shadow: rgba(14, 14, 14, 0.19) 0px 6px 15px 0px;
  border-radius: 28px;
  -webkit-border-radius: 28px;
  color: rgba(128, 128, 128, 0.2);
  position: fixed;
  z-index: 2;
  right: 24px;
  top: 24px;
  height: 50px;
  width: 50px;
}
</style>