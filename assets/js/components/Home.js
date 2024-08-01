const Home = {
    template: "#home-template",
    mounted: function() {
        document.title = "Blog";
        window.scrollTo({ top: 0 });
    }
}

export default Home;