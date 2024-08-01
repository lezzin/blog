import Home from "./components/Home.js";
import Post from "./components/Post.js";

const routes = [
    {
        path: "/",
        component: Home,
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