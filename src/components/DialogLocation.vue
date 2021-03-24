<template>
  <v-row justify="center" class="dialog-information">
    <v-dialog
      content-class="dialog-location"
      v-model="dialogLocation"
      overlay-opacity="0.2"
      max-width="300"
      transition="dialog-bottom-transition"
      origin="center bottom"
      class="rounded-xl"
    >
      <v-card min-height="180" style="position: relative" class="rounded-xl">
        <v-row no-gutters justify="center" class="pt-4">
          <div
            style="position: absolute"
            v-if="selectedMarker.type === 'food-given'"
          >
            <v-img
              class="heart-1"
              src="/img/illustrations/heart.svg"
              width="30"
              height="30"
            ></v-img>
            <v-img
              class="heart-2"
              src="/img/illustrations/heart.svg"
              width="25"
              height="25"
            ></v-img>
          </div>
          <v-img
            :src="selectedMarker.icon"
            max-width="90"
            height="90"
          ></v-img> </v-row
        ><v-row no-gutters justify="center">
          <v-card-title
            class="headline pa-0"
            v-html="
              selectedMarker.type === 'donation-center'
                ? $t('dialogLocation.donateCenter')
                : selectedMarker.type === 'help-needed'
                ? $t('dialogLocation.helpNeeded')
                : $t('dialogLocation.foodGiven')
            "
          ></v-card-title
        ></v-row>
        <v-row
          no-gutters
          justify="center"
          class="mx-6 pb-3 text-body-2 mt-1 primary--text"
          v-if="selectedMarker.type === 'food-given'"
        >
          {{ handleISOToRelativeTime(selectedMarker.lastGiving.toDate()) }}
        </v-row>
        <v-row
          no-gutters
          v-if="selectedMarker.type !== 'donation-center'"
          justify="center"
        >
          <template v-if="selectedMarker.type === 'help-needed'">
            <v-row no-gutters justify="center" class="mb-2">
              <v-btn
                class="mx-6 mt-2 text-none rounded-pill"
                color="primary"
                x-large
                depressed
                @click="
                  $store.dispatch('updateLocation', {
                    type: 'lastGiving',
                    marker: selectedMarker,
                  })
                "
              >
                {{ $t("dialogLocation.justGaveFood") }}
              </v-btn>
              <div
                class="mx-6 text-caption mt-1 primary--text"
                v-if="selectedMarker.lastGiving"
              >
                {{ $t("dialogLocation.lastGiving") }}
                <b>
                  {{
                    handleISOToRelativeTime(selectedMarker.lastGiving.toDate())
                  }}</b
                >
              </div>
            </v-row>
            <v-row no-gutters justify="center" class="pb-6">
              <v-btn
                class="mx-6 text-none rounded-pill"
                color="secondary"
                depressed
                @click="
                  $store.dispatch('updateLocation', {
                    type: 'lastChecking',
                    marker: selectedMarker,
                  })
                "
              >
                {{ $t("dialogLocation.nobody") }}
              </v-btn>
              <div
                class="mx-6 mt-1 text-caption secondary--text"
                v-if="selectedMarker.lastChecking"
              >
                {{ $t("dialogLocation.lastChecking") }}
                <b>
                  {{
                    handleISOToRelativeTime(
                      selectedMarker.lastChecking.toDate()
                    )
                  }}</b
                >
              </div>
              <div
                class="mx-6 text-caption secondary--text"
                v-if="selectedMarker.numberOfChecks"
              >
                <b>{{
                  $t("dialogLocation.numberOfChecks", {
                    numberOfChecks: selectedMarker.numberOfChecks,
                  })
                }}</b>
                {{ $t("dialogLocation.checked") }}
              </div>
            </v-row>
          </template>
        </v-row>
        <v-row no-gutters v-else>
          <v-col>
            <v-row no-gutters class="mx-6 primary--text">
              <v-col cols="auto"
                ><v-icon color="primary" left
                  >mdi-label-variant-outline</v-icon
                ></v-col
              >
              <v-col
                ><b>{{ selectedMarker.name }}</b></v-col
              >
            </v-row>
            <v-row no-gutters class="mx-6 primary--text">
              <v-col cols="auto"
                ><v-icon color="primary" left>mdi-text</v-icon></v-col
              ><v-col>{{ selectedMarker.description }}</v-col>
            </v-row>
            <v-row no-gutters class="mx-6">
              <v-col cols="auto"
                ><v-icon color="primary" left
                  >mdi-map-marker-outline</v-icon
                ></v-col
              ><v-col>
                <a
                  :href="selectedMarker.addressLink"
                  target="_blank"
                  class="primary--text"
                  style="text-decoration: none"
                  >{{ selectedMarker.address }}</a
                ></v-col
              >
            </v-row>
            <v-row no-gutters class="mx-6">
              <v-col cols="auto"
                ><v-icon color="primary" left>mdi-phone-outline</v-icon></v-col
              ><v-col>
                <a
                  :href="`tel:${selectedMarker.phone}`"
                  target="_blank"
                  class="primary--text"
                  style="text-decoration: none"
                  >{{ selectedMarker.phone }}</a
                ></v-col
              >
            </v-row>
            <v-row no-gutters class="my-4 mx-6">
              <v-btn
                v-for="(social, index) in selectedMarker.socials"
                :key="index"
                class="text-none rounded-pill mr-2"
                outlined
                color="primary"
                target="_blank"
                :href="social.url"
              >
                {{ social.name }}
              </v-btn></v-row
            >
          </v-col>
        </v-row>
        <v-btn
          icon
          class="ma-2"
          style="position: absolute; top: 0; right: 0"
          @click="share"
          v-if="fromMobile && !iOS()"
          ><v-icon>mdi-share-variant-outline</v-icon></v-btn
        >
        <v-btn
          icon
          class="ma-2 white--text"
          :class="{
            'error--text':
              user.id === selectedMarker.userId && !selectedMarker.modified,
          }"
          style="position: absolute; top: 0; left: 0"
          @click="$emit('removeLocation', selectedMarker.id)"
          ><v-icon>mdi-delete-outline</v-icon></v-btn
        >
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { ISOToRelativeTime } from "@/utils/dates.js";

import { mapState, mapGetters } from "vuex";

export default {
  computed: {
    fromMobile() {
      // console.log(navigator.userAgent);
      return navigator.userAgent.indexOf("Mobile") !== -1;
    },
    ...mapState(["user"]),
    ...mapGetters(["selectedMarker"]),
    dialogLocation: {
      get: function () {
        return this.$store.state.dialogLocation;
      },
      set: function (newValue) {
        this.$store.commit("setDialogLocation", newValue);
      },
    },
  },
  methods: {
    iOS() {
      return (
        [
          "iPad Simulator",
          "iPhone Simulator",
          "iPod Simulator",
          "iPad",
          "iPhone",
          "iPod",
        ].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      );
    },
    handleISOToRelativeTime(date) {
      return ISOToRelativeTime(date);
    },
    share() {
      this.$store.commit("setSnackbar", {
        color: "primary",
        timeout: 3000,
        text: this.$i18n.t("googleMapLoader.featureNotAvailable"),
      });
      // if (navigator.share && this.fromMobile) {
      //   navigator
      //     .share({
      //       url: `https://viral-kindness.web.app/location/${this.selectedMarker.position.lat()}&${this.selectedMarker.position.lng()}`,
      //     })
      //     .then(() => console.log("Share complete"));
      // }
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
.dialog-location {
  position: fixed;
  bottom: 20px;
  margin: 0;
  border-radius: 20px !important;
}
.heart-1 {
  animation-name: heart1;
  animation-duration: 1s;
  position: relative;
  left: 66px;
  top: 20px;
  transform: rotateZ(25deg);
}
@keyframes heart1 {
  from {
    left: 0px;
    top: 40px;
    transform: rotateZ(0deg);
  }
  to {
    left: 66px;
    top: 20px;
    transform: rotateZ(25deg);
  }
}
.heart-2 {
  animation-name: heart2;
  animation-duration: 0.7s;
  position: relative;
  right: 66px;
  top: 20px;
  transform: rotateZ(-25deg);
}
@keyframes heart2 {
  from {
    right: 0px;
    top: 40px;
    transform: rotateZ(0deg);
  }
  to {
    right: 66px;
    top: 20px;
    transform: rotateZ(-25deg);
  }
}
</style>
