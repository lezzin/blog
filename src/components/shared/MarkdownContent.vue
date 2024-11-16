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
    <div id="markdown" v-html="markdown"></div>
</template>

<style>
#markdown img {
    max-width: 100%;
    height: auto;
    vertical-align: middle;
}
</style>