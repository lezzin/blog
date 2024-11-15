import { createApp, h } from 'vue';
import App from './App.vue';
import router from './router/router';
import { Quasar } from 'quasar';

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp({ render: () => h(App) });

app.use(Quasar);
app.use(router);
app.mount('#app');