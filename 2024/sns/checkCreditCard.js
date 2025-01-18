// Luhnアルゴリズムによるクレジットカード番号のチェック
function checkCreditCardNumber(cardNumber) {
    let isEven = cardNumber.length % 2 === 0; // 偶数

    let sum = 0;
    for (var i = cardNumber.length - 1; i >= 0; i--) {
        let digit = Number(cardNumber[i]);
        if (isEven) {
            {
                digit *= 2;
                if (digit > 9) {
                    const [a, b] = String(digit).split("");
                    digit = Number(a) + Number(b);
                }
            }
        }
        sum += digit;
        isEven = !isEven;
    }
    return sum % 10 === 0;
}

// 使用例
console.log(checkCreditCardNumber("79927398713")); // true
console.log(checkCreditCardNumber("79927398715")); // false
