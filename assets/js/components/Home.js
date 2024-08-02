import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js";

const Home = {
    template: "#home-template",
    props: ["db", "storage"],
    data() {
        return {
            posts: [],
        }
    },
    methods: {
        async fetchPosts() {
            try {
                const querySnapshot = await getDocs(collection(this.db, 'posts'));
                this.posts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title,
                    description: doc.data().description,
                }));
            } catch (error) {
                console.error('Erro ao recuperar postagens:', error);
            }
        },
    },
    mounted: function () {
        document.title = "Blog";
        window.scrollTo({ top: 0 });
        this.fetchPosts();
    }
}

export default Home;