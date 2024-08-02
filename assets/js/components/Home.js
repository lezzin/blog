import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { FIRESTORE_COLLECTION, PAGE_TITLES } from "../utils/variables.js";
import "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js";

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
            try {
                const querySnapshot = await getDocs(collection(this.db, FIRESTORE_COLLECTION));
                this.posts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title,
                    description: doc.data().description,
                    created_at: doc.data().created_at,
                }));
            } catch (error) {
                console.error('Erro ao recuperar postagens: ', error);
                this.$root.toast = {
                    opened: true,
                    status: 'danger',
                    message: 'Erro ao recuperar postagens. Verifique o console.'
                }
            } finally {
                this.loadingPosts = false;
            }
        },
    }
}

export default Home;