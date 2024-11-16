<script setup>
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';

import { validateDescription, validateTitle } from '../../utils/validations';
import { notifyUser } from '../../utils/notification';

import { usePost } from '../../composables/usePost';

import BaseFormCard from '../base/BaseFormCard.vue';
import MarkdownEditor from '../shared/MarkdownEditor.vue';

const $q = useQuasar();

const props = defineProps({
    onClose: {
        type: Function,
        required: true
    }
});

const { add } = usePost();

const isLoading = ref(false);
const file = ref(null);
const title = ref('');
const description = ref('');
const content = ref('');

async function addPost() {
    $q.loading.show({ message: 'Adicionando publicação...' });

    try {
        await add(title.value, description.value, content.value, file.value);
        notifyUser('Publicação adicionada com sucesso!', 'success');
    } catch (error) {
        notifyUser(error.message, 'negative');
    } finally {
        $q.loading.hide();
        props.onClose();
    }
}

function updateContent(newValue) {
    content.value = newValue;
}

function updateLoading(newValue) {
    isLoading.value = newValue;
}

const isDisabled = computed(() => (!content.value || !title.value || !description.value || isLoading.value));
</script>

<template>
    <BaseFormCard title="Adicionar nova publicação" @handler="addPost" @close="props.onClose">
        <template #body>
            <q-file filled bottom-slots v-model="file" label="Thumbnail" accept="image/*" counter>
                <template v-slot:prepend>
                    <q-icon name="cloud_upload" @click.stop.prevent />
                </template>
                <template v-slot:append>
                    <q-icon name="close" @click.stop.prevent="file = null" class="cursor-pointer" />
                </template>
            </q-file>

            <q-input v-model="title" filled hide-bottom-space label="Título" :rules="[validateTitle]" />
            <q-input v-model="description" filled hide-bottom-space label="Descrição" :rules="[validateDescription]" />

            <MarkdownEditor :content="content" @updateContent="updateContent" @loadingContent="updateLoading" />
        </template>

        <template #action>
            <q-btn type="submit" color="primary" label="Adicionar" icon="add" :disabled="isDisabled" />
        </template>
    </BaseFormCard>
</template>
