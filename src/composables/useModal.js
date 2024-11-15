import { ref } from "vue";

export const useModal = () => {
    const show = ref(false);
    const component = ref(false);
    const props = ref({});

    return {
        show,
        props,
        component,
        hideModal: () => show.value = false
    }
}