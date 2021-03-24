import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '../i18n'

const fb = require("../firebase.js");

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    version:"0.0.25",
    snackbar: { active: false, color: "", mode: "", timeout: -1, text: "", update: false },
    dialogLocation:false,
    dialogAddLocation:false,
    dialogInformation:false,
    dialogProfile:false,
    dialogCharities:false,    
    dialogNewDonationCentre:false,
    selectedLocationId: null,
    user:{},
    markers: [],
    overlay: false,
  },
  getters: {
    selectedMarker: (state) => {
      return state.markers.find(marker => marker.id === state.selectedLocationId) || {}
    }
  },
  mutations: {
    addMarker(state, val) {
      state.markers.push(val);
    },
    removeMarker(state, val) {
      state.markers = state.markers.filter(function (marker) {
        return marker.id != val.id
      });
    },
    modifyMarker(state, val) {
      state.markers = state.markers.map(marker => (marker.id == val.id ? Object.assign(marker,val) : marker))
    },
    setUser(state, val) {
      state.user = val;
    },
    setOverlay(state, val) {
      state.overlay = val;
    },
    setMarkers(state, val) {
      state.markers = val;
    },
    setVersion(state, val) {
      state.version = val;
    },
    setDialogNewDonationCentre(state, val) {
      state.dialogNewDonationCentre = val;
    },
    setDialogAddLocation(state, val) {
      state.dialogAddLocation = val;
    },
    setDialogCharities(state, val) {
      state.dialogCharities = val;
    },
    setDialogProfile(state, val) {
      state.dialogProfile = val;
    },
    setDialogLocation(state, val) {
      state.dialogLocation = val;
    },
    setDialogInformation(state, val) {
      state.dialogInformation = val;
    },
    setSelectedMarkerId(state, val) {
      state.selectedLocationId = val;
    },
    setSnackbar(state, val) {
      state.snackbar = Object.assign({}, val, { active: true });
    },
  },
  actions: {
    async createAnonymousUser({ commit, state, dispatch }) {
      console.log("createAnonymousUser");
      try {
        const cred = await fb.auth.signInAnonymously();
        if (cred) {  
          fb.db
            .collection("users")
            .doc(cred.user.uid)
            .set({
              createdAt: fb.firebase.firestore.Timestamp.now(),
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
    getUser({ commit, state }) {
      console.log("getUser");
      fb.db
        .collection("users")
        .doc(fb.firebase.auth().currentUser.uid)
        .onSnapshot((doc) => {
        commit(
          "setUser",
            Object.assign(
              {
                id: fb.firebase.auth().currentUser.uid,
              },
              doc.data()
            )
          );
      });
    },
    updateUser({ state }, update) {
      console.log("updateUser");
      fb.db
        .collection("users")
        .doc(fb.firebase.auth().currentUser.uid)
        .update(update)
        .catch((err) => {
          console.log(err);
        });
    },
    updateLocation({ state, commit, dispatch }, update) {
      console.log("updateLocation");
      commit("setDialogLocation", false);
      let data = {}
      if (update.type === "lastGiving"){
        data.lastGiving = fb.firebase.firestore.Timestamp.now()
        data.numberOfChecks = 0
        data.lastChecking = fb.firebase.firestore.Timestamp.now()
      }
      if (update.type === "lastChecking"){
        if(update.marker.numberOfChecks && update.marker.numberOfChecks > 0){
          dispatch('removeMarker', update.marker)
          return
        }
        data.lastChecking = fb.firebase.firestore.Timestamp.now()
        data.numberOfChecks = update.marker.numberOfChecks?update.marker.numberOfChecks+1:1
      }
      fb.db
        .collection("markers")
        .doc(update.marker.id)
        .update(data)
        .catch((err) => {
          console.log(err);
        });
    },
    addMarker({ state }, marker) {
      // console.log(marker)
      let markerToSave = {}
      markerToSave.position = new fb.firebase.firestore.GeoPoint(marker.position.lat(), marker.position.lng())
      markerToSave.createdAt = fb.firebase.firestore.Timestamp.now()
      markerToSave.userId = state.user.id
      if (marker.type === "last-giving") markerToSave.lastGiving = fb.firebase.firestore.Timestamp.now();
      if (marker.type === "last-checking") markerToSave.lastChecking = fb.firebase.firestore.Timestamp.now();
      if (marker.type === "donation-center"){
        markerToSave.name= marker.name || null
        markerToSave.address= marker.address || null
        markerToSave.phone= marker.phone || null
        markerToSave.description= marker.description || null
        markerToSave.socials= marker.socials || null
        markerToSave.userId= marker.userId || null
      }

      fb.db.collection("markers").doc().set(markerToSave);
    },
    removeMarker({ state, commit }, markerToRemove) {
      commit("setDialogLocation", false);
      fb.db.collection("markers").doc(markerToRemove.id).delete().then(() => {
          commit("setSnackbar", {
            color: "success",
            timeout: 3000,
            text: i18n.t("store.locationRemoved"),
          });
        }).catch((error) => {
          commit("setSnackbar", {
            color: "error",
            timeout: 3000,
            text: error,
          });
        });
    },
    getVersion({ commit, state }) {
      fb.db
        .collection("version")
        .doc("version")
        .onSnapshot((doc) => {
          console.log("version:", doc.data().version );
          if (doc.data().version !== state.version){
             commit("setSnackbar", {
              color: "primary",
              timeout: 10000,
              text: i18n.t("store.newVersionAvailable"),
              update: true,
            })
          }
        });
    },
    createItem({ state, commit, dispatch }, payload) {
      commit("setLoading", true);
      // if (!payload.event.target.files[0]) return commit("setLoading", false);

      let item = {
        createdAt: fb.firebase.firestore.Timestamp.now(),
        userUid: fb.firebase.auth().currentUser.uid,
      };
      fb.firebase
        .firestore()
        .collection(
          "selfies"
        )
        .add(item)
        .then(function(doc) {
          commit("setLoading", false);
          dispatch("uploadItem", {
            id: doc.id,
            image: payload.image,
          });
        })
        .catch(function(error) {
          console.log(error);
          commit("setSnackbar", {
            color: "error",
            timeout: 3000,
            text: error,
          });
          commit("setLoading", false);
        });
    },
    uploadItem({ state, commit, dispatch }, payload) {
      // File or Blob named mountains.jpg
      // var file = state.image;
      var file = payload.image;

      // Create the file metadata
      var metadata = {
        contentType: file.type,
      };
      var imageName = fb.firebase.auth().currentUser.uid + "_" + fb.firebase.firestore.Timestamp.now();
      var uploadTask = fb.firebase
        .storage()
        .ref(`/${payload.folder}`)
        .child(imageName)
        .putString(file, "data_url");

      uploadTask.on(
        "state_changed",
        function(snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case fb.firebase.storage.TaskState.PAUSED: // or 'paused'
              // console.log("Upload is paused");
              break;
            case fb.firebase.storage.TaskState.RUNNING: // or 'running'
              // console.log("Upload is running");
              break;
          }
        },
        function(error) {
          // Handle unsuccessful uploads
        },
        function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            let update = {};
            update[payload.field] = downloadURL
            dispatch("updateUser", update);
          });
        }
      );
    },
  },
  modules: {
  }
})
