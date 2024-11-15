import { createRouter, createWebHistory } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { DEFAULT_MAX_WIDTH } from "../utils/variables";

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            auth,
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
};

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("../views/HomeView.vue"),
            meta: {
                requiresAuth: false,
                screenWidth: DEFAULT_MAX_WIDTH
            }
        },
        {
            path: "/admin",
            component: () => import("../views/AdminView.vue"),
            meta: {
                requiresAuth: true,
                screenWidth: 1080
            }
        },
        {
            path: "/login",
            component: () => import("../views/LoginView.vue"),
            meta: {
                requiresAuth: false,
                screenWidth: 1080
            }
        },
        {
            path: "/post/:id",
            component: () => import("../views/PostView.vue"),
            meta: {
                requiresAuth: false,
                screenWidth: DEFAULT_MAX_WIDTH
            }
        },
        {
            path: '/:catchAll(.*)',
            component: () => import("../views/NotFoundView.vue")
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const currentUser = await getCurrentUser();

    if (requiresAuth && !currentUser) {
        next("/login");
    } else {
        next();
    }
});

export default router;