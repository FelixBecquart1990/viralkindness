<template>
  <v-row justify="center">
    <v-dialog
      content-class="dialog-addlocation"
      v-model="dialogAddLocation"
      overlay-opacity="0.2"
      max-width="500"
      transition="dialog-bottom-transition"
      origin="center bottom"
      persistent
    >
      <v-card min-height="180" class="transparent pa-4">
        <v-row no-gutters justify="center" class="my-0 py-0">
          <v-btn
            class="mb-4 text-none text--white rounded-pill pl-0"
            x-large
            color="primary"
            @click="
              $emit('confirmMarker', { type: 'last-checking' }),
                $store.commit('setDialogAddLocation', false)
            "
          >
            <div
              style="
                border: solid 5px var(--v-primary-base);
                height: 60px;
                width: 60px;
              "
              class="mr-2 rounded-pill"
            >
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
            </div>
            {{ $t("dialogAddLocation.helpNeeded") }}
          </v-btn>
        </v-row>
        <v-row no-gutters justify="center" class="my-0 py-0">
          <v-btn
            class="mb-4 text-none text--white rounded-pill pl-0"
            x-large
            color="primary"
            @click="
              $emit('confirmMarker', { type: 'last-giving' }),
                $store.commit('setDialogAddLocation', false)
            "
          >
            <div
              style="
                border: solid 5px var(--v-primary-base);
                height: 60px;
                width: 60px;
              "
              class="mr-2 rounded-pill"
            >
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
            </div>
            {{ $t("dialogAddLocation.foodGiven") }}
          </v-btn>
        </v-row>
        <v-row no-gutters justify="center" class="my-0 py-0"
          ><v-btn
            class="mb-4 text-none text--white rounded-pill pl-0"
            x-large
            color="primary"
            @click="
              $store.commit('setDialogAddLocation', false),
                $store.commit('setDialogNewDonationCentre', true)
            "
          >
            <div
              style="
                border: solid 5px var(--v-primary-base);
                height: 60px;
                width: 60px;
              "
              class="mr-2 rounded-pill"
            >
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
            </div>
            {{ $t("dialogAddLocation.addDonationCenter") }}
          </v-btn></v-row
        >
        <v-row no-gutters justify="center" class="my-0 py-0">
          <v-btn
            depressed
            large
            class="text-none rounded-pill"
            color="error"
            @click="
              $store.commit('setDialogAddLocation', false),
                $emit('removeLocation')
            "
            >{{ $t("dialogAddLocation.cancel") }}
          </v-btn></v-row
        >
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([]),
    dialogAddLocation: {
      get: function () {
        return this.$store.state.dialogAddLocation;
      },
      set: function (newValue) {
        this.$store.commit("setDialogAddLocation", newValue);
      },
    },
  },
};
</script>
<style >
.dialog-addlocation {
  position: fixed;
  bottom: 20px;
  margin: 0;
  border-radius: 20px !important;
  box-shadow: none !important;
}
</style>