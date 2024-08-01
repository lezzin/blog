import Home from "./components/Home.js";
import Post from "./components/Post.js";
import Admin from "./components/Admin.js";

const routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/admin",
        component: Admin,
    },
    {
        path: "/post/:id",
        component: Post,
    },
];

const router = new VueRouter({
    routes
});

new Vue({ router }).$mount("#app");