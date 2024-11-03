<script>
import { ref } from 'vue';

export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        closeModal: {
            type: Function,
            required: true
        }
    },
    setup(props, { emit }) {
        const email = ref('');
        const password = ref('');

        const handleLogin = () => {
            emit('login', { email: email.value, password: password.value });
        };

        return {
            email,
            password,
            handleLogin
        };
    }
}
</script>

<template>
    <aside :class="['modal', isOpen && 'active']">
        <div class="modal__dialog">
            <h3 class="modal__title">Login</h3>
            <div class="modal__body">
                <form class="form" @submit.prevent="handleLogin">
                    <div class="form__group">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" v-model="email" placeholder="Digite seu e-mail" required>
                    </div>

                    <div class="form__group">
                        <label for="password">Senha</label>
                        <input type="password" id="password" v-model="password" placeholder="Digite sua senha" required>
                    </div>

                    <div class="form__footer">
                        <button type="submit" class="btn btn--success">
                            <i class="bi bi-check-lg"></i>
                            Entrar
                        </button>
                        <button type="button" class="btn btn--out-danger" title="Fechar modal" @click="closeModal">
                            <i class="bi bi-x"></i>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </aside>
</template>
