import { fDb } from '../middleware/firebase';
import { hash, hashSecure } from '../middleware/security';
import User from './user';



interface IBlog {
    content: string;
    author: string | any;
    likes: number;
    comment: number;
    views: number;
    lastModified: string;
    createdOn: string;
    timestamp: number;
}

interface IPost extends IBlog {
    author: { name: string, handle: string, profileImg: string };
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


        const authorDocId = hashSecure(post.author, "md5");

        const batch = fDb.batch();

        // general post collection
        batch.set(fDb.collection('posts').doc(post.id), post);

        // user post collection
        batch.set(fDb.collection('users').doc(authorDocId).collection('posts').doc(post.id), post);

        await batch.commit();

        return post;

    }


    static async list({ limit = 10 }): Promise<Array<IPost>> {

        const postDocs = await fDb.collection("posts").orderBy("timestamp", "desc").limit(limit || 10).get();
        const postData = postDocs.docs.map(e => e.data() as any);
        const posts: Array<IPost> = [];

        for (const post of postData) {
            const { firstName, lastName, email, username } = await User.getUser(post.author as any).catch(console.log) as any;

            const image = "https://www.gravatar.com/avatar/" + hash(email.toLowerCase().trim(), "md5") + "?d=identicon";
            post.author = { name: `${firstName} ${lastName}`, handle: username, profileImg: image }
            posts.push(post);
        }
        return posts
    }
}