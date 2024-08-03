import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { signOut, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { FIRESTORE_COLLECTION, PAGE_TITLES } from "../utils/variables.js";
import "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js";

const Admin = {
    template: "#admin-template",
    props: ["db", "storage", "auth"],
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
            },
        };
    },
    mounted() {
        document.title = PAGE_TITLES.admin;
        window.scrollTo({ top: 0 });

        document.addEventListener("click", e => {
            if (e.target.classList.contains("modal")) {
                this.closeModals();
            }
        });

        onAuthStateChanged(this.auth, user => {
            this.user.loggedIn = !!user;
            if (user) {
                this.initialize();
            }
        });
    },
    methods: {
        async login() {
            try {
                await signInWithEmailAndPassword(this.auth, this.user.email, this.user.password);
                this.user.email = '';
                this.user.password = '';
            } catch (error) {
                this.handleAuthError(error);
            }
        },
        async logout() {
            try {
                await signOut(this.auth);
                this.user = { email: '', password: '', loggedIn: false };
                this.destroyMarkdownEditors();
            } catch (error) {
                this.handleAuthError(error);
            }
        },
        initialize() {
            this.destroyMarkdownEditors();
            this.initializeMarkdownEditors();
            this.fetchPosts();
        },
        initializeMarkdownEditors() {
            this.markdown.add = new SimpleMDE({
                element: document.getElementById("add-content"),
                spellChecker: false,
            });
            this.markdown.add.codemirror.on("drop", this.handleDropImage);

            this.markdown.edit = new SimpleMDE({
                element: document.getElementById("edit-content"),
                spellChecker: false,
            });
            this.markdown.edit.codemirror.on("drop", this.handleDropImage);
        },
        destroyMarkdownEditors() {
            if (this.markdown.add) {
                this.markdown.add.toTextArea();
                this.markdown.add = null;
            }

            if (this.markdown.edit) {
                this.markdown.edit.toTextArea();
                this.markdown.edit = null;
            }
        },
        async addPost() {
            if (!this.validateAddPostForm()) return;

            try {
                const currentTime = new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                });

                const docRef = await addDoc(collection(this.db, FIRESTORE_COLLECTION), {
                    title: this.addingPost.title,
                    description: this.addingPost.description,
                    content: this.markdown.add.value(),
                    created_at: currentTime
                });

                this.posts.push({
                    id: docRef.id,
                    title: this.addingPost.title,
                    description: this.addingPost.description,
                    content: this.markdown.add.value(),
                    created_at: currentTime
                });

                this.resetAddPostForm();
                this.showSuccessToast('Postagem adicionada com sucesso!');
            } catch (error) {
                this.handleDataError('adicionar postagem', error);
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

                await updateDoc(postDoc, { title, description, content: newContent });

                this.posts = this.posts.map(post =>
                    post.id === id ? { ...post, title, description, content: newContent } : post
                );

                this.resetEditPostForm();
                this.showSuccessToast('Postagem editada com sucesso!');
            } catch (error) {
                this.handleDataError('editar postagem', error);
            }
        },
        async deletePost(postToDelete) {
            if (!confirm("Realmente deseja excluir a postagem? Essa ação é irreversível!")) return;

            try {
                const imageUrls = this.extractImageUrls(postToDelete.content);
                await this.deleteImagesFromStorage(imageUrls);

                await deleteDoc(doc(this.db, FIRESTORE_COLLECTION, postToDelete.id));
                this.posts = this.posts.filter(post => post.id !== postToDelete.id);

                this.showSuccessToast('Postagem excluída com sucesso.');
            } catch (error) {
                this.handleDataError('excluir postagem', error);
            }
        },
        async handleDropImage(instance, event) {
            event.preventDefault();
            const file = event.dataTransfer.files[0];

            if (!file) return;

            const storageReference = storageRef(this.storage, `images/${file.name}`);
            await uploadBytes(storageReference, file);

            const fileUrl = await getDownloadURL(storageReference);
            instance.replaceRange(`![${file.name}](${fileUrl})`, instance.getCursor());
        },
        async fetchPosts() {
            this.setLoading(true);

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
                this.handleDataError('recuperar postagens', error);
            } finally {
                this.setLoading(false);
            }
        },
        validateAddPostForm() {
            let isValid = true;

            if (this.addingPost.title.length > 50) {
                this.addFormMessages.title = "O título deve conter no máximo 50 caracteres";
                isValid = false;
            } else {
                this.addFormMessages.title = '';
            }

            if (this.addingPost.description.length > 150) {
                this.addFormMessages.description = "A descrição deve conter no máximo 150 caracteres";
                isValid = false;
            } else {
                this.addFormMessages.description = '';
            }

            if (this.markdown.add.value() === '') {
                this.addFormMessages.content = "Preencha o conteúdo da postagem";
                isValid = false;
            } else {
                this.addFormMessages.content = '';
            }

            return isValid;
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
        resetAddPostForm() {
            this.addingPost = { title: '', description: '' };
            this.addFormMessages = { title: '', description: '', content: '' };
            this.markdown.add.value('');
            this.closeAddModal();
        },
        resetEditPostForm() {
            this.editingPost = { id: '', title: '', description: '' };
            this.markdown.edit.value('');
            this.closeEditModal();
        },
        setLoading(isLoading) {
            this.loadingPosts = isLoading;
        },
        showSuccessToast(message) {
            this.$root.toast = {
                opened: true,
                status: 'success',
                message
            };
        },
        handleAuthError(error) {
            console.error('Erro de autenticação:', error);
            let errorMessage = 'Erro ao fazer login.';

            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage = 'Credenciais inválidas.';
                    break;
                default:
                    errorMessage = 'Ocorreu um erro. Verifique o console.';
                    break;
            }

            this.$root.toast = {
                opened: true,
                status: 'danger',
                message: errorMessage
            };
        },
        handleDataError(action, error) {
            console.error(`Erro ao ${action}: `, error);
            this.$root.toast = {
                opened: true,
                status: 'danger',
                message: `Erro ao ${action}. Verifique o console.`
            };
        },
        closeModals() {
            this.modalAddOpened && this.closeAddModal();
            this.modalEditOpened && this.closeEditModal();
        }
    },
};

export default Admin;
