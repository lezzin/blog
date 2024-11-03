<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="not-found">
        <h1 class="not-found__title">Oops!</h1>
        <p class="not-found__text">404: Página não encontrada</p>
        <RouterLink to="/" class="not-found__link">Voltar para o início</RouterLink>
    </div>
</template>

<style scoped>
.not-found {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 55vh;
}

.not-found__title {
    font-size: 8rem;
    font-weight: normal;
}

.not-found__text {
    font-size: 3rem;
    margin-bottom: 3rem;
}

.not-found__link {
    color: #dd3b53;
}

.not-found__link:hover {
    color: #ad1e33;
}
</style>