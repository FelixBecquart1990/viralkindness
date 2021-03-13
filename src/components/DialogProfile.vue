<template>
  <div>
    <v-dialog
      v-model="dialogProfile"
      width="500"
      overlay-opacity="0.2"
      class="rounded-xl"
    >
      <v-card class="rounded-xl">
        <v-card-title class="headline white--text primary" primary-title>
          {{ $t("dialogProfile.profile") }}
          <v-spacer></v-spacer>
          <v-btn
            v-if="$vuetify.breakpoint.smAndDown"
            icon
            dark
            @click="dialogProfile = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-row
          no-gutters
          justify="center"
          style="position: relative"
          class="mt-12"
        >
          <v-card
            v-if="setSelfie"
            height="100"
            width="100"
            style="overflow: hidden; border-radius: 50%"
          >
            <v-progress-linear
              v-show="loadingCamera"
              indeterminate
              color="primary"
              height="100"
            ></v-progress-linear>
            <div
              v-show="setSelfie"
              class="d-flex align-center justify-center"
              style="
                width: 100%;
                height: 100%;
                position: absolute;
                z-index: 3;
                margin-top: 10px;
              "
            >
              <p class="count-down" v-if="!loadingCamera && countDown == 3">
                3
              </p>
              <p class="count-down" v-if="!loadingCamera && countDown == 2">
                2
              </p>
              <p class="count-down" v-if="!loadingCamera && countDown == 1">
                1
              </p>
            </div>

            <vue-web-cam
              v-show="setSelfie"
              class="webcam"
              style="transform: scaleX(-1)"
              ref="webcam"
              :device-id="deviceId"
              height="100%"
              @started="onStarted"
              @stopped="onStopped"
              @error="onError"
              @cameras="onCameras"
              @camera-change="onCameraChange"
            />
          </v-card>
          <v-img
            v-else
            alt="Profile"
            class="shrink"
            style="border-radius: 50%; transform: scaleX(-1)"
            :src="imageUrl ? imageUrl : user.profilePictureUrl"
            width="100"
            height="100"
            @click="onStart()"
          />
          <v-icon
            v-if="!user.profilePictureUrl && !setSelfie"
            @click="onStart()"
            size="90"
            class="mt-1 primary--text"
            style="position: absolute; left: calc(50% - 46px)"
            >mdi-account-circle</v-icon
          >
          <v-btn
            v-if="!user.profilePictureUrl"
            class="text-none primary"
            style="
              z-index: 1;
              position: absolute;
              left: calc(50% + 12px);
              top: 60px;
            "
            icon
            @click="onStart()"
          >
            <v-icon color="white">mdi-camera-outline</v-icon>
          </v-btn>
        </v-row>

        <v-row no-gutters class="mx-6 pb-12 mt-7">
          <v-text-field
            :label="$t('dialogProfile.name')"
            outlined
            color="primary"
            v-model="user.name"
            @blur="save('name', user.name)"
            @keyup.enter="save('name', user.name)"
            hide-details
          ></v-text-field>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { WebCam } from "vue-web-cam";

export default {
  components: {
    "vue-web-cam": WebCam,
  },
  data: () => ({
    valid: true,
    model: null,
    menu: false,
    countDown: 4,
    loadingCamera: false,
    setSelfie: false,
    camera: null,
    deviceId: null,
    devices: [],
    imageUrl: null,
  }),
  watch: {
    camera: function (id) {
      // console.log("camera ", id);
      this.deviceId = id;
    },
    devices: function () {
      // console.log("devices ", this.devices);
      const [first, ...tail] = this.devices;
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    },
  },
  computed: {
    dialogProfile: {
      get() {
        return this.$store.state.dialogProfile;
      },
      set(val) {
        return this.$store.commit("setDialogProfile", val);
      },
    },
    device: function () {
      return this.devices.find((n) => n.deviceId === this.deviceId);
    },
    user: {
      get: function () {
        return this.$store.state.user;
      },
      set: function (newValue) {
        this.$store.commit("setUser", newValue);
      },
    },
  },
  methods: {
    onCapture() {
      this.setSelfie = false;
      let image = this.$refs.webcam.capture();
      this.imageUrl = image;
      this.onStop();
      this.$store.dispatch("uploadItem", {
        image: image,
        folder: "profilePictures",
        field: "profilePictureUrl",
      });
    },
    onStarted(stream) {
      this.loadingCamera = false;
      let self = this;
      setTimeout(function () {
        self.onCapture();
        self.countDown = "";
      }, 3000);
      setTimeout(function () {
        self.countDown = 1;
      }, 2000);
      setTimeout(function () {
        self.countDown = 2;
      }, 1000);
      this.countDown = 3;
    },
    onStopped(stream) {},
    onStop() {
      this.$refs.webcam.stop();
    },
    onStart() {
      this.setSelfie = true;
      this.loadingCamera = true;
      if (this.$refs.webcam) this.$refs.webcam.start();
    },
    onError(error) {
      console.log(error);
    },
    onCameras(cameras) {
      this.devices = cameras;
      this.onStart();
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
    },
    save(field, value) {
      this.$store.commit("setSnackbar", {
        color: "success",
        timeout: 3000,
        text: this.$i18n.t("dialogProfile.saved"),
      });
      let update = {};
      update[field] = value;
      this.$store.dispatch("updateUser", update);
    },
  },
};
</script>


<style>
/* * {
  border: solid 1px red;
} */
@keyframes countDown {
  0% {
    transform: scale(3);
  }
  100% {
    transform: scale(1);
  }
}
.count-down {
  font-size: 50px;
  color: white;
  animation: countDown 2s;
}

@keyframes zoominoutselfie {
  0% {
    transform: scale(1) scaleX(-1);
  }
  50% {
    transform: scale(0.9) scaleX(-1);
  }
  100% {
    transform: scale(1) scaleX(-1);
  }
}
@keyframes appear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.webcam {
  object-fit: cover;
}
.v-slide-group__wrapper {
  padding-right: 20px;
}
</style>
