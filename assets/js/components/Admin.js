import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { FIRESTORE_COLLECTION, PAGE_TITLES } from "../utils/variables.js";
import "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js";

const Admin = {
    template: "#admin-template",
    props: ["db", "storage"],
    data() {
        return {
            modalAddOpened: false,
            modalEditOpened: false,
            addFormMessages: {
                title: '',
                description: '',
                content: '',
            },
            addingPost: {
                title: '',
                description: '',
            },
            editingPost: {
                id: '',
                title: '',
                description: '',
            },
            posts: [],
            markdown: {
                add: null,
                edit: null
            },
            loadingPosts: false,
            user: {
                email: '',
                password: '',
                loggedIn: false
            }
        };
    },
    mounted() {
        document.title = PAGE_TITLES.admin;
        window.scrollTo({ top: 0 });

        onAuthStateChanged(getAuth(), user => {
            if (user) {
                this.user.loggedIn = true;
                this.init();
            } else {
                this.user.loggedIn = false;
            }
        });
    },
    methods: {
        async login() {
            const auth = getAuth();
            try {
                await signInWithEmailAndPassword(auth, this.user.email, this.user.password);
                this.user.loggedIn = true;
                this.user.email = '';
                this.user.password = '';
                this.init();
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                let errorMessage = 'Erro ao fazer login.';


                switch (error.code) {
                    case 'auth/invalid-credential':
                        errorMessage = 'Credenciais inválidas.';
                        break;
                    default:
                        errorMessage = 'Ocorreu um erro ao fazer login. Verifique o console.';
                        break;
                }

                this.$root.toast = {
                    opened: true,
                    status: 'danger',
                    message: errorMessage
                };
            }
        },
        async logout() {
            const auth = getAuth();
            try {
                await signOut(auth);
                this.user = { email: '', password: '', loggedIn: false };
                this.$router.push("/");
            } catch (error) {
                console.error('Erro ao fazer logout:', error);
                this.$root.toast = {
                    opened: true,
                    status: 'danger',
                    message: 'Erro ao fazer logout. Verifique o console.'
                };
            }
        },
        init() {
            this.initializeMarkdownEditors();
            this.fetchPosts();
        },
        openAddModal() {
            this.modalAddOpened = true;
        },
        closeAddModal() {
            this.modalAddOpened = false;
        },
        openEditModal(post) {
            this.editingPost = { ...post };
            this.markdown.edit.value(post.content);
            this.modalEditOpened = true;
        },
        closeEditModal() {
            this.modalEditOpened = false;
        },
        async addPost() {
            if (this.addingPost.title.length > 50) {
                this.addFormMessages.title = "O título deve conter no máximo 50 caracteres";
                return;
            }

            if (this.addingPost.description.length > 150) {
                this.addFormMessages.description = "A descrição deve conter no máximo 150 caracteres";
                return;
            }

            if (this.markdown.add.value() === '') {
                this.addFormMessages.content = "Preencha o conteúdo da postagem";
                return;
            }

            try {
                const currentTime = new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                });

                await addDoc(collection(this.db, FIRESTORE_COLLECTION), {
                    title: this.addingPost.title,
                    description: this.addingPost.description,
                    content: this.markdown.add.value(),
                    created_at: currentTime
                });

                this.resetAddPostForm();
                this.fetchPosts();

                this.$root.toast = {
                    opened: true,
                    status: 'success',
                    message: 'Postagem adicionada com sucesso!'
                };
            } catch (error) {
                console.error('Erro ao adicionar postagem: ', error);
                this.$root.toast = {
                    opened: true,
                    status: 'danger',
                    message: 'Erro ao adicionar postagem. Verifique o console.'
                };
            }
        },
        async editPost() {
            try {
                const { id, title, description } = this.editingPost;
                const newContent = this.markdown.edit.value();
                const postDoc = doc(this.db, FIRESTORE_COLLECTION, id);
                const oldPost = this.posts.find(post => post.id === id);

                const oldImageUrls = this.extractImageUrls(oldPost.content);
                const newImageUrls = this.extractImageUrls(newContent);

                const imagesToRemove = oldImageUrls.filter(url => !newImageUrls.includes(url));
                await this.deleteImagesFromStorage(imagesToRemove);

                await updateDoc(postDoc, {
                    title,
                    description,
                    content: newContent
                });

                this.posts = this.posts.map(post =>
                    post.id === id ? { ...post, title, description, content: newContent } : post
                );

                this.resetEditPostForm();

                this.$root.toast = {
                    opened: true,
                    status: 'success',
                    message: 'Postagem editada com sucesso!'
                };
            } catch (error) {
                console.error('Erro ao editar postagem: ', error);
                this.$root.toast = {
                    opened: true,
                    status: 'danger',
                    message: 'Erro ao editar postagem. Verifique o console.'
                };
            }
        },
        async deletePost(postToDelete) {
            if (!confirm("Realmente deseja excluir a postagem? Essa ação é irreversível!")) return;

            try {
                const imageUrls = this.extractImageUrls(postToDelete.content);
                await this.deleteImagesFromStorage(imageUrls);

                await deleteDoc(doc(this.db, FIRESTORE_COLLECTION, postToDelete.id));
                this.posts = this.posts.filter(post => post.id !== postToDelete.id);

                this.$root.toast = {
                    opened: true,
                    status: 'success',
                    message: 'Postagem excluída com sucesso.'
                };
            } catch (error) {
                console.error('Erro ao excluir postagem: ', error);
                this.$root.toast = {
                    opened: true,
                    status: 'danger',
                    message: 'Erro ao excluir postagem. Verifique o console.'
                };
            }
        },
        async handleDrop(instance, event) {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file) {
                const storageReference = storageRef(this.storage, `images/${file.name}`);
                await uploadBytes(storageReference, file);

                const fileUrl = await getDownloadURL(storageReference);
                instance.replaceRange(`![${file.name}](${fileUrl})`, instance.getCursor());
            }
        },
        resetAddPostForm() {
            this.addingPost = { title: '', description: '' };
            this.addFormMessages = { title: '', description: '', content: '' };
            this.markdown.add.value('');
            this.closeAddModal();
        },
        resetEditPostForm() {
            this.editingPost = { title: '', description: '' };
            this.markdown.edit.value('');
            this.closeEditModal();
        },
        async fetchPosts() {
            try {
                const querySnapshot = await getDocs(collection(this.db, FIRESTORE_COLLECTION));
                this.posts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title,
                    description: doc.data().description,
                    content: doc.data().content,
                    created_at: doc.data().created_at
                }));
            } catch (error) {
                console.error('Erro ao recuperar postagens: ', error);
                this.$root.toast = {
                    opened: true,
                    status: 'danger',
                    message: 'Erro ao recuperar postagens. Verifique o console.'
                };
            } finally {
                this.loadingPosts = false;
            }
        },
        initializeMarkdownEditors() {
            this.markdown.add = new SimpleMDE({
                element: document.getElementById("add-content"),
                spellChecker: false,
            });
            this.markdown.add.codemirror.on("drop", this.handleDrop);

            this.markdown.edit = new SimpleMDE({
                element: document.getElementById("edit-content"),
                spellChecker: false,
            });
            this.markdown.edit.codemirror.on("drop", this.handleDrop);
        },
        extractImageUrls(content) {
            const urlRegex = /!\[.*?\]\((https:\/\/firebasestorage\.googleapis\.com\/.*?)\)/g;
            let urls = [];
            let match;

            while ((match = urlRegex.exec(content)) !== null) {
                urls.push(match[1]);
            }

            return urls;
        },
        async deleteImagesFromStorage(urls) {
            const promises = urls.map(async (url) => {
                const storagePath = url.split("/o/")[1].split("?")[0];
                const decodedPath = decodeURIComponent(storagePath);
                const imageRef = storageRef(this.storage, decodedPath);

                await deleteObject(imageRef);
            });

            await Promise.all(promises);
        },
    },
};

export default Admin;
