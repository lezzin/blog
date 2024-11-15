<script setup>
const emit = defineEmits(["close", "handler"]);

const props = defineProps({
    title: {
        type: String,
        required: true
    }
});

function handleSubmit() {
    emit('handler');
    emit('close');
}

</script>

<template>
    <div class="card-form" @submit.prevent="handleSubmit">
        <q-card tag="form">
            <q-card-section>
                <h4 class="q-my-sm">{{ props.title }}</h4>
            </q-card-section>

            <q-card-section class="q-gutter-sm">
                <slot name="body"></slot>
            </q-card-section>

            <q-card-section class="q-gutter-sm" align="right">
                <slot name="action"></slot>
                <q-btn flat icon="cancel" label="Cancelar" color="negative" @click="$emit('close')" />
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
