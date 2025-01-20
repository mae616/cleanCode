function isAdult(age) {
    return age >= 20;
}
// 成人かどうかのチェック
function checkAdult(user) {
    return isAdult(user.age);
}

function isDiscount(totalPrice) {
    return totalPrice >= 20;
}

// 割引処理
function getDiscountedPrice(totalPrice) {
    if (isDiscount(totalPrice)) {
        // 割引処理
        return totalPrice * 0.8;
    }
    return totalPrice;
}

// 使用例
const user = {
    age: 10,
};
const isUserAdult = checkAdult(user);
console.log(`ユーザーは ${isUserAdult ? "成人" : "未成年"} です`);

const totalPrice = 1000;
const discountedPrice = getDiscountedPrice(totalPrice);
console.log(`通常価格: ${totalPrice}円、割引後の価格: ${discountedPrice}円`);
