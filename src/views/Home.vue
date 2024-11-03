<script>
import { onMounted, ref } from 'vue';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import { FIRESTORE_COLLECTION } from '../utils/variables';
import Loader from '../components/Loader.vue';

export default {
    components: {
        Loader
    },
    setup() {
        const loadingPosts = ref(false);
        const posts = ref([]);

        const fetchPosts = async () => {
            loadingPosts.value = true;

            try {
                const querySnapshot = await getDocs(collection(db, FIRESTORE_COLLECTION));
                posts.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.log(error);
            } finally {
                loadingPosts.value = false;
            }
        }

        onMounted(() => {
            fetchPosts();
        });

        return {
            loadingPosts,
            posts
        }
    }
}
</script>

<template>
    <div class="presentation">
        <h2 class="presentation__title">Olá, sou Wellyngton Souza 👋</h2>
        <div class="presentation__texts">
            <p>
                Aqui, você encontrará conteúdos acadêmicos de qualidade, dicas, tutoriais e discussões que vão
                ajudar a aprofundar seus conhecimentos e a desenvolver habilidades essenciais para sua carreira.
                Vamos juntos nessa jornada de aprendizado!
            </p>
        </div>
    </div>


    <Loader v-if="loadingPosts" />
    <div v-else>
        <nav class="preview" v-if="posts.length > 0">
            <RouterLink v-for="post in posts" class="post post--hover" :to="'post/' + post.id">
                <h2 class="post__title">{{ post.title }}</h2>
                <p class="post__description">{{ post.description }}</p>
                <p class="post__date">Publicado em: {{ post.created_at }}</p>
            </RouterLink>
        </nav>

        <p class="alert" v-else>
            Oops! Ainda não há nenhuma postagem. Volte mais tarde.
        </p>
    </div>
</template>

<style scoped>
.presentation {
    display: grid;
    margin-bottom: 5rem;
}

.presentation__title {
    font-size: 3.6rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.presentation__texts {
    display: grid;
    gap: 1rem;
    font-size: 1.8rem;
    color: #4d4d4d;
}
</style>