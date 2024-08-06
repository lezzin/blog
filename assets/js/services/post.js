import { collection, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { FIRESTORE_COLLECTION, PAGE_TITLES } from "../utils/variables.js";

export async function fetchPosts(database) {
    const querySnapshot = await getDocs(collection(database, FIRESTORE_COLLECTION));
    const docs = querySnapshot.docs;

    return docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        content: doc.data().content,
        created_at: doc.data().created_at
    }));
}

export async function fetchPost(database, postId) {
    const postDoc = doc(database, FIRESTORE_COLLECTION, postId);
    const docSnap = await getDoc(postDoc);

    if (!docSnap.exists()) {
        return false;
    }

    const { title, content, created_at } = docSnap.data();

    document.title = PAGE_TITLES.post(title);

    return {
        id: docSnap.id,
        title: title,
        content: content,
        created_at: created_at,
    };
}