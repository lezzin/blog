<script>
import { ref, inject, onMounted, handleError } from 'vue';
import LoginModal from '../components/LoginModal.vue';
import AddPostModal from '../components/AddPostModal.vue';
import EditPostModal from '../components/EditPostModal.vue';
import { auth, db, storage } from '../firebase.js';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { deleteObject, ref as storageRef } from 'firebase/storage';
import { FIRESTORE_COLLECTION } from '../utils/variables.js';
import Loader from '../components/Loader.vue';

export default {
    components: {
        LoginModal,
        AddPostModal,
        EditPostModal,
        Loader
    },
    setup() {
        const modalAddOpened = ref(false);
        const modalEditOpened = ref(false);
        const posts = ref([]);
        const loadingPosts = ref(false);
        const router = useRouter();
        const user = ref(null);
        const toast = inject("toast");

        const addingPost = ref({
            title: '',
            description: '',
        });

        const editingPost = ref({
            id: '',
            title: '',
            description: '',
            content: ''
        });

        onMounted(() => {
            onAuthStateChanged(auth, (newUser) => {
                user.value = newUser;
                if (newUser) {
                    fetchPosts();
                }
            });

            document.addEventListener("click", (event) => {
                const target = event.target;

                if (!modalAddOpened.value && !modalEditOpened.value) return;

                const addModal = document.querySelector('[data-add-post]');
                const editModal = document.querySelector('[data-edit-post]');
                const openAddButton = document.querySelector('[data-add-button]');
                const openEditButtons = document.querySelectorAll('[data-edit-button]');

                const isOpenAddButton = openAddButton && openAddButton.contains(target);
                const isOpenEditButton = Array.from(openEditButtons).some(button => button.contains(target));

                if (addModal && !addModal.contains(target) && editModal && !editModal.contains(target) && !isOpenAddButton && !isOpenEditButton) {
                    closeAddModal();
                    closeEditModal();
                }
            });
        });

        const login = async (credentials) => {
            try {
                await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
                toast.value = {
                    opened: true,
                    status: 'success',
                    message: 'Login realizado com sucesso.'
                };
            } catch (error) {
                handleAuthError(error);
            }
        };

        const logout = async () => {
            await signOut(auth);
            user.value = null;

            toast.value = {
                opened: true,
                status: 'success',
                message: 'Logout realizado com sucesso.'
            };
        };

        const changePassword = async () => {
            try {
                await sendPasswordResetEmail(auth, user.value.email);
                showSuccessToast("Email de redefinição de senha enviado");
            } catch (error) {
                handleError('redefinir senha', error);
            }
        };

        const fetchPosts = async () => {
            setLoading(true);

            try {
                const querySnapshot = await getDocs(collection(db, FIRESTORE_COLLECTION));
                posts.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        const addPost = async (postData) => {
            try {
                const currentTime = new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                });

                const docRef = await addDoc(collection(db, FIRESTORE_COLLECTION), {
                    title: postData.title,
                    description: postData.description,
                    content: postData.content,
                    created_at: currentTime
                });

                posts.value.push({
                    id: docRef.id,
                    title: postData.title,
                    description: postData.description,
                    content: postData.content,
                    created_at: currentTime
                });

                resetAddPostForm();
                toast.value = {
                    opened: true,
                    status: 'success',
                    message: 'Postagem adicionada com sucesso!'
                };
            } catch (error) {
                handleDataError('adicionar postagem', error);
            }
        };

        const editPost = async (postData) => {
            try {
                const { id, title, description, content } = postData;

                const postDoc = doc(db, FIRESTORE_COLLECTION, id);
                const oldPost = posts.value.find(post => post.id === id);

                const oldImageUrls = extractImageUrls(oldPost.content);
                const newImageUrls = extractImageUrls(content);

                const imagesToRemove = oldImageUrls.filter(url => !newImageUrls.includes(url));

                await deleteImagesFromStorage(imagesToRemove);
                await updateDoc(postDoc, { title, description, content });

                posts.value = posts.value.map(post =>
                    post.id === id ? { ...post, title, description, content } : post
                );

                resetEditPostForm();
                showSuccessToast('Postagem editada com sucesso!');
            } catch (error) {
                handleDataError('editar postagem', error);
            }
        };

        const deletePost = async (postToDelete) => {
            if (!confirm("Realmente deseja excluir a postagem? Essa ação é irreversível!")) return;

            try {
                const imageUrls = extractImageUrls(postToDelete.content);
                await deleteImagesFromStorage(imageUrls);

                await deleteDoc(doc(db, FIRESTORE_COLLECTION, postToDelete.id));
                posts.value = posts.value.filter(post => post.id !== postToDelete.id);

                showSuccessToast('Postagem excluída com sucesso.');
            } catch (error) {
                handleDataError('excluir postagem', error);
            }
        };

        const extractImageUrls = (content) => {
            const urlRegex = /!\[.*?\]\((https:\/\/firebasestorage\.googleapis\.com\/.*?)\)/g;
            let urls = [];
            let match;

            while ((match = urlRegex.exec(content)) !== null) {
                urls.push(match[1]);
            }

            return urls;
        };

        const deleteImagesFromStorage = async (urls) => {
            const promises = urls.map(async (url) => {
                const storagePath = url.split("/o/")[1].split("?")[0];
                const decodedPath = decodeURIComponent(storagePath);
                const imageRef = storageRef(storage, decodedPath);

                await deleteObject(imageRef);
            });

            await Promise.all(promises);
        };

        const openAddModal = () => {
            modalAddOpened.value = true;
        };

        const closeLoginModal = () => {
            router.push("/");
        }

        const closeAddModal = () => {
            modalAddOpened.value = false;
            resetAddPostForm();
        };

        const openEditModal = (post) => {
            editingPost.value = { ...post };
            modalEditOpened.value = true;
        };

        const closeEditModal = () => {
            modalEditOpened.value = false;
            resetEditPostForm();
        };

        const resetAddPostForm = () => {
            addingPost.value = { title: '', description: '' };
        };

        const resetEditPostForm = () => {
            editingPost.value = { id: '', title: '', description: '', content: '' };
        };

        const setLoading = (isLoading) => {
            loadingPosts.value = isLoading;
        };

        const showSuccessToast = (message) => {
            toast.value = {
                opened: true,
                status: 'success',
                message
            };
        };

        const handleAuthError = (error) => {
            let errorMessage = 'Erro ao fazer login.';

            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage = 'Credenciais inválidas.';
                    break;
                default:
                    errorMessage = 'Ocorreu um erro. Verifique o console.';
                    break;
            }

            toast.value = {
                opened: true,
                status: 'danger',
                message: errorMessage
            };
        };

        const handleDataError = (action, error) => {
            console.error(`Erro ao ${action}: `, error);
            toast.value = {
                opened: true,
                status: 'danger',
                message: `Erro ao ${action}. Verifique o console.`
            };
        };

        return {
            user,
            loadingPosts,
            posts,
            modalAddOpened,
            modalEditOpened,
            addingPost,
            editingPost,
            login,
            logout,
            changePassword,
            addPost,
            editPost,
            deletePost,
            openAddModal,
            closeAddModal,
            openEditModal,
            closeEditModal,
            closeLoginModal
        };
    }
};
</script>

<template>
    <div class="admin">
        <div v-if="user">
            <header class="admin__header">
                <h2 class="admin__title">Administração</h2>
                <div class="admin__buttons">
                    <button type="button" class="btn btn--out-success" title="Alterar senha" @click="changePassword">
                        <i class="bi bi-lock"></i> Alterar senha
                    </button>
                    <button type="button" class="btn btn--danger" title="Sair da conta" @click="logout">
                        <i class="bi bi-box-arrow-left"></i> Sair
                    </button>
                </div>
            </header>

            <button type="button" class="btn btn--success --left" title="Adicionar nova postagem" @click="openAddModal"
                data-add-button>
                <i class="bi bi-plus"></i> Nova postagem
            </button>

            <Loader v-if="loadingPosts" />
            <div>
                <div class="preview" v-if="posts.length > 0">
                    <section v-for="post in posts" :key="post.id" class="post">
                        <h2 class="post__title">{{ post.title }}</h2>
                        <p class="post__description">{{ post.description }}</p>

                        <div class="post__buttons">
                            <router-link :to="'post/' + post.id" class="btn btn--success" role="button">
                                <i class="bi bi-eye"></i> Visualizar
                            </router-link>
                            <button type="button" class="btn btn--out-success" title="Editar postagem"
                                @click="openEditModal(post)" data-edit-button>
                                <i class="bi bi-pencil"></i> Editar
                            </button>
                            <button type="button" class="btn btn--out-danger" title="Excluir postagem"
                                @click="deletePost(post)">
                                <i class="bi bi-trash"></i> Excluir
                            </button>
                        </div>
                    </section>
                </div>
                <p class="alert" v-else>
                    Nenhuma postagem encontrada.
                </p>
            </div>
        </div>

        <LoginModal :isOpen="!user" :closeModal="closeLoginModal" @login="login" />

        <AddPostModal :isOpen="modalAddOpened" :closeModal="closeAddModal" :onSubmit="addPost"
            :addingPost="addingPost" />

        <EditPostModal :isOpen="modalEditOpened" :closeModal="closeEditModal" :onSubmit="editPost"
            :editingPost="editingPost" />
    </div>
</template>

<style scoped>
.admin__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e9e9e9;
}

.admin .--left {
    margin-left: auto;
    margin-bottom: 1rem;
}

.admin__buttons {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
}


.admin__title {
    font-size: 2.8rem;
    font-weight: 500;
    margin-bottom: 0;
}

@media (width <=768px) {
    .admin__buttons {
        width: 100%;
    }

    .admin__buttons>* {
        flex-grow: 1;
    }
}
</style>