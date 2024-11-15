<script setup>
import { computed, ref } from 'vue';

import { validateDescription, validateTitle } from '../../utils/validations';
import { notifyUser } from '../../utils/notification';
import { usePost } from '../../composables/usePost';

import BaseFormCard from '../base/BaseFormCard.vue';
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

const editorTools = [
    ['left', 'center', 'right', 'justify'],
    ['bold', 'italic', 'underline', 'strike'],
    ['undo', 'redo'],
    [
        {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
                'size-1',
                'size-2',
                'size-3',
                'size-4',
                'size-5',
                'size-6',
                'size-7'
            ]
        }
    ]
];

const postComposable = usePost();

const id = ref(props.post.id);
const file = ref(null);
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
            <q-editor :toolbar="editorTools" v-model="content" min-height="10rem"
                placeholder="Digite aqui o conteúdo..." />
        </template>

        <template #action>
            <q-btn type="submit" color="primary" label="Editar" icon="edit" :disabled="isDisabled" />
        </template>
    </BaseFormCard>
</template>
