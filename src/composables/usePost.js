import { collection, getDocs, doc, updateDoc, addDoc, getDoc, onSnapshot, deleteDoc } from "firebase/firestore";

import { FIRESTORE_COLLECTION } from "../utils/variables";
import { db } from "../config/firebase";
import { reactive } from "vue";

const allPosts = reactive({ data: [] });

async function getAll() {
    const querySnapshot = await getDocs(collection(db, FIRESTORE_COLLECTION));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getPost(id) {
    const postDoc = doc(db, FIRESTORE_COLLECTION, id);
    const docSnapshot = await getDoc(postDoc);

    if (!docSnapshot.exists()) {
        throw new Error(`Documento com ID ${id} não encontrado.`);
    }

    return { id: docSnapshot.id, ...docSnapshot.data() };
}

async function getAllSnapshot() {
    allPosts.data = await getAll();

    const postsCollection = collection(db, FIRESTORE_COLLECTION);
    onSnapshot(postsCollection, (snapshot) => {
        allPosts.data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
}

async function add(title, description, content) {
    const currentTime = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    await addDoc(collection(db, FIRESTORE_COLLECTION), {
        title,
        description,
        content,
        created_at: currentTime
    });
}

async function edit(id, title, description, content) {
    const postDoc = doc(db, FIRESTORE_COLLECTION, id);
    await updateDoc(postDoc, { title, description, content });
}

async function remove(postToDelete) {
    await deleteDoc(doc(db, FIRESTORE_COLLECTION, postToDelete.id));
};

export function usePost() {
    return {
        add,
        edit,
        remove,
        getAll,
        getAllSnapshot,
        getPost,
        allPosts
    };
}
