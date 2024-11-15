import { collection, getDocs, doc, updateDoc, addDoc, getDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { reactive } from "vue";

import { FIRESTORE_COLLECTION } from "../utils/variables";
import { db, storage } from "../config/firebase";

const allPosts = reactive({ data: [] });
const temporaryImages = reactive([]);

const uploadImage = async (file) => {
    const newFilename = Date.now().toString();
    const storagePath = `images/${newFilename}`;

    const fileRef = ref(storage, storagePath);
    await uploadBytes(fileRef, file);

    return storagePath;
};

const removeImage = async (storagePath) => {
    if (storagePath) {
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
    }
};

const extractImageUrlsFromMarkdown = (content) => {
    const imageUrlRegex = /!\[.*?\]\((.*?)\)/g;
    const urls = [];
    let match;

    while ((match = imageUrlRegex.exec(content)) !== null) {
        urls.push(match[1]);
    }

    return urls;
};

const removeImagesFromMarkdownContent = async (content) => {
    const urls = extractImageUrlsFromMarkdown(content);

    for (const url of urls) {
        try {
            const isFirebaseUrl = url.includes("firebasestorage.googleapis.com");
            if (isFirebaseUrl) {
                const storagePath = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
                await removeImage(storagePath);
            }
        } catch (error) {
            console.warn(`Erro ao remover a imagem: ${url}`, error);
        }
    }
};

async function resolveImageUrl(post) {
    if (post.thumbnail) {
        post.thumbnail = await getImageUrl(post.thumbnail);
    }
    return post;
}

async function resolveImageUrls(posts) {
    return await Promise.all(posts.map(resolveImageUrl));
}

async function getImageUrl(storagePath) {
    const fileRef = ref(storage, storagePath);
    return await getDownloadURL(fileRef);
}

async function getPost(id) {
    const postDoc = doc(db, FIRESTORE_COLLECTION, id);
    const docSnapshot = await getDoc(postDoc);

    if (!docSnapshot.exists()) {
        throw new Error(`Documento com ID ${id} não encontrado.`);
    }

    const post = await resolveImageUrl(docSnapshot.data());

    return { id: docSnapshot.id, ...post };
}

async function getAll() {
    const querySnapshot = await getDocs(collection(db, FIRESTORE_COLLECTION));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getAllSnapshot() {
    allPosts.data = await getAll();

    const postsCollection = collection(db, FIRESTORE_COLLECTION);
    onSnapshot(postsCollection, async (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        allPosts.data = await resolveImageUrls(posts);
    });
}

async function add(title, description, content, file) {
    const currentTime = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const fileName = file ? await uploadImage(file) : null;

    const post = await addDoc(collection(db, FIRESTORE_COLLECTION), {
        title,
        description,
        content,
        thumbnail: fileName,
        created_at: currentTime,
    });

    const usedImages = extractImageUrlsFromMarkdown(content);

    [fileName, ...usedImages].forEach((path) => {
        const index = temporaryImages.indexOf(path);

        if (index !== -1) {
            temporaryImages.splice(index, 1);
        }
    });

    await clearTemporaryImages();

    return post.id;
}

async function edit(id, title, description, content, file = null) {
    const postDoc = doc(db, FIRESTORE_COLLECTION, id);
    const currentPost = await getPost(id);

    const updates = { title, description, content };

    let newThumbnail = null;
    if (file) {
        newThumbnail = await uploadImage(file);

        if (currentPost.thumbnail) {
            await removeImage(currentPost.thumbnail);
        }

        updates.thumbnail = newThumbnail;
    }

    await removeImagesFromMarkdownContent(currentPost.content);
    await updateDoc(postDoc, updates);

    const usedImages = extractImageUrlsFromMarkdown(content);
    [newThumbnail, ...usedImages].forEach((path) => {
        const index = temporaryImages.indexOf(path);
        if (index !== -1) {
            temporaryImages.splice(index, 1);
        }
    });

    await clearTemporaryImages();
}

async function remove(postToDelete) {
    if (postToDelete.thumbnail) {
        await removeImage(postToDelete.thumbnail);
    }

    await removeImagesFromMarkdownContent(postToDelete.content);
    await deleteDoc(doc(db, FIRESTORE_COLLECTION, postToDelete.id));
}

async function clearTemporaryImages() {
    for (const imagePath of temporaryImages) {
        const isUsed = allPosts.data.some(post => post.content.includes(imagePath) || post.thumbnail === imagePath);

        if (!isUsed) {
            await removeImage(imagePath);
        }
    }

    temporaryImages.length = 0;
}

function markImageAsTemporary(storagePath) {
    temporaryImages.push(storagePath);
}

export function usePost() {
    return {
        add,
        edit,
        remove,
        getAll,
        getAllSnapshot,
        getPost,
        getImageUrl,
        uploadImage,
        removeImage,
        markImageAsTemporary,
        clearTemporaryImages,
        allPosts,
    };
}
