import '@babel/polyfill'
import 'mutationobserver-shim'
/*!

 =========================================================
 * Vue Light Bootstrap Dashboard - v2.0.0 (Bootstrap 4)
 =========================================================

 * Product Page: http://www.creative-tim.com/product/light-bootstrap-dashboard
 * Copyright 2019 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */
import Vue from 'vue'
import './plugins/bootstrap-vue'
import VueRouter from 'vue-router'
import App from './App.vue'

// Keycloak for authorization
import VueKeycloakJs from "@dsb-norge/vue-keycloak-js";
import '@trevoreyre/autocomplete-vue/dist/style.css'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

// Api consumer
import axios from "axios";
import VueAxios from "vue-axios";

// router setup
import routes from './routes/routes'
// Toast notifications
import Toasted from 'vue-toasted';

Vue.use(Toasted)

import './registerServiceWorker'
// plugin setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)

Vue.use(VueAxios, axios);

Vue.axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  console.log(error.response);
  Vue.toasted.error(error.response.data).goAway(3000);
  return Promise.reject(error);
}
);

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  mode: "history",
  linkActiveClass: 'nav-item active'
})

// -----------------------------
// Auth for PROD
Vue.axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (Vue.prototype.$keycloak.authenticated) {
      next()
    } else {
      const loginUrl = Vue.prototype.$keycloak.createLoginUrl()
      window.location.replace(loginUrl)
    }
  } else {
    next()
  }
  window.scrollTo(0, 0);
})

Vue.use(VueKeycloakJs, {
  config: {
    url: process.env.VUE_APP_KEYCLOAK_BASE + "/auth",
    clientId: "cloud-surfer",
    realm: "cloud-surfer"
  },
  onReady: () => {
    new Vue({
      el: '#app',
      render: h => h(App),
      router
    })

  }
})

// --------------------------------------------------------
// No auth for local tests
// router.beforeEach((to, from, next) => {
//   next();
//   window.scrollTo(0, 0);
// })

// new Vue({
//   el: '#app',
//   render: h => h(App),
//   router
// });