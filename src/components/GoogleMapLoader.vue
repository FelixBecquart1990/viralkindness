<template>
  <div>
    <div class="blur-button-locate-user"></div>
    <v-btn
      icon
      color="white"
      style="position: fixed; z-index: 2; right: 31px; bottom: 31px"
      @click="getUserPosition()"
    >
      <v-icon color="primary" size="26">mdi-crosshairs-gps</v-icon>
    </v-btn>

    <v-row
      no-gutters
      style="position: fixed; top: 1px; right: 70px; left: 0; z-index: 4"
    >
      <v-text-field
        @focus="searchPlace()"
        :label="$t('googleMapLoader.addPlace')"
        solo
        rounded
        class="ma-6"
        prepend-inner-icon="mdi-map-marker"
        style="width: 100%"
      ></v-text-field>
    </v-row>

    <div
      class="google-map"
      ref="googleMap"
      style="width: 100%; height: 100vh"
    ></div>
    <DialogAddLocation
      @removeLocation="removeLocation"
      @confirmMarker="confirmMarker"
    />
    <DialogLocation @removeLocation="removeLocation" />
    <DialogNewDonationCentre
      @confirmMarker="confirmMarker"
      @removeLocation="removeLocation"
    />
  </div>
</template>

<script>
import DialogAddLocation from "@/components/DialogAddLocation.vue";
import DialogLocation from "@/components/DialogLocation.vue";
import DialogNewDonationCentre from "@/components/DialogNewDonationCentre.vue";
import { mapState, mapGetters } from "vuex";

import { Loader } from "@googlemaps/js-api-loader";
const fb = require("../firebase.js");

export default {
  components: {
    DialogAddLocation,
    DialogLocation,
    DialogNewDonationCentre,
  },
  data() {
    return {
      google: null,
      map: null,
      apiKey: "", // add your google API key here
      newLocation: null,
      liveData: null,
    };
  },
  props: ["location"],
  computed: {
    ...mapState(["overlay", "user"]),
    ...mapGetters(["selectedMarker"]),

    markers: {
      get: function () {
        return this.$store.state.markers;
      },
      set: function (newValue) {
        this.$store.commit("setMarkers", newValue);
      },
    },
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    getMarkers() {
      console.log("getMarkers");
      let self = this;
      if (this.liveData) return;
      this.liveData = true;
      fb.db
        .collection("markers")
        .orderBy("createdAt", "desc")
        .limit(100)
        .onSnapshot(function (querySnapshot) {
          // console.log("size " + querySnapshot.size);
          querySnapshot.docChanges().forEach(function (change) {
            let data = Object.assign({ id: change.doc.id }, change.doc.data());
            if (change.type === "added") {
              if (!change.doc.id) return;
              // console.log("add ", change.doc.id);
              if (!data.lastGiving && !data.lastChecking) {
                data.type = "donation-center";
              } else if (
                (!data.lastGiving && data.lastChecking) ||
                data.lastGiving < data.lastChecking
              ) {
                data.type = "help-needed";
              } else {
                if (
                  data.lastGiving <
                  fb.firebase.firestore.Timestamp.now() - 86400000
                ) {
                  data.type = "help-needed";
                } else {
                  data.type = "food-given";
                }
              }
              const marker = new google.maps.Marker({
                ...data,
                position: new google.maps.LatLng(
                  data.position.latitude,
                  data.position.longitude
                ),
                map: self.map,
                icon: self.getIcon(data.type),
                animation: google.maps.Animation.DROP,
              });
              self.$store.commit("addMarker", marker);
              marker.addListener("click", (data) => {
                self.$store.commit("setSelectedMarkerId", marker.id);
                self.$store.commit("setDialogLocation", true);
              });
            }
            if (change.type === "modified") {
              // console.log("modify ", change.doc.id);
              if (!change.doc.id) return;
              if (data.lastGiving || data.lastChecking) {
                // remove previous marker
                let markerToUpdate = self.$store.state.markers.find(
                  (marker) => marker.id === data.id
                );
                markerToUpdate.setMap(null);
                if (
                  (!data.lastGiving && data.lastChecking) ||
                  data.lastGiving < data.lastChecking
                ) {
                  data.type = "help-needed";
                } else {
                  if (
                    data.lastGiving <
                    fb.firebase.firestore.Timestamp.now() - 86400000
                  ) {
                    data.type = "help-needed";
                  } else {
                    data.type = "food-given";
                  }
                }
                const marker = new google.maps.Marker({
                  ...data,
                  position: new google.maps.LatLng(
                    data.position.latitude,
                    data.position.longitude
                  ),
                  map: self.map,
                  icon: self.getIcon(data.type),
                  animation: google.maps.Animation.DROP,
                });
                // console.log("modified marker: ", marker);
                self.$store.commit("modifyMarker", marker);
                marker.addListener("click", (data) => {
                  self.$store.commit("setSelectedMarkerId", marker.id);
                  self.$store.commit("setDialogLocation", true);
                });
              }
            }
            if (change.type === "removed") {
              if (!change.doc.id) return;
              // console.log("removed ", change.doc.id);
              let markerToRemove = self.$store.state.markers.find(
                (marker) => marker.id === data.id
              );
              markerToRemove.setMap(null);
              self.$store.commit("removeMarker", change.doc);
            }
          });
        });
      // if (this.location !== {}) {
      //   this.map.setZoom(18);
      //   this.map.panTo(
      //     new google.maps.LatLng(this.location.lat, this.location.lng)
      //   );
      // }
    },
    getUserPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.map.setZoom(18);
            this.map.panTo(pos);
          },
          () => {
            this.$store.commit("setSnackbar", {
              color: "error",
              timeout: 3000,
              text: this.$i18n.t("googleMapLoader.geolocationFailed"),
            });
          }
        );
      } else {
        // Browser doesn't support Geolocation
        this.$store.commit("setSnackbar", {
          color: "error",
          timeout: 3000,
          text: this.$i18n.t("googleMapLoader.geolocationNotSupported"),
        });
      }
    },
    loadMap() {
      const loader = new Loader({
        apiKey: this.apiKey,
        version: "weekly",
        libraries: ["places"],
      });
      loader
        .load()
        .then(() => {
          this.map = new google.maps.Map(this.$refs.googleMap, {
            center: {
              lat: 10.778378232056642,
              lng: 106.6736442387736,
            },
            zoom: 13,
            minZoom: 6,
            maxZoom: 19,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            styles: [
              {
                featureType: "poi",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "transit",
                stylers: [{ visibility: "off" }],
              },
            ],
          });
          let self = this;
          google.maps.event.addListener(this.map, "click", function (event) {
            self.$store.commit("setDialogLocation", false);
            self.addMarker(event.latLng);
            self.$store.commit("setDialogAddLocation", true);
          });

          this.getMarkers();
        })
        .catch((e) => {});
    },
    removeLocation(id) {
      if (id) {
        let markerToRemove = this.markers.find((element) => element.id === id);
        this.$store.dispatch("removeMarker", markerToRemove);
        return;
      }
      this.markers
        .filter(function (marker) {
          return !marker.id;
        })
        .forEach((element) => {
          element.setMap(null);
        });
      this.markers = this.markers.filter(function (marker) {
        return marker.id;
      });
    },
    confirmMarker(data) {
      this.removeLocation();
      let markerData = Object.assign(data, {
        position: this.newLocation,
        map: this.map,
        icon: this.getIcon(data.type),
        animation: google.maps.Animation.DROP,
        userId: this.user.id,
      });

      this.$store.dispatch("addMarker", markerData);
    },
    addMarker(location) {
      this.newLocation = location;
      let newMarker = new google.maps.Marker({
        position: location,
        map: this.map,
        icon: `/img/illustrations/new-location.svg`,
        animation: google.maps.Animation.DROP,
      });
      // console.log(newMarker);
      this.markers.push(newMarker);
    },
    getRandom() {
      return Math.floor(Math.random() * 3 + 1);
    },
    getIcon(type) {
      if (type === "food-given") {
        return `/img/illustrations/food-donation-2.svg`;
      }
      if (type === "help-needed") {
        return `/img/illustrations/food-donation-2-empty.svg`;
      }
      if (type === "donation-center") {
        return "/img/illustrations/donation-center.svg";
      }
    },
    searchPlace() {
      this.$store.commit("setOverlay", true);
      this.$store.commit("setSnackbar", {
        color: "primary",
        timeout: 3000,
        text: this.$i18n.t("googleMapLoader.featureNotAvailable"),
      });
    },
  },
};
</script>

<style>
.blur-button-locate-user {
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
  bottom: 24px;
  height: 50px;
  width: 50px;
}
</style>
