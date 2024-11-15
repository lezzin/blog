<script setup>
import { computed, ref } from 'vue';

import { validateDescription, validateTitle } from '../../utils/validations';
import { notifyUser } from '../../utils/notification';
import { usePost } from '../../composables/usePost';

import BaseFormCard from '../base/BaseFormCard.vue';

const props = defineProps({
    onClose: {
        type: Function,
        required: true
    },
    post: {
        type: Object,
        required: true
    }
})

const postComposable = usePost();

const id = ref(props.post.id);
const title = ref(props.post.title);
const description = ref(props.post.description);
const content = ref(props.post.content);

async function editPost() {
    try {
        await postComposable.edit(id.value, title.value, description.value, content.value);
        notifyUser('Publicação editada com sucesso!', 'success');
    } catch (error) {
        notifyUser(error.message, 'error');
    }
}

const isDisabled = computed(() => (!content.value || !title.value || !description.value));
</script>

<template>
    <BaseFormCard title="Adicionar nova publicação" @handler="editPost" @close="props.onClose">
        <template #body>
            <q-input v-model="title" filled hide-bottom-space label="Título" :rules="[validateTitle]" />
            <q-input v-model="description" filled hide-bottom-space label="Descrição" :rules="[validateDescription]" />
            <q-editor v-model="content" min-height="10rem" placeholder="Adicione aqui o conteúdo..." />
        </template>

        <template #action>
            <q-btn type="submit" color="primary" label="Editar" icon="edit" :disabled="isDisabled" />
        </template>
    </BaseFormCard>
</template>
