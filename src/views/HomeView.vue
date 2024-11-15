<script setup>
import { onMounted } from 'vue';
import { usePost } from '../composables/usePost';
import { PAGE_TITLES } from '../utils/variables';
import { useQuasar } from 'quasar';
import { notifyUser } from '../utils/notification';

const { allPosts, getAllSnapshot } = usePost();
const $q = useQuasar();

onMounted(async () => {
    $q.loading.show();

    try {
        await getAllSnapshot();
        document.title = PAGE_TITLES.home;
    } catch (error) {
        notifyUser(error.message, 'error');
    } finally {
        $q.loading.hide();
    }
});
</script>

<template>
    <q-page padding>
        <div class="q-pb-lg">
            <h2 class="text-h3 q-mb-md text-weight-bold">Olá, sou Wellyngton Souza 👋</h2>
            <p class="text-h6">
                Aqui, você encontrará conteúdos acadêmicos de qualidade, dicas, tutoriais e discussões que vão
                ajudar a
                aprofundar seus conhecimentos e a desenvolver habilidades essenciais para sua carreira. Vamos juntos
                nessa
                jornada de aprendizado!
            </p>
        </div>

        <div v-if="allPosts.data.length > 0">
            <q-list bordered separator>
                <q-item v-for="post in allPosts.data" :key="post.id" clickable :to="`/post/${post.id}`" class="q-pa-md">
                    <div class="post-card">
                        <q-img :src="post.thumbnail" :ratio="1" class="rounded-borders" fit="cover" />

                        <div class="column">
                            <h3 class="text-h5 text-weight-bold text-primary q-mt-none">{{ post.title }}</h3>
                            <p class="text-body1 q-ma-none">{{ post.description }}</p>
                        </div>
                    </div>
                </q-item>
            </q-list>
        </div>

        <div v-else>
            <q-banner class="bg-grey-3">
                <template #avatar>
                    <q-icon name="info" color="grey-8" />
                </template>

                Nenhum conteúdo disponível no momento. Por favor, volte mais tarde!
            </q-banner>
        </div>
    </q-page>
</template>

<style scoped>
.post-card {
    display: grid;
    grid-template-columns: 250px auto;
    align-items: flex-start;
    gap: 16px;
}

@media (max-width: 768px) {
    .post-card {
        grid-template-columns: 1fr;
    }
}
</style>
