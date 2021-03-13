import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import i18n from './i18n'

const fb = require("./firebase.js");

Vue.config.productionTip = false

let app;

fb.auth.onAuthStateChanged((user) => {
  if (!user) {
    store.dispatch("createAnonymousUser");
  } else if (user) {
    // store.dispatch("getMarkers");
    store.dispatch("getUser");
    store.dispatch("getVersion");
  }
  if (!app && user) {
    app = new Vue({
      router,
      store,
      vuetify,
      i18n,
      render: h => h(App)
    }).$mount('#app')
  }
})
