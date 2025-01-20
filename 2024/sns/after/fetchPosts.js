import bcrypt from "bcrypt";

const uuid = () => crypto.randomUUID();

const users = [
    {
        id: uuid(),
        isAdmin: true,
        userName: "Eric",
        password: await encryptPassword("password1"),
    },
    {
        id: uuid(),
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
        id: `like${uuid()}`,
        postId: "POST20241224001",
        likedBy: "Alice",
    },
    {
        id: `like${uuid()}`,
        postId: "POST20241224001",
        likedBy: "Bob",
    },
];

let loggedInUser = null;

// パスワードの暗号化
async function encryptPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function login(userName, password) {
    // array.find()の非同期版
    const asyncFind = async (array, predicate) => {
        for (const item of array) {
            if (await predicate(item)) {
                return item;
            }
        }
    };

    const matchUser = await asyncFind(
        users,
        async (user) =>
            user.userName === userName &&
            (await bcrypt.compare(password, user.password))
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

function fetchMyPostsUseCase() {
    // ログインしているかを確認
    let isLoggedIn = checkIfLoggedIn(); // ログインしてるかの確認
    if (!isLoggedIn) {
        return "ログインしていません";
    }

    const myPosts = getMyPosts();
    let hasLikedPosts = false; // いいねされた投稿があるかのフラグ

    // いいねされた投稿があるか確認
    let totalLikeCount = 0;
    for (const post of myPosts) {
        const likeCount = post.likeCount;
        if (likeCount > 0) {
            hasLikedPosts = true;
            totalLikeCount += likeCount;
        }
    }

    // メッセージの作成
    let message = "";
    if (hasLikedPosts) {
        message = `いいねされた投稿が${totalLikeCount}件あります`;
    }

    return { myPosts, message };
}

// 使用例
console.log("ログイン画面です");
const loggedInResult = await login("Eric", "password1"); // ログイン
console.log(`ログイン結果: ${loggedInResult}`);

console.log("\n他画面でユーザーのMyPostsを確認します");

const myPosts = fetchMyPostsUseCase();
console.log(myPosts);
