<script>
import { provide, ref } from "vue";
import Toast from "./components/Toast.vue";

export default {
    components: {
        Toast
    },
    setup() {
        const toast = ref({
            opened: false,
            status: '',
            message: ''
        });

        const showToast = (status, message) => {
            toast.value.status = status;
            toast.value.message = message;
            toast.value.opened = true;

            setTimeout(() => {
                toast.value.opened = false;
            }, 3000);
        };

        provide("toast", toast);

        return {
            toast
        };
    }
};
</script>

<template>
    <header class="header">
        <div class="container">
            <RouterLink class="header__greetings" to="/">Blog</RouterLink>

            <nav class="header__nav">
                <a href="https://www.instagram.com/wellyngtoonsouza/" rel="noreferrer noopener" target="_blank">
                    <i class="bi bi-instagram"></i>
                </a>
                <a href="https://www.youtube.com/@Wellyoza" rel="noreferrer noopener" target="_blank">
                    <i class="bi bi-youtube"></i>
                </a>

                <RouterLink to="/admin">
                    <i class="bi bi-person-gear"></i>
                    <span>Admin</span>
                </RouterLink>
            </nav>
        </div>
    </header>

    <main>
        <div class="container">
            <RouterView></RouterView>
        </div>
    </main>

    <footer class="footer">
        <p>&copy; Desenvolvido por <a href="https://lezzin.github.io" target="_blank">Leandro Adrian</a> - 2024</p>
    </footer>

    <Toast :toast="toast" />
</template>

<style scoped>
.header {
    height: 10vh;
    background: #dd3b53;
    color: #fff;
    position: sticky;
    top: 0;
    border-bottom: 1px solid #e9e9e9;
}

.header .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;
    height: 100%;
}

.header__greetings {
    font-size: 2.4rem;
}

.header__nav {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header a {
    font-size: 2rem;
    transition: color 0.3s ease;
}

.header a:hover {
    color: #d9d9d9;
}

.header a:last-child {
    margin-left: 1rem;
}

.header a:last-child span {
    font-size: 1.5rem;
    margin-left: 0.5rem;
}
</style>