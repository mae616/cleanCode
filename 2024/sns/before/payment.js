function isUnder20(num) {
    return num < 20;
}

// 成人かどうかのチェック
function checkAdult(user) {
    return !isUnder20(user.age);
}

// 割引処理
function getDiscountedPrice(totalPrice) {
    if (!isUnder20(totalPrice)) {
        // 割引処理
        return totalPrice * 0.8;
    }
    return totalPrice;
}

// 使用例
const user = {
    age: 10,
};
const isAdult = checkAdult(user);
console.log(`ユーザーは ${isAdult ? "成人" : "未成年"} です`);

const totalPrice = 1000;
const discountedPrice = getDiscountedPrice(totalPrice);
console.log(`通常価格: ${totalPrice}円、割引後の価格: ${discountedPrice}円`);
