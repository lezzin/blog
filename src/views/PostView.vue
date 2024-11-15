<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { usePost } from '../composables/usePost';
import { notifyUser } from '../utils/notification';
import { PAGE_TITLES } from '../utils/variables';
import { useQuasar } from 'quasar';
import MarkdownContent from '../components/shared/MarkdownContent.vue';

const { getPost } = usePost();
const route = useRoute();
const $q = useQuasar();

const post = ref(null);

async function loadPost() {
    $q.loading.show();

    try {
        const fetchedPost = await getPost(route.params.id);
        post.value = fetchedPost;
        document.title = PAGE_TITLES.post(fetchedPost.title);
    } catch (error) {
        notifyUser(error.message, 'error');
    } finally {
        $q.loading.hide();
    }
}

function sharePost() {
    if (!navigator.share) {
        notifyUser('Seu navegador não possui essa funcionalidade.', 'warning');
        return;
    }

    navigator.share({
        title: 'Olha esse artigo, que interessante!',
        text: post.value?.description,
        url: window.location.href
    }).catch((error) => notifyUser(error.message, 'error'));
}

onMounted(async () => {
    await loadPost();
});
</script>

<template>
    <q-page padding>
        <q-breadcrumbs>
            <q-breadcrumbs-el label="Início" to="/" />
            <q-breadcrumbs-el label="Publicação" />
        </q-breadcrumbs>

        <div v-if="post">
            <h3 class="text-h4 text-weight-bold text-primary q-mb-sm">{{ post.title }}</h3>
            <p class="text-subtitle1">{{ post.description }}</p>
            <q-img :src="post.thumbnail" class="rounded-borders" fit="cover" :ratio="16 / 9" />
            <p class="q-pt-sm text-body2 text-grey-9"><time> Criado em {{ post.created_at }}</time></p>

            <q-separator class="q-mt-md q-mb-xl" />

            <MarkdownContent :post="post" />

            <q-separator class="q-mt-md q-mb-xl" />

            <q-btn label="Compartilhar artigo" icon="share" color="primary" @click.stop="sharePost" />
        </div>
        <div v-else>
            <q-spinner color="primary" size="3em" />
        </div>
    </q-page>
</template>
