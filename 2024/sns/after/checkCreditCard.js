// Luhnアルゴリズムによるクレジットカード番号のチェック
function checkCreditCardNumber(cardNumber) {
    // 偶数桁の計算
    const even = (digit) => {
        let result = digit * 2;
        if (result > 9) {
            const [ten, one] = String(result).split("");
            result = Number(ten) + Number(one);
        }
        return result;
    };

    // 本処理
    let isEven = cardNumber.length % 2 === 0; // 偶数
    let sum = 0;
    for (var i = cardNumber.length - 1; i >= 0; i--) {
        const digit = Number(cardNumber[i]);

        const calDigit = isEven ? even(digit) : digit;
        sum += calDigit;
        isEven = !isEven;
    }
    return sum % 10 === 0;
}

// 使用例
console.log(checkCreditCardNumber("79927398713")); // true
console.log(checkCreditCardNumber("79927398715")); // false
