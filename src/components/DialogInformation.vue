<template>
  <div>
    <v-dialog
      v-model="dialogInformation"
      width="500"
      overlay-opacity="0.2"
      class="rounded-xl"
    >
      <v-card class="rounded-xl">
        <v-card-title class="headline white--text primary" primary-title>
          {{ $t("dialogInformation.information") }}

          <v-spacer></v-spacer>
          <v-btn
            v-if="$vuetify.breakpoint.smAndDown"
            icon
            dark
            @click="dialogInformation = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-title class="primary--text">
          <v-icon color="black" left class="primary--text"
            >mdi-map-marker-plus</v-icon
          >{{ $t("dialogInformation.addNewLocation") }}
        </v-card-title>

        <v-card-text class="pb-0 pt-2">
          <v-row no-gutters>
            <v-col cols="auto" class="pr-2">
              <div
                class="white rounded-pill d-flex align-center justify-center"
                style="height: 50px; width: 50px"
              >
                <v-img
                  contain
                  height="50"
                  width="50"
                  style="margin-top: -6px"
                  src="/img/illustrations/new-location.svg"
                ></v-img>
              </div>
            </v-col>
            <v-col align-self="center" class="text-body-1">{{
              $t("dialogInformation.touchMap")
            }}</v-col>
          </v-row>
        </v-card-text>

        <v-card-title class="primary--text">
          <v-icon color="black" left class="primary--text"
            >mdi-map-marker-question</v-icon
          >{{ $t("dialogInformation.selectLocation") }}
        </v-card-title>
        <v-card-text class="pb-0">
          <v-row no-gutters>
            <v-col cols="auto" class="pr-2">
              <div
                class="white rounded-pill d-flex align-center justify-center"
                style="height: 50px; width: 50px"
              >
                <v-img
                  contain
                  height="35"
                  width="35"
                  style="margin-top: -6px"
                  src="/img/illustrations/food-donation-2-empty.svg"
                ></v-img>
              </div>
            </v-col>
            <v-col align-self="center" class="text-body-1"
              ><b>{{ $t("dialogInformation.helpNeeded") }}</b
              ><br />
              {{ $t("dialogInformation.someoneWasFound") }}</v-col
            >
          </v-row>
          <v-row no-gutters>
            <v-col cols="auto" class="pr-2">
              <div
                class="white rounded-pill d-flex align-center justify-center"
                style="height: 50px; width: 50px"
              >
                <v-img
                  contain
                  height="35"
                  width="35"
                  src="/img/illustrations/food-donation-2.svg"
                ></v-img>
              </div>
            </v-col>
            <v-col align-self="center" class="text-body-1"
              ><b>{{ $t("dialogInformation.foodGiven") }}</b
              ><br />
              {{ $t("dialogInformation.someoneWasGivenFood") }}
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="auto" class="pr-2">
              <div
                class="white rounded-pill d-flex align-center justify-center"
                style="height: 50px; width: 50px"
              >
                <v-img
                  contain
                  height="35"
                  width="35"
                  style="margin-top: -6px"
                  src="/img/illustrations/donation-center.svg"
                ></v-img>
              </div>
            </v-col>
            <v-col align-self="center" class="text-body-1"
              ><b>{{ $t("dialogInformation.donateCenter") }}</b
              ><br />
              {{ $t("dialogInformation.newDonationCenter") }}
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-title class="primary--text">
          <v-icon color="black" left class="primary--text"
            >mdi-account-group</v-icon
          >{{ $t("dialogInformation.authors") }}
        </v-card-title>
        <v-card-text>
          {{ $t("dialogInformation.madeBy") }}
          <a
            href="https://www.linkedin.com/in/trinhbui/"
            target="_blank"
            class="primary--text"
            style="text-decoration: none"
            >Trinh Bui</a
          >
          &
          <a
            href="https://www.linkedin.com/in/f%C3%A9lix-becquart-8a5a46a6/"
            target="_blank"
            class="primary--text"
            style="text-decoration: none"
            >Félix Becquart</a
          ><br />
          {{ $t("dialogInformation.inspiredBy") }}
          <a
            href="https://www.facebook.com/groups/viral.kindness.saigon"
            target="_blank"
            class="primary--text"
            style="text-decoration: none"
            >Viral Kindness</a
          >
        </v-card-text>
        <v-row no-gutters class="mx-6 pb-8" justify="center">
          <v-btn
            class="mt-2 text-none rounded-pill"
            color="primary"
            large
            depressed
            href="https://www.facebook.com/groups/viralkindnessapp"
            target="_blank"
          >
            {{ $t("dialogInformation.helpUs") }}
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  computed: {
    dialogInformation: {
      get() {
        return this.$store.state.dialogInformation;
      },
      set(val) {
        return this.$store.commit("setDialogInformation", val);
      },
    },
  },
};
</script>

