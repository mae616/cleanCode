import bcrypt from "bcrypt";

const uuid = () => crypto.randomUUID();

const users = [
    {
        id: "USER00000001",
        userName: "Eric",
        password: await encryptPassword("password1"),
        age: 30,
        biography: "私は猫です🐈",
        hobbies: ["野球", "読書"],
        isSecret: false,
        isDelete: false,
    },
    {
        id: "USER00000002",
        userName: "Alice",
        password: await encryptPassword("password2"),
        age: 25,
        biography: "私は犬です🐕",
        hobbies: ["映画鑑賞", "旅行"],
        isSecret: false,
        isDelete: true,
    },
    {
        id: "USER00000003",
        userName: "Bob",
        password: await encryptPassword("password3"),
        age: 20,
        biography: "私は魚です🐟",
        hobbies: ["料理", "ゲーム"],
        isSecret: false,
        isDelete: false,
    },
];

const blocks = [
    {
        id: uuid(),
        from: "USER00000001", // EricがBobをブロック
        to: "USER00000003",
    },
];

const follows = [
    {
        id: uuid(),
        from: "USER00000003", // BobがAliceをフォロー
        to: "USER00000002",
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

function getBlockUsers() {
    return blocks.filter((blockUser) => blockUser.blockBy === loggedInUser.id);
}

function getFollowUsers() {
    return follows.filter((followUser) => followUser.from === loggedInUser.id);
}

// フォロー数の制限チェック
function canFollowMore(FOLLOW_LIMIT) {
    // モック
    return true;
}

// フォローする処理
function followUserUseCase(userId, targetUserId) {
    let isLoggedIn;
    let isFollowed;
    let isBlocked;
    let isFollowLimit;
    let loggedInUser;
    let targetUser;
    const FOLLOW_LIMIT = 5000;

    // すでにログインしているかの確認
    isLoggedIn = checkIfLoggedIn();
    if (!isLoggedIn) {
        return "ログインしていません";
    }

    // すでにフォローしているかの確認
    isFollowed = getFollowUsers().some(
        (followUser) =>
            (followUser.from === userId && followUser.to) === targetUserId
    );
    if (isFollowed) {
        return { error: "すでにフォローしています" };
    }

    // ブロックされていないかの確認
    isBlocked = getBlockUsers().some(
        (blockUser) =>
            blockUser.from === targetUserId && blockUser.to === userId
    );
    if (isBlocked) {
        return { error: "フォローできません" };
    }

    // フォロー数の制限チェック
    if (!canFollowMore(userId, FOLLOW_LIMIT)) {
        return { error: "フォロー上限に達しました" };
    }

    // フォロー処理の実行
    follows.push({
        id: uuid(),
        from: userId,
        to: targetUserId,
    });
    return { success: "フォローしました" };
}

// 使用例
console.log("ログイン画面です");
const loggedInResult = await login("Eric", "password1");
console.log(`ログイン結果: ${loggedInResult}`);

if (loggedInResult) {
    console.log("\n他画面でフォロー処理をします");
    const followResult = followUserUseCase(loggedInUser.id, "USER00000002");
    console.log(followResult);
}

console.log(follows);
