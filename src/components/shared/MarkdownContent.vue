<script setup>
import { ref, watch } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
});

const markdown = ref('');

watch(
    () => props.post.content,
    (newContent) => {
        if (newContent) {
            markdown.value = DOMPurify.sanitize(marked(newContent));
        }
    },
    { immediate: true }
);
</script>

<template>
    <div v-html="markdown" class="markdown-content"></div>
</template>

<style scoped>
.markdown-content img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1rem 0;
}

.markdown-content p {
    margin: 0.5rem 0;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
    margin: 1rem 0 0.5rem;
    font-weight: bold;
}
</style>
