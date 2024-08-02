import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js";

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
            markdown: null
        };
    },
    methods: {
        async fetchPost(postId) {
            try {
                const postDoc = doc(this.db, 'posts', postId);
                const docSnap = await getDoc(postDoc);

                if (docSnap.exists()) {
                    this.post = {
                        id: docSnap.id,
                        title: docSnap.data().title,
                        content: docSnap.data().content,
                    };
                    document.title = `Blog | ${this.post.title}`;
                } else {
                    console.error('Post não encontrado');
                }
            } catch (error) {
                console.error('Erro ao recuperar post:', error);
            }
        },
        renderMarkdown(markdown) {
            return this.markdown.markdown(markdown);
        },
        share() {
            const currentUrl = window.location.href;

            navigator.share({
                title: 'Blog de Wellyngton Souza',
                text: 'Compartilhar postagem do blog',
                url: currentUrl,
            }).catch(error => console.error('Erro ao compartilhar:', error));
        }
    },
    mounted() {
        const id = this.$route.params.id;
        window.scrollTo({ top: 0 });

        this.markdown = new SimpleMDE({ element: document.getElementById("content") });
        this.fetchPost(id);
    },
};

export default Post;
