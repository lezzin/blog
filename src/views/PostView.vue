<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { usePost } from '../composables/usePost';
import { notifyUser } from '../utils/notification';
import { PAGE_TITLES } from '../utils/variables';

const { getPost } = usePost();
const route = useRoute();

const post = ref({});

async function loadPost() {
    try {
        post.value = await getPost(route.params.id);
        document.title = PAGE_TITLES.post(post.value.title);
    } catch (error) {
        notifyUser(error.message, 'error');
    }
}

function sharePost() {
    if (!navigator.share) {
        notifyUser('Seu navegador não possui essa funcionalidade.', 'warning');
        return;
    }

    navigator.share({
        title: 'Olha esse artigo, que interessante!',
        text: post.value.description,
        url: window.location.href
    }).catch((error) => notifyUser(error.message, 'error'));
}

onMounted(loadPost);
</script>

<template>
    <q-page padding>
        <h3 class="text-h4 text-primary q-my-sm">{{ post.title }}</h3>
        <p class="text-body1">{{ post.description }}</p>
        <time class="text-body2 text-grey-9">Criado em {{ post.created_at }}</time>

        <q-separator class="q-mt-md q-mb-xl" />

        <div v-html="post.content"></div>

        <q-separator class="q-mt-md q-mb-xl" />

        <q-btn label="Compartilhar artigo" icon="share" color="primary" @click.stop="sharePost" />
    </q-page>
</template>
