const userActions = Object.freeze({
    POST: "post",
    COMMENT: "comment",
    SHARE: "share",
    LIKE: "like",
});

const userLevels = Object.freeze({
    BASIC: "basic",
    PREMIUM: "premium",
    VIP: "vip",
});

// データベースからユーザーレベルを取得する関数
function getUserLevel(userId) {
    // データベースからユーザーレベルを取得するロジック
    return userLevels.PREMIUM; // 仮のデータ
}

function calcPostPoints(data) {
    return (data) => {
        let points = 10;
        if (data.hasImage) points += 5;
        if (data.hasVideo) points += 10;
        if (data.text.length > 100) points += 3;
        return points;
    };
}

function calcCommentPoints(data) {
    return (data) => {
        let points = 5;
        if (data.text.length > 50) points += 2;
        if (data.campaignId === "summer2024") points *= 2;
        return points;
    };
}

function calcSharePoints(data) {
    return (data) => {
        let points = 8;
        if (data.platform === "twitter") points += 3;
        if (data.platform === "facebook") points += 2;
        return points;
    };
}

function calcLikePoints(data) {
    return (data) => {
        let points = 1;
        if (data.contentType === "premium") points = 2;
        return points;
    };
}

// アクティビティポイント計算
function calcActivityPoints(userId, action, data) {
    // アクションに応じたポイント計算処理を定義
    const actionFnc = {
        [userActions.POST]: calcPostPoints(data),
        [userActions.COMMENT]: calcCommentPoints(data),
        [userActions.SHARE]: calcSharePoints(data),
        [userActions.LIKE]: calcLikePoints(data),
    };

    // アクションに応じたポイント計算処理を実行
    let points = actionFnc[action](data);

    let bonusPoints = 0;

    // ユーザーレベルによるボーナス計算
    const userLevel = getUserLevel(userId);
    if (userLevel === userLevels.PREMIUM) {
        bonusPoints = points * 0.2;
    } else if (userLevel === userLevels.VIP) {
        bonusPoints = points * 0.5;
    }

    // 日付に基づくボーナス
    const now = new Date();
    if (now.getDay() === 0 || now.getDay() === 6) {
        bonusPoints += points * 0.1; // 週末ボーナス
    }

    return Math.floor(points + bonusPoints);
}

// 使用例
const userId = "user123";
const action = userActions.POST;
const data = { hasImage: true, hasVideo: false, text: "こんにちは！" };

const points = calcActivityPoints(userId, action, data);
console.log(`ユーザー ${userId} のアクティビティポイント: ${points}`);
