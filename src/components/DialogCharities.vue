<template>
  <div>
    <v-dialog
      v-model="dialogCharities"
      width="500"
      overlay-opacity="0.2"
      class="rounded-xl"
    >
      <v-card class="pb-6 rounded-xl" min-height="600">
        <v-card-title class="headline white--text primary" primary-title>
          {{ $t("dialogCharities.charities") }}
          <v-spacer></v-spacer>
          <v-btn
            v-if="$vuetify.breakpoint.smAndDown"
            icon
            dark
            @click="dialogCharities = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <transition-group name="list-complete">
          <div
            v-for="(charity, index) in charities"
            :key="index"
            class="list-complete-item mx-6 pt-6"
          >
            <v-row no-gutters>
              <v-img :src="charity.imageUrl" class="primary lighten-2 rounded">
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-row>
            <v-row no-gutters class="text-h5"> {{ charity.name }}</v-row>
            <v-row no-gutters>
              <v-btn
                v-for="(social, index) in charity.socials"
                :key="index"
                class="text-none rounded-pill mr-2"
                outlined
                color="primary"
                target="_blank"
                :href="social.url"
              >
                {{ social.name }}
              </v-btn>
            </v-row>
            <v-divider
              v-if="index !== charities.length - 1"
              class="mt-6"
            ></v-divider>
          </div>
        </transition-group>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      charities: [
        {
          name: "Viral Kindness",
          imageUrl: "https://i.imgur.com/RVYHz1m.jpg",
          socials: [
            {
              name: "Facebook",
              url: "https://www.facebook.com/groups/viral.kindness.saigon",
            },
          ],
        },
        {
          name: "Help Saigon's Homeless",
          imageUrl: "https://i.imgur.com/e532nhB.jpg",
          socials: [
            {
              name: "Facebook",
              url: "https://www.facebook.com/groups/HelpSaigonsHomeless",
            },
          ],
        },
      ],
    };
  },
  computed: {
    dialogCharities: {
      get() {
        return this.$store.state.dialogCharities;
      },
      set(val) {
        return this.$store.commit("setDialogCharities", val);
      },
    },
  },
};
</script>

<style>
/* transition list */
.list-complete-item {
  transition: all 0.5s;
}
.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
.list-complete-leave-active {
  position: absolute;
  z-index: -1;
}
</style>