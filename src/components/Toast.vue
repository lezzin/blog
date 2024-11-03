<script>
export default {
    props: {
        toast: {
            type: Object,
            required: true
        }
    }
}
</script>

<template>
    <aside :class="['toast', toast.opened && 'active']">
        <span
            :class="['toast__banner', toast.status === 'danger' ? 'toast__banner--danger' : 'toast__banner--success']">
        </span>
        <p class="toast__message">
            <i class="bi bi-exclamation-circle"></i> {{ toast.message }}
        </p>
    </aside>
</template>

<style scoped>
.toast {
    border-radius: 3px;
    position: fixed;
    right: 2rem;
    top: 2rem;
    font-size: 1.6rem;
    background: whitesmoke;
    display: flex;
    overflow: hidden;
    transform: translateX(100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.toast.active {
    opacity: 1;
    transform: translateX(0%);
}

.toast__banner {
    width: 1.5rem;
    height: auto;
}

.toast__banner--success {
    background: #25862a;
}

.toast__banner--danger {
    background: #b93232;
}

.toast__message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 1rem 2rem 1rem 1rem;
    white-space: nowrap;
}
</style>