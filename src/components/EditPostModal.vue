<script>
import { onMounted, ref, watch } from 'vue';
import { marked } from 'marked';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        editingPost: {
            type: Object,
            required: true
        },
        onSubmit: {
            type: Function,
            required: true
        },
        closeModal: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const content = ref(props.editingPost.content);
        const renderedContent = ref(marked(content.value));
        const isDragging = ref(false); 

        const storage = getStorage();

        const handleSubmit = () => {
            props.onSubmit({ ...props.editingPost, content: content.value });
            props.closeModal();
        };

        const handleDrop = async (event) => {
            event.preventDefault();
            isDragging.value = false; 
            const file = event.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                const imageUrl = await uploadImage(file);
                if (imageUrl) {
                    content.value += `![Descrição da imagem](${imageUrl})\n`;
                }
            }
        };

        const uploadImage = async (file) => {
            try {
                const storagePath = `images/${file.name}`;
                const fileRef = storageRef(storage, storagePath);
                await uploadBytes(fileRef, file);
                const downloadURL = await getDownloadURL(fileRef);
                return downloadURL;
            } catch (error) {
                console.error("Erro ao fazer upload da imagem:", error);
                return null;
            }
        };

        const handleDragOver = (event) => {
            event.preventDefault();
            isDragging.value = true; 
        };

        const handleDragLeave = () => {
            isDragging.value = false; 
        };

        watch(content, (newValue) => {
            renderedContent.value = marked(newValue);
        });

        onMounted(() => {
            renderedContent.value = marked(content.value);
        });

        return {
            content,
            renderedContent,
            handleSubmit,
            handleDrop,
            handleDragOver,
            handleDragLeave,
            isDragging
        };
    }
}
</script>

<template>
    <aside :class="['modal', isOpen && 'active']">
        <div class="modal__dialog" data-edit-post>
            <h3 class="modal__title">Editar postagem</h3>
            <div class="modal__body">
                <form class="form" @submit.prevent="handleSubmit">
                    <div class="form__group">
                        <label for="edit-title">Título</label>
                        <input type="text" id="edit-title" v-model="editingPost.title" placeholder="Título da postagem"
                            required autocomplete="off">
                    </div>

                    <div class="form__group">
                        <label for="edit-description">Descrição</label>
                        <input type="text" id="edit-description" v-model="editingPost.description"
                            placeholder="Descrição da postagem" required autocomplete="off">
                    </div>

                    <div class="form__group">
                        <label for="edit-content">Conteúdo (Markdown permitido)</label>
                        <span class="form__helper">
                            Para adicionar uma imagem, arraste-a para a área abaixo. <br>
                            Para URLs do Youtube, o vídeo será exibido em um iframe.
                        </span>

                        <textarea class="content-textarea" id="edit-content" placeholder="Conteúdo da postagem" v-model="content"
                            :class="{ 'dragging': isDragging }" @drop="handleDrop" @dragover="handleDragOver"
                            @dragleave="handleDragLeave">{{ content }}</textarea>

                        <label>Pré-visualização do Markdown</label>
                        <div v-html="renderedContent"></div>
                    </div>

                    <div class="form__footer">
                        <button type="submit" class="btn btn--success">
                            <i class="bi bi-check-lg"></i>
                            Confirmar edição
                        </button>

                        <button type="button" class="btn btn--out-danger" title="Fechar modal" @click="closeModal">
                            <i class="bi bi-x"></i>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </aside>
</template>