<template>
    <q-toolbar class="max-width max-width--sm bg-primary text-white q-py-sm">
        <q-avatar>
            <img src="/src/assets/img/profile.jpg">
        </q-avatar>

        <q-toolbar-title>
            <router-link to="/" class="text-white" style="text-decoration: none;">
                Wellyoza
            </router-link>
        </q-toolbar-title>

        <q-btn href="https://www.instagram.com/wellyngtoonsouza/" rel="noreferrer noopener" target="_blank" flat round
            icon="bi-instagram">
            <q-tooltip>Acessar Instagram</q-tooltip>
        </q-btn>

        <q-btn href="https://www.youtube.com/@Wellyoza" rel="noreferrer noopener" target="_blank" flat round
            icon="bi-youtube">
            <q-tooltip>Acessar Youtube</q-tooltip>
        </q-btn>

        <q-btn to="/admin" icon="bi-person-gear" flat label="Admin" />
    </q-toolbar>
</template>