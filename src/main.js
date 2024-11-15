import { createApp, h } from 'vue';
import { Loading, Notify, Quasar } from 'quasar';

import App from './App.vue';
import router from './router/router';

import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css'
import 'quasar/src/css/index.sass';

const app = createApp({ render: () => h(App) });

app.use(Quasar, {
    plugins: {
        Loading,
        Notify
    }
});
app.use(router);
app.mount('#app');