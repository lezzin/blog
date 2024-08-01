const Post = {
    template: "#post-template",
    data: function () {
        return {
            post_id: null,
        }
    },
    mounted: function () {
        const id = this.$route.params.id;
        this.post_id = id;

        document.title = `Blog | Postagem ${id}`;
    },
    methods: {
        share: function () {
            const currentUrl = window.location.href;

            navigator.share({
                title: 'Blog de Wellyngton Souza',
                text: 'Compartilhar postagem do blog',
                url: currentUrl,
            })
                .catch((error) => alert('Error sharing: ', error));
        }
    }
}

export default Post;