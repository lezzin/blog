import { collection, getDocs, doc, updateDoc, addDoc, getDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { reactive } from "vue";

import { FIRESTORE_COLLECTION } from "../utils/variables";
import { db, storage } from "../config/firebase";

const allPosts = reactive({ data: [] });

const uploadImage = async (file) => {
    const newFilename = Date.now().toString();
    const storagePath = `images/${newFilename}`;

    const fileRef = ref(storage, storagePath);
    await uploadBytes(fileRef, file);

    return storagePath;
};

async function resolveImageUrl(post) {
    if (post.thumbnail) {
        post.thumbnail = await getImageUrl(post.thumbnail);
    }

    return post;
}

async function resolveImageUrls(posts) {
    return await Promise.all(posts.map(async (post) => (resolveImageUrl(post))));
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
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allPosts.data = await resolveImageUrls(posts);
    });
}

async function add(title, description, content, file) {
    const currentTime = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const fileName = await uploadImage(file);

    await addDoc(collection(db, FIRESTORE_COLLECTION), {
        title,
        description,
        content,
        thumbnail: fileName,
        created_at: currentTime
    });
}

async function edit(id, title, description, content, file = null) {
    const postDoc = doc(db, FIRESTORE_COLLECTION, id);
    const updates = { title, description, content };

    if (file) {
        const newThumbnail = await uploadImage(file);
        updates.thumbnail = newThumbnail;
    }

    await updateDoc(postDoc, updates);
}

async function remove(postToDelete) {
    if (postToDelete.thumbnail) {
        const fileRef = ref(storage, postToDelete.thumbnail);
        await deleteObject(fileRef);
    }

    await deleteDoc(doc(db, FIRESTORE_COLLECTION, postToDelete.id));
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
        allPosts
    };
}
