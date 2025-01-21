// 理想のタイプ（マッチング条件）
class IdealType {
    #minAge;
    #maxAge;
    #hobbies;
    #locations;
    constructor(minAge, maxAge, hobbies, locations) {
        this.#minAge = minAge;
        this.#maxAge = maxAge;
        this.#hobbies = hobbies;
        this.#locations = locations;
    }

    // マッチするかどうかを判定
    match(candidate) {
        return (
            candidate.age >= this.#minAge &&
            candidate.age <= this.#maxAge &&
            this.#locations.includes(candidate.location) &&
            this.#hobbies.some((hobby) => candidate.hobbies.includes(hobby))
        );
    }
}

// 想い人（ユーザー、誰かを愛そうとする人って意味でここでは使ってます）
class LovedOne {
    constructor(name, age, hobbies, location) {
        this.name = name;
        this.age = age;
        this.hobbies = hobbies;
        this.location = location;
        this.idealType = null; // 理想のタイプは最初は設定されていない
    }

    // 理想のタイプを想像した！（理想のタイプを設定）
    imagineIdealType(idealType) {
        this.idealType = idealType;
    }
}

// キューピッドがマッチングする（マッチング機能）
class CupidMatching {
    #criteria;
    constructor(lovedOne) {
        if (!lovedOne || !lovedOne.idealType) {
            throw new Error("理想のタイプが設定されていません");
        }
        this.#criteria = lovedOne.idealType; // 想い人の理想のタイプを基準にする
    }

    // マッチング判定
    match(candidate) {
        if (!candidate) {
            throw new Error("ユーザー情報が無効です");
        }

        if (this.#criteria.match(candidate)) {
            return `${candidate.name}とのマッチング成立！`;
        } else {
            return `${candidate.name}とのマッチングは成立しませんでした。`;
        }
    }
}

// 使用例
const alice = new LovedOne("Alice", 28, ["music", "travel", "food"], "Tokyo");
alice.imagineIdealType(
    new IdealType(25, 30, ["music", "travel"], ["Tokyo", "Osaka"])
);
const cupid = new CupidMatching(alice); // Aliceはキューピッドにマッチングをお願いした！

const charlie = new LovedOne("Charlie", 32, ["dance", "art"], "Kyoto");
console.log(cupid.match(charlie)); // Charlieとのマッチングは成立しませんでした

const bob = new LovedOne("Bob", 29, ["dance", "travel", "cat"], "Tokyo");
console.log(cupid.match(bob)); // Bobとのマッチング成立！
