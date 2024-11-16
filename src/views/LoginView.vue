<script setup>
import { computed, onMounted, ref } from 'vue';
import { validateEmail, validatePassword } from '../utils/validations';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'vue-router';
import { notifyUser } from '../utils/notification';
import { PAGE_TITLES } from '../utils/variables';

const router = useRouter();

const email = ref('');
const password = ref('');

async function handleLogin() {
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        notifyUser('Login realizado com sucesso', 'success');
        router.push('/admin');
    } catch (error) {
        notifyUser(error.message, 'error');
    }
}

onMounted(() => {
    document.title = PAGE_TITLES.login;
});

const isDisabled = computed(() => (!email.value || !password.value));
</script>

<template>
    <q-page padding>
        <q-card tag="form" class="card-max-width q-mt-lg" @submit.prevent="handleLogin">
            <q-card-section class="q-gutter-sm">
                <h3 class="text-h4 q-mt-none">Entrar como administrador</h3>

                <q-input filled dense hide-buttom-space type="email" v-model="email" label="Email"
                    :rules="[validateEmail]" />
                <q-input filled dense hide-buttom-space type="password" v-model="password" label="Senha"
                    :rules="[validatePassword]" />
            </q-card-section>

            <q-card-actions class="q-px-md" align="right">
                <q-btn type="submit" color="primary" label="Entrar" icon="login" :disabled="isDisabled" />
                <q-btn to="/" color="primary" outline label="Cancelar" icon="cancel" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<style lang="sass">
.card-max-width 
    width: 100%
    max-width: 500px
    margin-inline: auto
</style>