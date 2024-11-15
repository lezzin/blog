const PAGE_TITLE_PREFIX = document.title;

const PAGE_TITLES = {
    home: `${PAGE_TITLE_PREFIX} | Início`,
    admin: `${PAGE_TITLE_PREFIX} | Administração`,
    login: `${PAGE_TITLE_PREFIX} | Entrar`,
    post: (postTitle) => `${PAGE_TITLE_PREFIX} | ${postTitle}`,
}

const FIRESTORE_COLLECTION = 'posts';

export {
    PAGE_TITLES,
    FIRESTORE_COLLECTION
} 