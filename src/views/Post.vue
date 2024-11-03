<script>
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FIRESTORE_COLLECTION, PAGE_TITLES } from '../utils/variables';
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import renderer from '../utils/markdownRenderer'
import { marked } from 'marked';
import Loader from '../components/Loader.vue';

export default {
    components: {
        Loader
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const loadingPost = ref(false);
        const post = ref(null);

        const fetchPost = async () => {
            loadingPost.value = true;

            const postDoc = doc(db, FIRESTORE_COLLECTION, route.params.id);
            const docSnap = await getDoc(postDoc);

            if (!docSnap.exists()) {
                router.push("/");
                loadingPost.value = false;
                return;
            }

            const { title, content, created_at } = docSnap.data();
            document.title = PAGE_TITLES.post(title);

            loadingPost.value = false;

            post.value = {
                id: docSnap.id,
                title: title,
                content: content,
                created_at: created_at,
            };
        };

        const renderedContent = computed(() => {
            return post.value ? marked(post.value.content, { renderer }) : '';
        });

        onMounted(() => {
            fetchPost();
        });

        return {
            loadingPost,
            post,
            renderedContent
        }
    }
}
</script>

<template>
    <Loader v-if="loadingPost" />
    <section class="view" v-else-if="post">
        <div class="view__header">
            <h2 class="view__title">{{ post.title }} </h2>

            <div class="view__header__footer">
                <p class="view__date">Publicado em: {{ post.created_at }}</p>
                <a href="javascript:history.back()" class="btn btn--back">
                    <i class="bi bi-arrow-left"></i>
                    Voltar
                </a>
            </div>
        </div>

        <div class="view__content" v-html="renderedContent"></div>

        <div class="view__footer">
            <h4 class="view__footer__title">Gostou do conteúdo?</h4>

            <div class="view__footer__content">
                <p>Me siga em minhas redes sociais e compartilhe com seus amigos!</p>

                <div class="btn-group">
                    <a href="https://www.instagram.com/wellyngtoonsouza/" rel="noreferrer noopener" target="_blank"
                        class="btn btn--out-primary" role="button">
                        <i class="bi bi-instagram"></i>
                    </a>

                    <a href="https://www.youtube.com/@Wellyoza" rel="noreferrer noopener" target="_blank"
                        class="btn btn--out-primary" role="button">
                        <i class="bi bi-youtube"></i>
                    </a>

                    <button type="button" class="btn btn--primary" @click="share" title="Compartilhar postagem">
                        <i class="bi bi-share"></i> Compartilhar
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.view {
    display: grid;
    gap: 2rem;
}

.view__title {
    font-size: 3.2rem;
    font-weight: 600;
}

.view__header__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
}

.view__date {
    font-size: 1.2rem;
    color: #666666;
}

.view__footer {
    border-top: 2px solid #e9e9e9;
    margin-top: 2rem;
    padding-top: 2rem;
    font-size: 1.6rem;
}

.view__footer__title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.view__footer__content p {
    margin-bottom: 0.3rem;
}

.view__footer__content .btn-group {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.view__footer__content .btn {
    font-size: 1.4rem;
    padding: 0.5rem 1rem;
}

.view__content {
    display: grid;
    gap: 2rem;
    font-size: 1.6rem;
}

.view__content img,
.view__content iframe {
    border: 1px solid #e9e9e9;
    width: 100%;
    aspect-ratio: 16/9;
    margin: 0 auto;
    -o-object-fit: cover;
    object-fit: cover;
}

.view__content ul,
.view__content ol {
    margin-left: 4rem;
}

.view__content h1 {
    font-size: 2.8rem;
}

.view__content h2 {
    font-size: 2.4rem;
}

.view__content h3 {
    font-size: 2rem;
}

.view__content a {
    color: #dd3b53;
}

.view__content a:hover {
    color: #ad1e33;
}
</style>