<script setup>
import { computed } from 'vue';

const year = computed(() => (new Date().getFullYear()));
</script>

<template>
    <p class="text-dark text-center">
        &copy;
        Desenvolvido por
        <a href="https://lezzin.github.io" target="_blank" class="text-primary">
            Lezzin
        </a>
        - {{ year }}
    </p>
</template>