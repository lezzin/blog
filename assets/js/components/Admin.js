const Admin = {
    template: "#admin-template",
    data() {
        return {
            modalOpened: false
        }
    },
    methods: {
        openModal() {
            this.modalOpened = true;
        },
        closeModal() {
            this.modalOpened = false;
        }
    },
    mounted: function () {
        document.title = "Blog | Admin";
        window.scrollTo({ top: 0 });
    },
}

export default Admin;