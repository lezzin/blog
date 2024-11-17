<script setup>
import { inject } from "vue";

const { show, message, callback } = inject('confirmAction');

function handleConfirm() {
    if (callback.value) {
        callback.value();
    }

    show.value = false;
}
</script>

<template>
    <q-card>
        <q-card-section class="row items-center">
            <q-avatar icon="warning" color="primary" text-color="white" />
            <span class="q-ml-sm">{{ message }}</span>
        </q-card-section>

        <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn label="Confirmar" color="primary" @click="handleConfirm" />
        </q-card-actions>
    </q-card>
</template>