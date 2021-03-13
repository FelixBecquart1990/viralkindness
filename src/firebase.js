import Vue from "vue";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/storage";

// firebase init
const config = {
//add Firebase config here
};
firebase.initializeApp(config);

firebase.analytics();
Vue.prototype.$analytics = firebase.analytics();

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth, firebase };
