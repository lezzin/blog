import { marked } from 'marked';

const renderer = new marked.Renderer();

renderer.link = function (link) {
    const { href, title, text } = link;
    
    const youtubeMatch = href.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    return `<a href="${href}" title="${title}">${text}</a>`;
};

export default renderer;
