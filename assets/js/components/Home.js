import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { FIRESTORE_COLLECTION, PAGE_TITLES } from "../utils/variables.js";
import "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js";
import { fetchPosts } from "../services/post.js";

const Home = {
    template: "#home-template",
    props: ["db", "storage"],
    data() {
        return {
            posts: [],
            loadingPosts: true
        }
    },
    mounted: function () {
        document.title = PAGE_TITLES.home;
        window.scrollTo({ top: 0 });

        this.fetchPosts();
    },
    methods: {
        async fetchPosts() {
            this.loadingPosts = true;

            try {
                this.posts = await fetchPosts(this.db);
            } catch (error) {
                this.handleDataError('recuperar postagens', error);
            } finally {
                this.loadingPosts = false;
            }
        },
        handleDataError(action, error) {
            console.error(`Erro ao ${action}: `, error);
            this.$root.toast = {
                opened: true,
                status: 'danger',
                message: `Erro ao ${action}. Verifique o console.`
            };
        },
    }
}

export default Home;