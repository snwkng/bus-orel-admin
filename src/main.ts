import './app/assets/tailwind.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueClickAway from "vue3-click-away";

import App from './app/App.vue';
import router from './app/router';

const app = createApp(App);

app.use(createPinia());
app.use(VueClickAway);
app.use(router);

app.mount('#app');
