import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const users = [
    {
        id: uuidv4(),
        isAdmin: true,
        userName: "Eric",
        password: await encryptPassword("password1"),
    },
    {
        id: uuidv4(),
        isAdmin: false,
        userName: "Alice",
        password: await encryptPassword("password2"),
    },
];

const posts = [
    {
        id: "POST20241224001",
        date: "2024-12-24",
        author: "Eric",
        body: "こんにちは。今日は素晴らしい日ですね🎄",
    },
    {
        id: "POST20241224002",
        date: "2024-12-24",
        author: "Alice",
        body: "あなたの元にもサンタさんは来ましたか？🎅",
    },
];

const postLikes = [
    {
        id: `like${uuidv4()}`,
        postId: "POST20241224001",
        likedBy: "Alice",
    },
    {
        id: `like${uuidv4()}`,
        postId: "POST20241224001",
        likedBy: "Bob",
    },
];

let loggedInUser = null;

// パスワードの暗号化
async function encryptPassword(password) {
    return await bcrypt.hash(password, 10);
}

function login(userName, password) {
    const matchUser = users.find(
        (user) =>
            user.userName === userName &&
            bcrypt.compare(password, user.password)
    );

    if (matchUser) {
        loggedInUser = matchUser;
        return true;
    }
    return false;
}

function checkIfLoggedIn() {
    return loggedInUser !== null;
}

function getPostLikeCount(postId) {
    const like = postLikes.filter((like) => like.postId === postId);

    if (like) {
        return like.length;
    }

    return 0;
}

function getMyPosts() {
    const fetchMyPost = posts.filter(
        (post) => post.author === loggedInUser.userName
    );

    const resultMyPost = fetchMyPost.map((post) => {
        return { ...post, likeCount: getPostLikeCount(post.id) };
    });

    return resultMyPost;
}

function readMyPostsUseCase() {
    // ログインしているかを確認
    let flag = checkIfLoggedIn(); // ログインしてるかの確認
    if (!flag) {
        return "ログインしていません";
    }

    flag = false; // いいねされた投稿があるかの判定用にフラグを再利用 !!フラグの意味が変わっている！!
    const myPosts = getMyPosts();

    // いいねされた投稿があるか確認
    let totalLikeCount = 0;
    if (myPosts.length > 0) {
        for (const post of myPosts) {
            const likeCount = post.likeCount;
            if (likeCount > 0) {
                flag = true;
                totalLikeCount += likeCount;
            }
        }
    }

    let message = "";
    if (flag) {
        message = `いいねされた投稿が${totalLikeCount}件あります`;
    }

    return { myPosts, message };
}

// 使用例
console.log("ログイン画面です");
const loggedInResult = login("Eric", "password1"); // ログイン
console.log(`ログイン結果: ${loggedInResult}`);

console.log("\n他画面でユーザーのMyPostsを確認します");

const myPosts = readMyPostsUseCase();
console.log(myPosts);
