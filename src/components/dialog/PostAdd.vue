<script setup>
import { computed, ref } from 'vue';

import { validateDescription, validateTitle } from '../../utils/validations';
import { notifyUser } from '../../utils/notification';

import BaseFormCard from '../base/BaseFormCard.vue';
import { usePost } from '../../composables/usePost';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const props = defineProps({
    onClose: {
        type: Function,
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

const { add } = usePost();

const title = ref('');
const description = ref('');
const content = ref('');

async function addPost() {
    try {
        await add(title.value, description.value, content.value);
        notifyUser('Publicação adicionada com sucesso!', 'success');
    } catch (error) {
        notifyUser(error.message, 'success');
    }
};

const isDisabled = computed(() => (!content.value || !title.value || !description.value));

</script>

<template>
    <BaseFormCard title="Adicionar nova publicação" @handler="addPost" @close="props.onClose">
        <template #body>
            <q-input v-model="title" filled hide-bottom-space label="Título" :rules="[validateTitle]" />
            <q-input v-model="description" filled hide-bottom-space label="Descrição" :rules="[validateDescription]" />
            <q-editor :toolbar="editorTools" v-model="content" min-height="10rem"
                placeholder="Adicione aqui o conteúdo..." />
        </template>

        <template #action>
            <q-btn type="submit" color="primary" label="Adicionar" icon="add" :disabled="isDisabled" />
        </template>
    </BaseFormCard>
</template>
