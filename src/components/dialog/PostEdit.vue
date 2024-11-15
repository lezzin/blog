<script setup>
import { computed, ref } from 'vue';

import { validateDescription, validateTitle } from '../../utils/validations';
import { notifyUser } from '../../utils/notification';
import { usePost } from '../../composables/usePost';

import BaseFormCard from '../base/BaseFormCard.vue';
import MarkdownEditor from '../shared/MarkdownEditor.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

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

const { edit } = usePost();

const id = ref(props.post.id);
const file = ref(null);
const title = ref(props.post.title);
const description = ref(props.post.description);
const content = ref(props.post.content);

async function editPost() {
    $q.loading.show({ message: 'Editando publicação...' });

    try {
        await edit(id.value, title.value, description.value, content.value, file.value);
        notifyUser('Publicação editada com sucesso!', 'success');
    } catch (error) {
        notifyUser(error.message, 'error');
    } finally {
        $q.loading.hide();
        props.onClose();
    }
}

function updateContent(newValue) {
    content.value += newValue;
}

const isDisabled = computed(() => (!content.value || !title.value || !description.value));
</script>

<template>
    <BaseFormCard title="Editar publicação" @handler="editPost" @close="props.onClose">
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
            <MarkdownEditor :content="content" @updateContent="updateContent" />
        </template>

        <template #action>
            <q-btn type="submit" color="primary" label="Editar" icon="edit" :disabled="isDisabled" />
        </template>
    </BaseFormCard>
</template>
