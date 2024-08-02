import firebaseConfig from "./libs/firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import Home from "./components/Home.js";
import Post from "./components/Post.js";
import Admin from "./components/Admin.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

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
            storage: storage
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
];

const router = new VueRouter({
    routes
});

new Vue({ router }).$mount("#app");