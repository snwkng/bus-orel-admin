import './app/assets/tailwind.css';

import { createApp } from 'vue';
import { configure } from 'vee-validate';
import { createPinia } from 'pinia';
import VueClickAway from "vue3-click-away";

import App from './app/App.vue';
import router from './app/router';
import BaseToast from './shared/ui/toasts/BaseToast.vue';

const app = createApp(App);

configure({
  validateOnBlur: true,
  validateOnChange: true,  
  validateOnInput: false,
  validateOnModelUpdate: true,
});

// app.config.globalProperties.$api = fetchApi;

app.use(createPinia());
app.use(VueClickAway);
app.use(router);
app.provide('toast', BaseToast)

app.mount('#app');
