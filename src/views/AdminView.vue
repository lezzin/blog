<script setup>
import { markRaw, onMounted } from 'vue';
import { signOut } from 'firebase/auth';

import { useModal } from '../composables/useModal';
import { usePost } from '../composables/usePost';

import { PAGE_TITLES } from '../utils/variables';
import { notifyUser } from '../utils/notification';
import { auth } from '../config/firebase';

import PostAdd from '../components/dialog/PostAdd.vue';
import PostEdit from '../components/dialog/PostEdit.vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const modal = useModal();
const router = useRouter();

const { allPosts, getAllSnapshot, remove } = usePost();

const columns = [
    { name: 'image', label: 'Imagem', align: 'left', field: 'thumbnail' },
    { name: 'title', label: 'Título', align: 'left', field: 'title' },
    { name: 'description', label: 'Descrição', align: 'left', field: 'description' },
    { name: 'content', label: 'Conteúdo', align: 'left', field: 'content' },
    { name: 'actions', label: 'Ações', align: 'left', field: 'actions' },
]

const PAGE_DIALOGS = {
    add: PostAdd,
    edit: PostEdit
}

function openDialog(dialog, props) {
    modal.component.value = markRaw(PAGE_DIALOGS[dialog]);
    modal.props.value = { onClose: closeDialog, ...props };
    modal.show.value = true;
}

async function closeDialog() {
    modal.show.value = false;

}

async function deletePost(post) {
    if (!confirm("Realmente deseja excluir a postagem? Essa ação é irreversível!")) return;

    try {
        await remove(post);
        notifyUser('Publicação removida com sucesso!', 'success');
    } catch (error) {
        notifyUser(error.message, 'error');
    }
}

async function logout() {
    try {
        await signOut(auth);
        router.push('/')
    } catch (error) {
        notifyUser(error.message, 'error');
    }
}

onMounted(async () => {
    $q.loading.show();

    try {
        await getAllSnapshot();
        document.title = PAGE_TITLES.admin;
    } catch (error) {
        notifyUser(error.message, 'error');
    } finally {
        $q.loading.hide();
    }
});
</script>

<template>
    <q-page padding>
        <div class="row justify-between items-center q-mb-lg">
            <h2 class="q-my-sm text-h4 text-weight-bold">Administração</h2>

            <div class="q-gutter-sm q-mb-none">
                <q-btn icon="add" rounded color="primary" @click.stop="openDialog('add')">
                    <q-tooltip>Adicionar postagem</q-tooltip>
                </q-btn>
                <q-btn icon="logout" rounded outline color="primary" @click.stop="logout">
                    <q-tooltip>Sair</q-tooltip>
                </q-btn>
            </div>
        </div>

        <q-table :columns="columns" :rows="allPosts.data">
            <template #no-data>
                <p class="full-width text-body2 text-center q-mb-none">
                    Nenhuma publicação encontrada. Comece adicionando uma!
                </p>
            </template>

            <template #body="props">
                <q-tr>
                    <q-td>
                        <a target="_blank" :href="props.row.thumbnail">
                            <q-img :src="props.row.thumbnail" height="64px" />
                        </a>
                    </q-td>
                    <q-td class="ellipsis" style="max-width: 200px;">{{ props.row.title }}</q-td>
                    <q-td class="ellipsis" style="max-width: 200px;">{{ props.row.description }}</q-td>
                    <q-td class="ellipsis" style="max-width: 200px;">{{ props.row.content }}</q-td>
                    <q-td>
                        <q-btn-group flat rounded>
                            <q-btn icon="edit" color="green" size="sm"
                                @click.stop="openDialog('edit', { post: { ...props.row } })">
                                <q-tooltip>Editar publicação</q-tooltip>
                            </q-btn>
                            <q-btn icon="visibility" color="green" outline size="sm" :to="`/post/${props.row.id}`">
                                <q-tooltip>Visualizar publicação</q-tooltip>
                            </q-btn>
                            <q-btn icon="delete" color="red" outline size="sm" @click.stop="deletePost(props.row)">
                                <q-tooltip>Remover publicação</q-tooltip>
                            </q-btn>
                        </q-btn-group>
                    </q-td>
                </q-tr>
            </template>
        </q-table>
    </q-page>

    <q-dialog v-model="modal.show.value" persistent>
        <component :is="modal.component.value" v-bind="modal.props.value"></component>
    </q-dialog>
</template>