<script setup>
import { usePost } from '../../composables/usePost';

const emit = defineEmits(["close", "handler"]);

const props = defineProps({
    title: {
        type: String,
        required: true
    }
});

const { clearTemporaryImages } = usePost();

async function handleClose() {
    await clearTemporaryImages();
    emit('close');
}
</script>

<template>
    <div class="card-form" @submit.prevent="$emit('handler');">
        <q-card tag="form">
            <q-card-section>
                <h4 class="q-my-sm">{{ props.title }}</h4>
            </q-card-section>

            <q-card-section class="q-gutter-sm">
                <slot name="body"></slot>
            </q-card-section>

            <q-card-section class="q-gutter-sm" align="right">
                <slot name="action"></slot>
                <q-btn type="button" flat icon="cancel" label="Cancelar" color="negative" @click="handleClose" />
            </q-card-section>
        </q-card>
    </div>
</template>

<style scoped>
.card-form {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
}
</style>
