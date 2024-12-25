const cart = {
  pendingItems: [{ id: "SYOUHIN001", count: 1, price: 500 }],
  totalCount: 1,
  totalPrice: 500,
};

// 合計アイテム数の計算
const calcTotalCount = () => {
  cart.totalCount = cart.pendingItems.reduce(
    (prev, current) => prev + current.count,
    0
  );
};

// 合計価格の計算
const calcTotalPrice = () => {
  cart.totalPrice = cart.pendingItems.reduce(
    (prev, current) => prev + current.price * current.count,
    0
  );
};

// カートに購入予定アイテムを追加する関数
export function addItemToCart(itemId, itemCount, itemPrice) {
  const existingItem = cart.pendingItems.find((item) => item.id === itemId);

  if (existingItem) {
    // 既存アイテムがあれば購入数を増加
    existingItem.count += itemCount;
  } else {
    // 新規アイテムを追加
    cart.pendingItems.push({ id: itemId, count: itemCount, price: itemPrice });
  }

  // 合計の再計算
  calcTotalCount();
  calcTotalPrice();
}

export function printCart() {
  console.log(cart);
}
