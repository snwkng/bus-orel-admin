import './app/assets/tailwind.css';

import { createApp } from 'vue';
import { configure } from 'vee-validate';
import { createPinia } from 'pinia';
import VueClickAway from "vue3-click-away";

import App from './app/App.vue';
import router from './app/router';

const app = createApp(App);

configure({
  validateOnBlur: true,
  validateOnChange: true,  
  validateOnInput: false,
  validateOnModelUpdate: true,
});

app.use(createPinia());
app.use(VueClickAway);
app.use(router);

app.mount('#app');
