import './app/assets/tailwind.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueClickAway from "vue3-click-away";
import { defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';

import App from './app/App.vue';
import router from './app/router';

defineRule('required', required);

const app = createApp(App);

app.use(createPinia());
app.use(VueClickAway);
app.use(router);

app.mount('#app');
