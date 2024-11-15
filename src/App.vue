<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { DEFAULT_MAX_WIDTH } from './utils/variables';

import AppFooter from './components/layout/AppFooter.vue';
import AppHeader from './components/layout/AppHeader.vue';

const route = useRoute();
const screenWidth = ref(DEFAULT_MAX_WIDTH);

watch(() => route.meta.screenWidth, (newScreenWidth) => {
    screenWidth.value = newScreenWidth || DEFAULT_MAX_WIDTH;
}, { immediate: true });
</script>

<template>
    <q-layout view="hHh lpR lff">
        <q-header>
            <AppHeader class="max-width" :style="`max-width: ${screenWidth}px`" />
        </q-header>

        <q-page-container class="max-width" :style="`max-width: ${screenWidth}px`">
            <router-view />
        </q-page-container>

        <q-footer class="bg-white q-pt-xl">
            <AppFooter />
        </q-footer>
    </q-layout>
</template>

<style lang="sass">
.max-width 
    width: 90%
    margin: 0 auto
</style>
