import { NotFound } from '../middleware/error_handler';
import { fDb, FieldValue } from '../middleware/firebase';
import { hash, hashSecure } from '../middleware/security';
import User from './user';

const postColl = fDb.collection("posts");
const userColl = fDb.collection("users");
const likeColl = fDb.collection("likes");
const viewColl = fDb.collection("views");

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


    static async getPost(postId: string) {
        const post = await postColl.doc(postId).get();

        if (!post.exists) {
            throw new NotFound("No matching post id");
        }

        return post.data() as IBlog;
    }


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

    static async hasBeenLikedBy(userId: string, postId: string) {

        const like = await likeColl.doc(postId + '_' + userId).get();

        return like.exists;
    }


    static async like(userId: string, postId: string) {

        //! Get the post by the Id
        const { author } = await Blog.getPost(postId);

        //? Checking if the post has be liked before 
        const hasBeenLiked = await Blog.hasBeenLikedBy(userId, postId);

        const batch = fDb.batch();

        //* Like Document
        const likeDoc = { likeBy: userId, post: postId, timestamp: FieldValue.serverTimestamp() };

        //* Post Update Document 
        const postUpdate = { like: FieldValue.increment(hasBeenLiked ? -1 : 1), lastModified: new Date() };


        //* Like Document Id
        const likeDocId = postId + '_' + userId;

        //? Update main post collection
        batch.update(postColl.doc(postId), postUpdate);

        //? Update user post collection
        batch.update(userColl.doc(author).collection('posts').doc(postId), postUpdate);

        //* creating like doc
        if (hasBeenLiked) {
            batch.delete(likeColl.doc(likeDocId))
        } else {
            batch.set(likeColl.doc(likeDocId), likeDoc);
        }

        await batch.commit();

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