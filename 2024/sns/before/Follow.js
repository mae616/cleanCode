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
        from: "USER00000001", // EricがAliceをフォロー
        to: "USER00000002",
    },
];

// 認証状態を管理するクラス
class AuthContext {
    #currentUser = null;
    static #instance = null;

    constructor() {
        if (AuthContext.#instance) {
            throw new Error("AuthContextは直接インスタンス化できません");
        }
        AuthContext.#instance = this;
    }

    static getInstance() {
        if (!AuthContext.#instance) {
            AuthContext.#instance = new AuthContext();
        }
        return AuthContext.#instance;
    }

    setCurrentUser(user) {
        this.#currentUser = user;
    }

    getCurrentUser() {
        return this.#currentUser;
    }

    isLoggedIn() {
        return this.#currentUser !== null;
    }
}

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
    return blockUsers.filter(
        (blockUser) => blockUser.blockBy === loggedInUser.id
    );
}

function getUsers() {
    return users
        .filter((user) => !user.isDelete) // 論理削除されていないユーザーを取得
        .map((user) => {
            return {
                id: user.id,
                userName: user.userName,
                age: user.age,
                biography: user.biography,
                hobbies: user.hobbies,
                isSecret: user.isSecret,
            };
        });
}

// フォロー関連の処理
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

    // ブロックされていないかの確認

    // フォロー数の制限チェック
    if (!canFollowMore(userId, FOLLOW_LIMIT)) {
        return { error: "フォロー上限に達しました" };
    }

    // フォロー処理の実行
    return handleFollowAction(userId, targetUserId);
}

// 使用例
console.log("ログイン画面です");
const loggedInResult = await login("Eric", "password1");

console.log("\n他画面でユーザーの検索一覧を確認します");
const searchResult = searchUseCase(true, ["野球", "読書"]);
console.log(searchResult);
