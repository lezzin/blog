<script setup>
import AppFooter from './components/layout/AppFooter.vue';
import AppHeader from './components/layout/AppHeader.vue';
</script>

<template>
    <q-layout view="hHh lpR lff">
        <q-header>
            <AppHeader class="max-width" />
        </q-header>

        <q-page-container class="max-width">
            <router-view />
        </q-page-container>

        <q-footer class="bg-white">
            <AppFooter />
        </q-footer>
    </q-layout>
</template>

<style lang="sass">
.max-width 
    width: 90%
    max-width: 1080px
    margin: 0 auto
</style>