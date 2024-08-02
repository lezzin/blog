const PAGE_TITLE_PREFIX = "Blog de Wellyngton Souza"
const PAGE_TITLES = {
    home: `${PAGE_TITLE_PREFIX} | Home`,
    admin: `${PAGE_TITLE_PREFIX} | Administração`,
    postagem: (postTitle) => `${PAGE_TITLE_PREFIX} | ${postTitle}`,
}

const FIRESTORE_COLLECTION = 'posts';

export {
    PAGE_TITLES,
    FIRESTORE_COLLECTION
} 