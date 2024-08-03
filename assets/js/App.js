import firebaseConfig from "./libs/firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import Home from "./components/Home.js";
import Post from "./components/Post.js";
import Admin from "./components/Admin.js";
import NotFound from "./components/NotFound.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

getAnalytics(app);

const routes = [
    {
        path: "/",
        component: Home,
        props: {
            db: db,
            storage: storage
        }
    },
    {
        path: "/admin",
        component: Admin,
        props: {
            db: db,
            storage: storage,
            auth: auth
        }
    },
    {
        path: "/post/:id",
        component: Post,
        props: {
            db: db,
            storage: storage
        }
    },
    {
        path: "/*",
        component: NotFound
    }
];

const router = new VueRouter({
    routes
});

new Vue({
    router,
    data() {
        return {
            toast: {
                opened: false,
                status: '',
                message: ''
            },
        }
    },
    watch: {
        "toast": function () {
            clearTimeout(this.toastTimeout);

            this.toastTimeout = setTimeout(() => {
                this.toast = { opened: false, status: '', message: '' }
            }, 5000);
        }
    }
}).$mount("#app");