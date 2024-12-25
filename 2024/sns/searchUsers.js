import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

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
        id: uuidv4(),
        blockTo: "USER00000001",
        blockBy: "USER00000004", // TomがEricをブロック
    },
    {
        id: uuidv4(),
        blockTo: "USER00000001",
        blockBy: "USER00000003", // BobがEricをブロック
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

function getBlockUsers() {
    return blockUsers.filter(
        (blockUser) => blockUser.blockTo === loggedInUser.id
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
    // ログインしているかを確認ログインしてるかの確認
    if (!checkIfLoggedIn()) {
        return "ログインしていません";
    }

    // ブロックしているユーザーを取得
    const blockUser = getBlockUsers();
    // ユーザー一覧を取得
    const users = getUsers();

    // 条件に合致するユーザーだけを取得
    // ※ 本来なら、検索条件で絞り込むためこここで条件を作るのは現実的ではないが...
    const resultUsers = [];
    for (const user of users) {
        if (
            user.id !== loggedInUser.id && // 自分自身は表示しない
            !blockUser.some((block) => block.blockBy === user.id) && // ブロックしているユーザーは表示しない
            isAdult &&
            user.age >= 20 && // 20歳以上のユーザーのみ表示
            searchHobbies &&
            searchHobbies.length > 0 && // 趣味が指定されている場合
            searchHobbies.some((hobby) => user.hobbies.includes(hobby)) && // 指定した趣味のユーザーのみ表示
            !user.isSecret
        ) {
            // 鍵アカウントでない
            resultUsers.push(user);
        }
    }

    let message = "条件に合致するユーザーはいません";
    if (resultUsers.length > 0) {
        message = `条件に合致するユーザーが ${resultUsers.length}件 見つかりました`;
    }

    return { resultUsers, message };
}

// 使用例
console.log("ログイン画面です");
const loggedInResult = login("Eric", "password1"); // ログイン
console.log(`ログイン結果: ${loggedInResult}`);

console.log("\n他画面でユーザーの検索一覧を確認します");
const searchResult = searchUseCase(true, ["野球", "読書"]);
console.log(searchResult);
