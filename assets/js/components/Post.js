import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { PAGE_TITLES, FIRESTORE_COLLECTION } from "../utils/variables.js";

const Post = {
    template: "#post-template",
    props: ["db", "storage"],
    data() {
        return {
            post: {
                id: '',
                title: '',
                content: '',
                created_at: ''
            },
            loadingPost: true,
        };
    },
    mounted() {
        window.scrollTo({ top: 0 });

        const id = this.$route.params.id;
        this.fetchPost(id);
    },
    methods: {
        async fetchPost(postId) {
            try {
                const postDoc = doc(this.db, FIRESTORE_COLLECTION, postId);
                const docSnap = await getDoc(postDoc);

                if (docSnap.exists()) {
                    const { title, content, created_at } = docSnap.data();

                    this.post = {
                        id: docSnap.id,
                        title: title,
                        content: content,
                        created_at: created_at,
                    };

                    document.title = PAGE_TITLES.postagem(title);
                } else {
                    this.$router.push("/");
                }
            } catch (error) {
                console.error('Erro ao recuperar postagem: ', error);
                this.$root.toast = {
                    opened: true,
                    status: 'danger',
                    'message': 'Erro ao recuperar postagem. Verifique o console.'
                };
            } finally {
                this.loadingPost = false;
            }
        },
        renderMarkdown(markdown) {
            // Regex para resgatar URLs do Youtube
            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;

            markdown = markdown.replace(youtubeRegex, (_match, videoId) => {
                return `<iframe  src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
            });

            return marked.parse(markdown);
        },
        share() {
            const currentUrl = window.location.href;

            navigator.share({
                title: 'Blog de Wellyngton Souza',
                text: 'Compartilhar postagem do blog',
                url: currentUrl,
            });
        }
    },
    watch: {
        "$route.params.id": function (id) {
            this.fetchPost(id);
        }
    }
};

export default Post;
