<script setup>
import { onMounted } from 'vue';
import { usePost } from '../composables/usePost';
import { PAGE_TITLES } from '../utils/variables';

const { allPosts, getAllSnapshot } = usePost();

onMounted(() => {
    getAllSnapshot();
    document.title = PAGE_TITLES.home;
});
</script>

<template>
    <q-page padding>
        <div class="q-pb-lg">
            <h2 class="text-h3 q-mb-md">Olá, sou Wellyngton Souza 👋</h2>
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
                <q-item v-for="post in allPosts.data" :key="post.id" clickable :to="`/post/${post.id}`">
                    <q-item-section>
                        <h3 class="text-h5 text-primary q-my-sm">{{ post.title }}</h3>
                        <p class="text-body2">{{ post.description }}</p>
                    </q-item-section>
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
