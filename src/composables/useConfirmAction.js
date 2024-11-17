import { ref } from "vue";

export const useConfirmAction = () => {
    const show = ref(false);
    const message = ref('');
    const callback = ref(null);

    return {
        show,
        message,
        callback,
    };
};
