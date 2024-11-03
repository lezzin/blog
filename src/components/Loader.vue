<template>
    <div class="loader">
        <span class="loader__spinner"></span>
    </div>
</template>

<style scoped>
.loader {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 2rem 0;
}

.loader__spinner {
    width: 2.8rem;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 3px solid #dd3b53;
    border-left-color: white;
    animation: spin 1s linear infinite;
}
</style>