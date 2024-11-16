<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { usePost } from '../../composables/usePost';
import { notifyUser } from '../../utils/notification';

const { uploadImage, getImageUrl, markImageAsTemporary } = usePost();
const $q = useQuasar();

const emit = defineEmits(['updateContent', 'loadingContent']);
const props = defineProps({
    content: {
        type: String,
        required: true
    }
});

const content = ref(props.content);

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

async function handleDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const droppedFile = evt.dataTransfer.files[0];
    if (!droppedFile || !droppedFile.type.startsWith('image/')) {
        notifyUser('Por favor, solte um arquivo de imagem válido.', 'warning');
        return;
    }

    emit('loadingContent', true);

    try {
        const storagePath = await uploadImage(droppedFile);
        markImageAsTemporary(storagePath);

        const imageUrl = await getImageUrl(storagePath);

        content.value += `\n![Imagem](${imageUrl})\n`;
        emit('updateContent', content.value);

        notifyUser('Imagem enviada com sucesso!', 'success');
    } catch (error) {
        notifyUser(`Erro ao enviar imagem: ${error.message}`, 'negative');
    } finally {
        emit('loadingContent', false);
    }
}
</script>

<template>
    <q-editor :toolbar="editorTools" v-model="content" min-height="10rem" placeholder="Digite aqui o conteúdo..."
        @drop="handleDrop" @input="$emit('updateContent', content)" max-height="30vh" />
</template>