import { fDb } from '../middleware/firebase';
import { hash } from "../middleware/security";



interface IBlog {
    content: string;
    author: string;
    likes: number;
    comment: number;
    views: number;
    lastModified: string;
    createdOn: string;
    timestamp: number;
}


export default class Blog {





    static async post({ content, author }: { content: string, author: string }) {

        const date = new Date();

        const post = {
            id: Date.now().toString(),
            content: content,
            author: author,
            likes: 0,
            comment: 0,
            views: 0,
            lastModified: date,
            createdOn: date,
            timestamp: Date.now(),
        }


        const authorDocId = hash(post.author, "md5");

        const batch = fDb.batch();

        // general post collection
        batch.set(fDb.collection('posts').doc(post.id), post);

        // user post collection
        batch.set(fDb.collection('users').doc(authorDocId).collection('posts').doc(post.id), post);

        await batch.commit();

        return post;

    }


    static async list({ limit = 10 }): Promise<Array<IBlog>> {

        const postDocs = await fDb.collection("posts").orderBy("timestamp", "desc").limit(limit || 10).get();
        return postDocs.docs.map((doc) => doc.data() as IBlog);
    }



}