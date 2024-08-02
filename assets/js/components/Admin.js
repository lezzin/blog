import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
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
            },
            addingPost: {
                title: '',
                description: '',
                content: '',
            },
            editingPost: {
                id: '',
                title: '',
                description: '',
                content: '',
            },
            posts: [],
            markdown: {
                add: null,
                edit: null
            }
        };
    },
    methods: {
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
        async editPost() {
            try {
                const { id, title, description, content } = this.editingPost;
                const postDoc = doc(this.db, 'posts', id);
                await updateDoc(postDoc, {
                    title,
                    description,
                    content: this.markdown.edit.value()
                });
                
                this.posts = this.posts.map(post => 
                    post.id === id ? { ...post, title, description, content } : post
                );
                
                alert('Post editado com sucesso!');
            } catch (error) {
                console.error('Erro ao editar post:', error);
                alert('Erro ao editar post. Verifique o console para mais detalhes.');
            }
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

            try {
                await addDoc(collection(this.db, 'posts'), {
                    title: this.addingPost.title,
                    description: this.addingPost.description,
                    content: this.markdown.add.value()
                });

                this.resetPostForm();
                alert('Post adicionado com sucesso!');
            } catch (error) {
                console.error('Erro ao adicionar post:', error);
                alert('Erro ao adicionar post. Verifique o console para mais detalhes.');
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
        async fetchPosts() {
            try {
                const querySnapshot = await getDocs(collection(this.db, 'posts'));
                this.posts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title,
                    description: doc.data().description,
                    content: doc.data().content,
                }));
            } catch (error) {
                console.error('Erro ao recuperar postagens:', error);
            }
        },
        async deletePost(postId) {
            try {
                await deleteDoc(doc(this.db, 'posts', postId));
                this.posts = this.posts.filter(post => post.id !== postId);
                alert('Post excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir post:', error);
                alert('Erro ao excluir post. Verifique o console para mais detalhes.');
            }
        },
        resetPostForm() {
            this.addingPost = { title: '', description: '', content: '' };
            this.addFormMessages = { title: '', description: '' };
            this.markdown.add.value('');
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
    },
    mounted() {
        document.title = "Blog | Admin";
        window.scrollTo({ top: 0 });
        this.initializeMarkdownEditors();
        this.fetchPosts();
    },
};

export default Admin;
