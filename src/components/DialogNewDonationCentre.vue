<template>
  <div>
    <v-dialog
      v-model="dialogNewDonationCentre"
      width="500"
      overlay-opacity="0.2"
      class="rounded-xl"
      persistent
    >
      <v-card class="rounded-xl">
        <v-card-title class="headline white--text primary" primary-title>
          {{ $t("dialogNewDonationCentre.newDonationCenter") }}
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            @click="(dialogNewDonationCentre = false), $emit('removeLocation')"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-row no-gutters justify="center" class="pt-4">
          <v-img
            src="/img/illustrations/donation-center.svg"
            max-width="90"
            height="90"
          ></v-img>
        </v-row>

        <v-row no-gutters class="mx-6 pb-6 mt-6">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            style="width: 100%"
          >
            <v-row no-gutters class="my-0">
              <v-text-field
                :label="$t('dialogNewDonationCentre.name')"
                outlined
                prepend-inner-icon="mdi-label-variant-outline"
                color="primary"
                style="width: 100%"
                v-model="name"
                :rules="[
                  (v) => !!v || $t('dialogNewDonationCentre.nameRequired'),
                ]"
              ></v-text-field>
            </v-row>

            <v-row no-gutters class="my-0">
              <v-textarea
                :label="$t('dialogNewDonationCentre.description')"
                outlined
                rows="2"
                prepend-inner-icon="mdi-text"
                color="primary"
                style="width: 100%"
                v-model="description"
              ></v-textarea>
            </v-row>

            <v-row no-gutters class="my-0">
              <v-text-field
                :label="$t('dialogNewDonationCentre.address')"
                outlined
                prepend-inner-icon="mdi-map-marker"
                color="primary"
                style="width: 100%"
                v-model="address"
                :rules="[
                  (v) => !!v || $t('dialogNewDonationCentre.addressRequired'),
                ]"
              ></v-text-field>
            </v-row>

            <v-row no-gutters class="my-0">
              <v-text-field
                :label="$t('dialogNewDonationCentre.phone')"
                prepend-inner-icon="mdi-phone"
                outlined
                color="primary"
                style="width: 100%"
                v-model="phone"
                :rules="[
                  (v) => !!v || $t('dialogNewDonationCentre.phoneRequired'),
                ]"
              ></v-text-field>
            </v-row>

            <v-row no-gutters class="my-0">
              <v-col class="pr-2"
                ><v-text-field
                  :label="$t('dialogNewDonationCentre.facebookLink')"
                  outlined
                  color="primary"
                  style="width: 100%"
                  v-model="socials[0].url"
                ></v-text-field></v-col
              ><v-col class="pl-2">
                <v-text-field
                  :label="$t('dialogNewDonationCentre.instagramLink')"
                  outlined
                  color="primary"
                  style="width: 100%"
                  v-model="socials[1].url"
                ></v-text-field
              ></v-col>
            </v-row>

            <v-row no-gutters justify="center" class="my-0 py-0"
              ><v-btn
                :disabled="!valid"
                color="primary"
                class="text-none"
                rounded
                depressed
                @click="validate"
                large
              >
                {{ $t("dialogNewDonationCentre.create") }}
                <v-icon right>mdi-plus</v-icon>
              </v-btn></v-row
            >
          </v-form>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: ["newLocation"],
  data: () => ({
    valid: true,
    name: "",
    type: "donation-center",
    address: "",
    phone: "",
    description: "",
    socials: [
      {
        name: "Facebook",
        url: "",
      },
      {
        name: "Instagram",
        url: "",
      },
    ],
  }),
  computed: {
    dialogNewDonationCentre: {
      get() {
        return this.$store.state.dialogNewDonationCentre;
      },
      set(val) {
        return this.$store.commit("setDialogNewDonationCentre", val);
      },
    },
    ...mapState(["user"]),
    socialsComputed() {
      let socials = [];
      this.socials[0].url !== "" ? socials.push(this.socials[0]) : null;
      this.socials[1].url !== "" ? socials.push(this.socials[1]) : null;
      return socials;
    },
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        let data = {
          type: "donation-center",
          name: this.name,
          address: this.address,
          phone: this.phone,
          description: this.description,
          socials: this.socialsComputed,
          userId: this.user.id,
        };
        this.$emit("confirmMarker", data);
        this.dialogNewDonationCentre = false;
      }
    },
  },
};
</script>


<style>
</style>
