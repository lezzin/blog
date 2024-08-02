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
                content: ''
            },
            loadingPost: true,
        };
    },
    mounted() {
        this.$root.showBackButton = true;
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
                    this.post = {
                        id: docSnap.id,
                        title: docSnap.data().title,
                        content: docSnap.data().content,
                    };

                    document.title = PAGE_TITLES.postagem(this.post.title);
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
        "$route.params.id": function(id) {
            this.fetchPost(id);
        }
    }
};

export default Post;
