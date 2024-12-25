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
        password: encryptPassword("password2"),
    },
    {
        id: uuidv4(),
        isAdmin: true,
        userName: "Bob",
        password: encryptPassword("password3"),
    },
    {
        id: uuidv4(),
        isAdmin: false,
        userName: "Tom",
        password: encryptPassword("password4"),
    },
    {
        id: uuidv4(),
        isAdmin: true,
        userName: "Ken",
        password: encryptPassword("password5"),
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

function checkIfAdmin() {
    return loggedInUser && loggedInUser.isAdmin;
}

// 使用例
console.log("ログイン画面です");
const loggedInResult = login("Alice", "password2"); // ログイン
console.log(`ログイン結果: ${loggedInResult}`);

console.log("\n他画面でユーザーのステータスを確認します");

// ログインしているか確認
const isLoggedIn = checkIfLoggedIn();
console.log(`ログインしているか: ${isLoggedIn}`);

// 管理者か確認
if (isLoggedIn) {
    const isAdmin = checkIfAdmin();
    console.log(`管理者か: ${isAdmin}`);
} else {
    console.log("ログインしていないので管理者かどうかはわかりません");
}
