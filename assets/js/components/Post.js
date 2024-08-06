import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { fetchPost } from "../services/post.js";

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
                const post = await fetchPost(this.db, postId);

                if (!post) {
                    this.$router.push("/");
                    return;
                }

                this.post = post;
            } catch (error) {
                this.handleDataError('recuperar postagem', error);
            } finally {
                this.loadingPost = false;
            }
        },
        renderMarkdown(markdown) {
            // Regex para resgatar URLs do Youtube
            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;

            markdown = markdown.replace(youtubeRegex, (_, videoId) => {
                return `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
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
        },
        handleDataError(action, error) {
            console.error(`Erro ao ${action}: `, error);
            this.$root.toast = {
                opened: true,
                status: 'danger',
                message: `Erro ao ${action}. Verifique o console.`
            };
        },
    },
    watch: {
        "$route.params.id": function (id) {
            this.fetchPost(id);
        }
    }
};

export default Post;
