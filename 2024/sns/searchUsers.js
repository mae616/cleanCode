// [6] コードの複雑化を避ける のコード例
// 以下のコードは、業務で使うようなSNSアプリのユーザーの検索機能を簡易的に実装したものです。
// 実行方法 : node ./sns/searchUsers.js

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
    {
        id: "USER00000004",
        userName: "Tom",
        password: await encryptPassword("password4"),
        age: 35,
        biography: "私は鳥です🐦",
        hobbies: ["読書", "料理"],
        isSecret: false,
        isDelete: false,
    },
    {
        id: "USER00000005",
        userName: "Ken",
        password: await encryptPassword("password5"),
        age: 40,
        biography: "私は熊です🐻",
        hobbies: ["釣り", "映画鑑賞"],
        isSecret: true,
        isDelete: false,
    },
    {
        id: "USER00000006",
        userName: "John",
        password: await encryptPassword("password6"),
        age: 45,
        biography: "私は猿です🐒",
        hobbies: ["旅行", "読書"],
        isSecret: false,
        isDelete: false,
    },
    {
        id: "USER00000007",
        userName: "Mike",
        password: await encryptPassword("password7"),
        age: 15,
        biography: "私は虫です🐞",
        hobbies: ["ゲーム", "野球"],
        isSecret: false,
        isDelete: false,
    },
    {
        id: "USER00000008",
        userName: "Chris",
        password: await encryptPassword("password8"),
        age: 50,
        biography: "私は蛇です🐍",
        hobbies: ["映画鑑賞", "野球"],
        isSecret: false,
        isDelete: false,
    },
];

const blockUsers = [
    {
        id: uuid(),
        blockTo: "USER00000004",
        blockBy: "USER00000001", // EricがTomをブロック
    },
    {
        id: uuid(),
        blockTo: "USER00000003",
        blockBy: "USER00000001", // EricがBobをブロック
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

function searchUseCase(isAdult, searchHobbies) {
    // ログインしているかを確認
    if (!checkIfLoggedIn()) {
        return "ログインしていません";
    }

    const blockUser = getBlockUsers(); // ブロックしているユーザーを取得
    const users = getUsers(); // ユーザー一覧を取得

    // 検索条件に合致するユーザーだけを取得
    // ※ 本来なら、検索条件で絞り込むためこここで条件を作るのは現実的ではないが...例として無理やりなコードで書いてます
    const resultUsers = [];
    for (const user of users) {
        if (
            user.id !== loggedInUser.id && // 自分自身は表示しない
            !blockUser.some((block) => block.blockTo === user.id) && // ブロックしているユーザーは表示しない
            ((isAdult && user.age >= 20) || !isAdult) && // 20歳以上のユーザーのみ表示
            ((searchHobbies?.length > 0 && // 趣味が指定されている場合
                searchHobbies.some((hobby) => user.hobbies.includes(hobby))) ||
                !searchHobbies) && // 指定した趣味のユーザーのみ表示
            !user.isSecret // 検索対象が鍵アカウント設定でないかを判定
        ) {
            resultUsers.push(user);
        }
    }

    const message =
        resultUsers.length > 0
            ? `条件に合致するユーザーが ${resultUsers.length}件 見つかりました`
            : "条件に合致するユーザーはいません";

    return { resultUsers, message };
}

// 使用例
console.log("ログイン画面です");
const loggedInResult = await login("Eric", "password1");

console.log("\n他画面でユーザーの検索一覧を確認します");
const searchResult = searchUseCase(true, ["野球", "読書"]);
console.log(searchResult);
